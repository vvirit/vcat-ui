# ===== 1) 前端构建：Yarn（用 Corepack，避免全局装）=====
FROM node:20-slim AS fe-build

# 编译工具链（应对 node-gyp / sharp / esbuild 等）
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ git \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /fe

# 用 Corepack 启用并固定 Yarn（根据你项目实际选择 v1 或 v4）
# 如果你的项目是 Yarn v1（常见）：用 1.22.22；若是 Berry：换成 4.x
RUN corepack enable && corepack prepare yarn@1.22.22 --activate \
 && yarn config set registry https://registry.npmmirror.com

# 先复制 lockfile，提升缓存命中
COPY admin-frontend/package.json admin-frontend/yarn.lock ./

# 安装依赖（与 yarn.lock 严格一致）
RUN yarn install --frozen-lockfile

# 复制源码并构建（Vite/CRA 都可）
COPY admin-frontend/ ./
RUN yarn build

# =========================
# 2) 后端构建：Gradle + JDK 21
# =========================
FROM eclipse-temurin:21-jdk AS be-build
WORKDIR /be

# 复制 Gradle Wrapper 必要文件
COPY admin-backend/gradlew ./gradlew
COPY admin-backend/gradle/wrapper ./gradle/wrapper
RUN chmod +x ./gradlew

# 复制构建脚本
COPY admin-backend/settings.gradle.kts ./settings.gradle.kts
COPY admin-backend/build.gradle.kts ./build.gradle.kts

# 预热依赖
RUN ./gradlew --no-daemon build -x test || true

# 源码
COPY admin-backend/src ./src

# 拷贝前端产物到静态资源目录（Vite=dist, CRA=build）
COPY --from=fe-build /fe/dist/ ./src/main/resources/static/

# 构建 bootJar
RUN ./gradlew --no-daemon clean bootJar -x test

# =========================
# 3) 运行镜像：Temurin JRE21（Debian 基底） + Postgres(发行版默认) + Redis + tini
# =========================
FROM eclipse-temurin:21-jre

ENV DEBIAN_admin-admin-frontend=noninteractive TZ=Asia/Taipei LANG=C.UTF-8

# 可选：替换 Debian 源为本地镜像，提高 apt 成功率（任选一条能成功的，失败了也无妨）
RUN sed -i 's|deb.debian.org|mirrors.tencent.com|g' /etc/apt/sources.list || true \
 || sed -i 's|deb.debian.org|mirrors.aliyun.com|g' /etc/apt/sources.list || true

# 安装：PostgreSQL（发行版默认版本，Debian12=15）、客户端、Redis、tini、gosu
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl gosu procps tini tzdata \
    postgresql postgresql-client \
    redis-server \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# 复制后端 bootJar
COPY --from=be-build /be/build/libs/*.jar /app/app.jar

# 数据目录
RUN mkdir -p /var/lib/postgresql/data /var/lib/redis \
 && chown -R postgres:postgres /var/lib/postgresql \
 && chown -R redis:redis /var/lib/redis

# 环境变量（可在 docker run -e 覆盖）
ENV PGDATA=/var/lib/postgresql/data \
    PGUSER_APP=appuser \
    PGPASS_APP=apppass \
    PGDB_APP=appdb \
    SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/appdb \
    SPRING_DATASOURCE_USERNAME=appuser \
    SPRING_DATASOURCE_PASSWORD=apppass \
    SPRING_REDIS_HOST=localhost \
    SPRING_REDIS_PORT=34723 \
    APP_PASSWORD=pass \
    JAVA_OPTS=""

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 34722
EXPOSE 34723
VOLUME ["/var/lib/postgresql/data", "/var/lib/redis"]

# 用 tini 做 PID1，确保优雅关停
ENTRYPOINT ["/usr/bin/tini","--","/entrypoint.sh"]
