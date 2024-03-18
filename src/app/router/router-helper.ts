import { APP_ROUTE, type AppRoute } from '../constants/app-routes.ts';

const isAppRoute = (value: unknown): value is AppRoute =>
  Object.values(APP_ROUTE).findIndex((route) => route === value) !== -1;

export default isAppRoute;
