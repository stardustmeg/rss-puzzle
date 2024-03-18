import type { ReduxStore } from '../../lib/store/types.ts';
import type { Router } from '../../router/router.ts';
import type { Action, State } from '../../store/reducer.ts';

import { updateNextRound } from '../../components/playground/helpers/playground-helper.ts';
import { APP_ROUTE } from '../../constants/app-routes.ts';
import { buttonsTextContent, gameDescriptions, tagNames } from '../../constants/constants.ts';
import { BaseElement } from '../../utils/base-element.ts';
import styles from './start.module.scss';

export default function createStartPage(store: ReduxStore<State, Action>, router: Router): BaseElement {
  const currentState = store.getState();
  const { userFirstName, userLastName } = currentState;

  const personalizedGreeting = `Hi, ${userFirstName} ${userLastName}!`;
  const startPage = new BaseElement(tagNames.div, [styles.pageContainer], {}, personalizedGreeting);
  const gameDescription = new BaseElement(tagNames.div, [styles.description], {}, gameDescriptions.MAIN_DESCRIPTION);
  const gameName = new BaseElement(tagNames.div, [styles.gameName], {}, gameDescriptions.GAME_NAME);

  const startButton = document.createElement(tagNames.button);
  startButton.textContent = buttonsTextContent.START;

  startButton.onclick = (event): void => {
    event.preventDefault();
    updateNextRound(store);
    router.navigateTo(APP_ROUTE.Main);
  };

  const chooseGameButton = document.createElement(tagNames.button);
  chooseGameButton.textContent = buttonsTextContent.CHOOSE_GAME;

  chooseGameButton.onclick = (event): void => {
    event.preventDefault();
    router.navigateTo(APP_ROUTE.ChooseGame);
  };

  const pageWrapper = new BaseElement(tagNames.div, [styles.wrapper]);
  pageWrapper.append(gameName, gameDescription, chooseGameButton, startButton);

  startPage.append(pageWrapper);

  return startPage;
}
