export const APP_ROUTE = {
  ChooseGame: 'choose-game',
  Login: 'login',
  Main: 'main',
  Start: 'start',
  Statistics: 'statistics',
} as const;

type AppRoute = '404' | (typeof APP_ROUTE)[keyof typeof APP_ROUTE];

export type { AppRoute };
