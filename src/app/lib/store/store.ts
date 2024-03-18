import type { Reducer, ReduxStore } from './types';

import { eventNames } from '../../constants/constants.ts';
import { STORAGE_KEY, saveCurrentStateToLocalStorage } from '../../services/local-storage.service.ts';

class Store<S, A> implements ReduxStore<S, A> {
  private listeners: VoidFunction[] = [];

  private rootReducer: Reducer<S, A>;

  private state: S;

  constructor(initialData: S, rootReducer: Reducer<S, A>) {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.state = structuredClone(JSON.parse(storedData)); // TBD fix specifying type later!
    } else {
      this.state = structuredClone(initialData);
    }
    this.rootReducer = rootReducer;

    window.addEventListener(eventNames.BEFOREUNLOAD, () => saveCurrentStateToLocalStorage(this.state));
  }

  public dispatch(action: A): A {
    this.state = this.rootReducer(this.state, action);
    this.listeners.forEach((listener) => {
      listener();
    });
    return action;
  }

  public getState(): S {
    return structuredClone(this.state);
  }

  public subscribe(listener: VoidFunction): VoidFunction {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

const createStore = <S, A>(reducer: Reducer<S, A>, initialState: S): Store<S, A> =>
  new Store<S, A>(initialState, reducer);

export default createStore;
