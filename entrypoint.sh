#!/usr/bin/env bash
set -euo pipefail

echo "[entrypoint] Booting..."

# ---------- 定位 pg_ctl / initdb，适配 Debian 上的 PG 版本（15/未来） ----------
PG_BINDIR="$(dirname "$(command -v pg_ctl)" 2>/dev/null || true)"
if [ -z "${PG_BINDIR}" ] || [ ! -x "${PG_BINDIR}/pg_ctl" ]; then
  PG_BINDIR="$(dirname "$(ls -1 /usr/lib/postgresql/*/bin/pg_ctl 2>/dev/null | head -n1)" 2>/dev/null || true)"
fi
if [ -z "${PG_BINDIR}" ] || [ ! -x "${PG_BINDIR}/pg_ctl" ]; then
  echo "[entrypoint] ERROR: cannot locate pg_ctl"; exit 1
fi

# ---------- 优雅关停 ----------
term_handler() {
  echo "[entrypoint] Stopping services..."
  # 停 Spring Boot
  if [ -n "${JAVA_PID:-}" ] && ps -p "${JAVA_PID}" >/dev/null 2>&1; then
    kill -TERM "${JAVA_PID}" || true
    wait "${JAVA_PID}" || true
  fi
  # 停 Redis
  if command -v redis-cli >/dev/null 2>&1; then
    redis-cli shutdown || true
  fi
  # 停 PostgreSQL
  if [ -d "${PGDATA}" ]; then
    gosu postgres "${PG_BINDIR}/pg_ctl" -D "${PGDATA}" -m fast stop || true
  fi
  exit 0
}
trap term_handler TERM INT

# ---------- 初始化 PostgreSQL（首启） ----------
if [ ! -s "${PGDATA}/PG_VERSION" ]; then
  echo "[entrypoint] Initializing PostgreSQL cluster..."
  install -d -o postgres -g postgres "${PGDATA}"
  gosu postgres "${PG_BINDIR}/initdb" -D "${PGDATA}" --encoding=UTF8 --locale=C

  # 安全与本地访问
  echo "password_encryption = 'scram-sha-256'" >> "${PGDATA}/postgresql.conf"
  echo "listen_addresses = 'localhost'"        >> "${PGDATA}/postgresql.conf"
  echo "host all all 127.0.0.1/32 scram-sha-256" >> "${PGDATA}/pg_hba.conf"
  echo "host all all ::1/128 scram-sha-256"      >> "${PGDATA}/pg_hba.conf"

  # 启动临时服务做初始化
  gosu postgres "${PG_BINDIR}/pg_ctl" -D "${PGDATA}" -l "${PGDATA}/logfile" start
  sleep 2

  # 创建应用用户与数据库
  if ! gosu postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${PGUSER_APP}'" | grep -q 1; then
    gosu postgres psql -c "CREATE USER ${PGUSER_APP} WITH PASSWORD '${PGPASS_APP}' LOGIN;"
  fi
  if ! gosu postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${PGDB_APP}'" | grep -q 1; then
    gosu postgres createdb -O "${PGUSER_APP}" "${PGDB_APP}"
  fi

  gosu postgres "${PG_BINDIR}/pg_ctl" -D "${PGDATA}" stop
fi

# ---------- 启动 PostgreSQL 常驻 ----------
echo "[entrypoint] Starting PostgreSQL..."
gosu postgres "${PG_BINDIR}/pg_ctl" -D "${PGDATA}" -l "${PGDATA}/logfile" start

# ---------- 启动 Redis ----------
echo "[entrypoint] Starting Redis..."

cat >/etc/redis/redis.conf <<EOF
dir /var/lib/redis
appendonly yes
# 允许远程访问
bind 0.0.0.0
protected-mode no
port 34723
EOF

# 如果设置了 REDIS_PASSWORD，则写入 requirepass
if [ -n "$APP_PASSWORD" ]; then
  echo "requirepass $APP_PASSWORD" >> /etc/redis/redis.conf
fi

chown -R redis:redis /var/lib/redis
gosu redis redis-server /etc/redis/redis.conf &
REDIS_PID=$!

# ---------- 启动 Spring Boot ----------
echo "[entrypoint] Starting Spring Boot..."
set +e
java ${JAVA_OPTS} -jar /app/app.jar &
JAVA_PID=$!
set -e

# ---------- 前台阻塞，等待 Spring 进程 ----------
wait "${JAVA_PID}"
