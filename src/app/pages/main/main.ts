import type { ReduxStore } from '../../lib/store/types.ts';
import type { Router } from '../../router/router.ts';
import type { Action, State } from '../../store/reducer.ts';

import { clearOutCanvas } from '../../components/canvas/canvas.ts';
import { updateNextRound } from '../../components/playground/helpers/playground-helper.ts';
import Playground from '../../components/playground/playground.ts';
import { APP_ROUTE } from '../../constants/app-routes.ts';
import { buttonsTextContent, tagNames } from '../../constants/constants.ts';
import { addFinishedRound, setCurrentSentenceIndex } from '../../store/actions.ts';
import { BaseElement } from '../../utils/base-element.ts';
import styles from './main.module.scss';

// eslint-disable-next-line max-lines-per-function
export default function createPage(store: ReduxStore<State, Action>, router: Router): BaseElement {
  const mainPage = new BaseElement(tagNames.div, [styles.pageContainer]);

  const { currentGameLevel, currentGameRound } = store.getState();

  const currentLevel = `Level ${currentGameLevel + 1}: Round ${currentGameRound + 1}`;

  const roundInfo = new BaseElement(tagNames.div, [styles.roundInfo], {}, currentLevel);

  const playground = new Playground(store);

  const chooseGameButton = document.createElement(tagNames.button);
  chooseGameButton.textContent = buttonsTextContent.CHOOSE_GAME;

  chooseGameButton.onclick = (event): void => {
    event.preventDefault();
    router.navigateTo(APP_ROUTE.ChooseGame);
  };

  const iDontKnowButton = document.createElement(tagNames.button);
  iDontKnowButton.textContent = buttonsTextContent.I_DONT_KNOW;

  iDontKnowButton.onclick = (event): void => {
    event.preventDefault();
    handleIDontKnowButtonClick(store, iDontKnowButton, playground, continueButton, statisticsButton, nextRound);
  };

  const continueButton = document.createElement(tagNames.button);
  continueButton.textContent = buttonsTextContent.CONTINUE;

  continueButton.onclick = (event): void => {
    event.preventDefault();
    handleContinueButtonClick(store, continueButton, playground, iDontKnowButton, statisticsButton, nextRound);
  };

  const nextRound = document.createElement(tagNames.button);
  nextRound.classList.add(styles.hidden);
  nextRound.textContent = buttonsTextContent.CONTINUE;

  nextRound.onclick = (event): void => {
    event.preventDefault();
    router.navigateTo(APP_ROUTE.Main);
    store.dispatch(setCurrentSentenceIndex(0));
  updateNextRound(store);
  };

  const statisticsButton = document.createElement(tagNames.button);
  statisticsButton.textContent = buttonsTextContent.STATISTICS;
  statisticsButton.classList.add(styles.hidden);

  statisticsButton.onclick = (event): void => {
    event.preventDefault();
    handleStatisticsButtonClick(store, router);
  };

  const buttonsWrapper = new BaseElement(tagNames.div, [styles.wrapper]);
  buttonsWrapper.append(chooseGameButton, iDontKnowButton, continueButton, nextRound, statisticsButton);

  mainPage.append(roundInfo, playground, buttonsWrapper);

  return mainPage;
}

function handleStatisticsButtonClick(store: ReduxStore<State, Action>, router: Router): void {
  router.navigateTo(APP_ROUTE.Statistics);
  store.dispatch(setCurrentSentenceIndex(0));
  updateNextRound(store);
}

// TBD remove duplication, redundant code, and get rid of magic
function handleContinueButtonClick(
  store: ReduxStore<State, Action>,
  currentButton: HTMLElement,
  playground: Playground,
  buttonToHide: HTMLElement,
  buttonToShow: HTMLElement,
  secondButtonToShow: HTMLElement,
): void {
  const { currentGameLevel, currentGameRound, currentSentenceIndex } = store.getState();

  if (currentSentenceIndex < 9) {
    playground.addCompletedPhraseWithAudio();
    playground.moveToNextSentence();
    playground.displayImage();
  } else if (currentSentenceIndex === 9) {
    clearOutCanvas();
    playground.addCompletedPhraseWithAudio();
    currentButton.classList.add(styles.hidden);
    buttonToHide.classList.add(styles.hidden);

    buttonToShow.classList.remove(styles.hidden);
    secondButtonToShow.classList.remove(styles.hidden);

    playground.displayInfoAboutRound();

    store.dispatch(addFinishedRound({ level: currentGameLevel, round: currentGameRound }));
  }
}

function handleIDontKnowButtonClick(
  store: ReduxStore<State, Action>,
  currentButton: HTMLElement,
  playground: Playground,
  buttonToHide: HTMLElement,
  buttonToShow: HTMLElement,
  secondButtonToShow: HTMLElement,
): void {
  const { currentGameLevel, currentGameRound, currentSentenceIndex } = store.getState();

  if (currentSentenceIndex < 9) {
    playground.addCompletedNotPhraseWithAudio();
    playground.moveToNextSentence();
    playground.displayImage();
  } else if (currentSentenceIndex === 9) {
    clearOutCanvas();
    playground.addCompletedNotPhraseWithAudio();
    currentButton.classList.add(styles.hidden);
    buttonToHide.classList.add(styles.hidden);

    buttonToShow.classList.remove(styles.hidden);
    secondButtonToShow.classList.remove(styles.hidden);

    playground.displayInfoAboutRound();

    store.dispatch(addFinishedRound({ level: currentGameLevel, round: currentGameRound }));
  }
}
