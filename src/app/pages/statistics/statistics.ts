import type { ReduxStore } from '../../lib/store/types.ts';
import type { Router } from '../../router/router.ts';
import type { Action, State } from '../../store/reducer.ts';

import { formatAuthorName, updateNextRound } from '../../components/playground/helpers/playground-helper.ts';
import { APP_ROUTE } from '../../constants/app-routes.ts';
import { buttonsTextContent, dataLinks, eventNames, tagNames } from '../../constants/constants.ts';
import { BaseElement } from '../../utils/base-element.ts';
import styles from './statistics.module.scss';

export default function createPage(store: ReduxStore<State, Action>, router: Router): BaseElement {
  const statisticsPage = new Statistics(store);
  const buttonsContainer = new BaseElement(tagNames.div, [styles.buttonsContainer]);

  const continueButton = document.createElement(tagNames.button);
  continueButton.textContent = buttonsTextContent.CONTINUE;

  continueButton.onclick = (event): void => {
    event.preventDefault();
    // updateNextRound(store);
    router.navigateTo(APP_ROUTE.Main);
  };

  const chooseGameButton = document.createElement(tagNames.button);
  chooseGameButton.textContent = buttonsTextContent.CHOOSE_GAME;

  chooseGameButton.onclick = (event): void => {
    event.preventDefault();
    router.navigateTo(APP_ROUTE.ChooseGame);
  };

  buttonsContainer.append(chooseGameButton, continueButton);
  statisticsPage.append(buttonsContainer);

  return statisticsPage;
}

export class Statistics extends BaseElement {
  private learnedPhrasesContainer: HTMLElement;

  private miniatureContainer: HTMLElement;

  private miniatureField: HTMLElement;

  private notLearnedPhrasesContainer: HTMLElement;

  private store: ReduxStore<State, Action>;

  constructor(store: ReduxStore<State, Action>) {
    super(tagNames.div, [styles.pageContainer]);

    this.learnedPhrasesContainer = new BaseElement(
      tagNames.div,
      [styles.phrasesContainer],
      {},
      'Learned Phrases',
    ).getNode();
    this.notLearnedPhrasesContainer = new BaseElement(
      tagNames.div,
      [styles.phrasesContainer],
      {},
      'Not Learned Phrases',
    ).getNode();
    this.miniatureContainer = new BaseElement(tagNames.div, [styles.miniatureContainer]).getNode();
    this.miniatureField = new BaseElement(tagNames.div, [styles.miniatureField]).getNode();

    this.miniatureField.append(this.miniatureContainer);

    this.append(this.miniatureField, this.learnedPhrasesContainer, this.notLearnedPhrasesContainer);

    this.store = store;

    this.updateMiniature();
    this.displayStatistics();

    this.store.subscribe(() => {
      this.updateMiniature();
      this.displayStatistics();
    });
  }

  private displayPhrasesStatisctics(phrases: string[], container: HTMLElement): void {
    phrases.forEach((item) => {
      const [text, path] = item.split('@');
      const audioLink = `${dataLinks.audioLink}${path}`;

      const phraseContainer = new BaseElement(tagNames.div, [styles.phraseContainer]).getNode();
      const phraseElement = new BaseElement(tagNames.div, [styles.phraseElement], {}, text).getNode();
      const audioContainer = new BaseElement(tagNames.div, [styles.audioContainer]).getNode();
      const glowingAudioCircle = new BaseElement(tagNames.div, [styles.glowingAudioCircle]).getNode();

      let audioElement: HTMLAudioElement;

      audioContainer.addEventListener(eventNames.CLICK, async () => {
        if (audioElement && !audioElement.paused) {
          audioElement.pause();
          glowingAudioCircle.classList.add(styles.pulsate);
        } else {
          audioElement = document.createElement('audio');
          audioElement.addEventListener('pause', () => {
            glowingAudioCircle.classList.remove(styles.pulsate);
          });
          audioElement.setAttribute('controls', 'true');
          audioElement.src = audioLink;
          audioElement.addEventListener('ended', () => {
            glowingAudioCircle.classList.remove(styles.pulsate);
          });
          await audioElement.play();
          glowingAudioCircle.classList.add(styles.pulsate);
        }
      });

      audioContainer.append(glowingAudioCircle);

      phraseContainer.append(phraseElement);
      phraseContainer.append(audioContainer);

      container.append(phraseContainer);
    });
  }

  private displayStatistics(): void {
    const { phrasesLearned, phrasesNotLearned } = this.store.getState();
    this.displayPhrasesStatisctics(phrasesLearned, this.learnedPhrasesContainer);
    this.displayPhrasesStatisctics(phrasesNotLearned, this.notLearnedPhrasesContainer);
  }

  private updateMiniature(): void {
    const { currentRoundData } = this.store.getState();
    const IMAGE_DESCRIPTION = `${currentRoundData.levelData.name} by ${formatAuthorName(this.store)} (${currentRoundData.levelData.year})`;
    const IMAGE_SOURCE_LINK = `${dataLinks.levelLink}${currentRoundData.levelData.imageSrc}`;
    const imageElement = new BaseElement(tagNames.img, [styles.imageElement], {
      alt: IMAGE_DESCRIPTION,
      src: IMAGE_SOURCE_LINK,
    }).getNode();
    const imageInformation = new BaseElement(tagNames.div, [styles.imageInformation], {}, IMAGE_DESCRIPTION).getNode();

    this.miniatureContainer.append(imageElement);
    this.miniatureField.append(imageInformation);
  }
}
