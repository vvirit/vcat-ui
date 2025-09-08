// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    user: `${ROOTS.DASHBOARD}/user`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    config: {
      root: `${ROOTS.DASHBOARD}/config`,
      proxyList: `${ROOTS.DASHBOARD}/config/proxy-list`,
      systemSettingList: `${ROOTS.DASHBOARD}/config/system-setting-list`,
      webHookList: `${ROOTS.DASHBOARD}/config/web-hook-list`,
    },
    task: {
      root: `${ROOTS.DASHBOARD}/task`,
      nodeList: `${ROOTS.DASHBOARD}/task/node-list`,
      taskList: `${ROOTS.DASHBOARD}/task/task-list`,
      taskInstanceList: `${ROOTS.DASHBOARD}/task/task-instance-list`,
      queueRouterList: `${ROOTS.DASHBOARD}/task/queue-router-list`,
    },
    interpark: {
      root: `${ROOTS.DASHBOARD}/interpark`,
      performList: `${ROOTS.DASHBOARD}/interpark/perform-list`,
      preOrderList: `${ROOTS.DASHBOARD}/interpark/pre-order-list`,
      orderList: `${ROOTS.DASHBOARD}/interpark/order-list`,
      seatRotatePoolList: `${ROOTS.DASHBOARD}/interpark/seat-rotate-pool-list`,
      accountList: `${ROOTS.DASHBOARD}/interpark/account-list`,
      accountGroupList: `${ROOTS.DASHBOARD}/interpark/account-group-list`,
    },
  },
};
