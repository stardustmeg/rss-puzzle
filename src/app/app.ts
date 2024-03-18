import type { Route } from './router/router.ts';
import type { Action, State } from './store/reducer.ts';

import styles from './app.module.scss';
import { APP_ROUTE } from './constants/app-routes.ts';
import { buttonsTextContent, initialState, tagNames } from './constants/constants.ts';
import createStore from './lib/store/store.ts';
import { Router } from './router/router.ts';
import { STORAGE_KEY, clearLocalStorage } from './services/local-storage.service.ts';
import { updateStoreToInitialState } from './store/actions.ts';
import { rootReducer } from './store/reducer.ts';
import { BaseElement } from './utils/base-element.ts';

export const store = createStore<State, Action>(rootReducer, initialState);

export const getCurrentStateFromStore = (): State => store.getState();

export default class App {
  private readonly rootContainer: BaseElement;

  private readonly router: Router;

  constructor() {
    this.rootContainer = new BaseElement(tagNames.div, [styles.root]);
    const background = new BaseElement(tagNames.div, [styles.background]);
    const wrapper = new BaseElement(tagNames.div, [styles.wrapper]);
    this.rootContainer.append(...this.createLinkButtons(), background, wrapper);

    const storedData = localStorage.getItem(STORAGE_KEY);
    let isLoggedIn = false;
    if (storedData) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const userData = JSON.parse(storedData); // TBD check data from LocalStorage later
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isLoggedIn = userData.userFirstName !== '';
    }

    const initialRoute = isLoggedIn ? APP_ROUTE.Start : APP_ROUTE.Login;

    this.router = this.createRouter(wrapper, initialRoute);
    this.router.navigateTo(initialRoute);
  }

  // eslint-disable-next-line max-lines-per-function
  private createRouter(routerOutlet: BaseElement, defaultPath: string): Router {
    const routes: Route[] = [
      {
        component: async (): Promise<BaseElement> => {
          const { default: createPage } = await import('./pages/start/start.ts');
          return createPage(store, this.router);
        },
        name: APP_ROUTE.Start,
      },
      {
        component: async (): Promise<BaseElement> => {
          const { default: createPage } = await import('./pages/choose-game/choose-game.ts');
          return createPage(store, this.router);
        },
        name: APP_ROUTE.ChooseGame,
      },
      {
        component: async (): Promise<BaseElement> => {
          const { default: createPage } = await import('./pages/statistics/statistics.ts');
          return createPage(store, this.router);
        },
        name: APP_ROUTE.Statistics,
      },
      {
        component: async (): Promise<BaseElement> => {
          const { default: createPage } = await import('./pages/login/login.ts');
          return createPage(store, this.router);
        },
        name: APP_ROUTE.Login,
      },
      {
        component: async (): Promise<BaseElement> => {
          const { default: createPage } = await import('./pages/main/main.ts');
          return createPage(store, this.router);
        },
        name: APP_ROUTE.Main,
      },
    ];
    const notFoundComponent = async (): Promise<BaseElement> => {
      const { default: createPage } = await import('./pages/not-found/not-found.ts');
      return createPage(store, this.router);
    };

    return new Router(
      routes,
      async (route) => {
        const component = await route.component();
        routerOutlet.replaceChildren(component);
      },
      notFoundComponent,
      defaultPath,
    );
  }

  public createLinkButtons(): HTMLButtonElement[] {
    const logOutButton = document.createElement(tagNames.button);
    logOutButton.classList.add(styles.logOutButton);

    logOutButton.textContent = buttonsTextContent.LOG_OUT;

    logOutButton.onclick = (event): void => {
      event.preventDefault();

      const CONFIRMATION_TEXT_CONTENT =
        'Are you sure you want to log out?\nThis will erase all your progress!\n\nP.S. I\'m not "alert", I\'m "confirm" 😁';
      // eslint-disable-next-line no-alert
      if (confirm(CONFIRMATION_TEXT_CONTENT)) {
        clearLocalStorage();
        store.dispatch(updateStoreToInitialState(initialState));
        this.router.navigateTo(APP_ROUTE.Login);
      }
    };

    return Object.entries(APP_ROUTE)
      .map(([name, route]) => {
        const button = document.createElement(tagNames.button);
        button.classList.add(styles.hidden);
        button.textContent = name;

        button.onclick = (event): void => {
          event.preventDefault();
          this.router.navigateTo(route);
        };

        return button;
      })
      .concat(logOutButton);
  }

  public destroy(): void {
    this.rootContainer.remove();
    this.router.destroy();
  }

  public init(): void {
    this.rootContainer.appendTo(document.body);
  }
}
