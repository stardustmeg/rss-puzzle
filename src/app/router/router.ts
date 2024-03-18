import type { AppRoute } from '../constants/app-routes.ts';
import type { BaseElement } from '../utils/base-element.ts';

import isAppRoute from './router-helper.ts';

export interface Route {
  component: () => Promise<BaseElement>;
  name: AppRoute;
}

export class Router {
  private onHistoryChangeHandler = (event: PopStateEvent): void => {
    const routeName: unknown = event.state;

    if (!isAppRoute(routeName)) {
      return;
    }

    this.changePage(routeName);
  };

  constructor(
    private readonly routes: Route[],
    private onHistoryChange: (route: Route) => void,
    private notFoundComponent: () => Promise<BaseElement>,
    defaultPath?: string,
  ) {
    window.addEventListener('popstate', this.onHistoryChangeHandler);

    if (defaultPath) {
      this.navigateTo(defaultPath);
    } else {
      const pathName = window.location.pathname.slice(1) || 'start';

      this.navigateTo(pathName);
    }
  }

  private changePage(pathName: string): Route {
    const route = this.routes.find((route) => route.name === pathName) ?? {
      component: this.notFoundComponent,
      name: '404',
    };

    this.onHistoryChange(route);

    return route;
  }

  public destroy(): void {
    window.removeEventListener('popstate', this.onHistoryChangeHandler);
  }

  public navigateTo(pathName: string): void {
    const { name: routeName } = this.changePage(pathName);

    if (routeName === '404') {
      history.replaceState(routeName, '', routeName);
    } else {
      history.pushState(routeName, '', routeName);
    }
  }
}
