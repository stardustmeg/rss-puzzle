import type { ReduxStore } from '../../lib/store/types.ts';
import type { Action, State } from '../../store/reducer.ts';

import { dataLinks, eventNames, tagNames } from '../../constants/constants.ts';
import {
  addPhraseLearned,
  addPhraseNotLearned,
  setCurrentSentenceIndex,
  setDefaultPhrases,
  switchSoundHint,
  switchTranslationHint,
  updateCurrentSentenceIndex,
} from '../../store/actions.ts';
import { BaseElement } from '../../utils/base-element.ts';
import createCanvas, { clearOutPieces } from '../canvas/canvas.ts';
import { fetchDataAndProcess, formatAuthorName } from './helpers/playground-helper.ts';
import styles from './playground.module.scss';

export default class Playground extends BaseElement {
  private hintContainer: HTMLElement;

  private piecesContainer: HTMLElement;

  private puzzleField: HTMLElement;

  private store: ReduxStore<State, Action>;

  constructor(store: ReduxStore<State, Action>) {
    super(tagNames.div, [styles.playgroundContainer]);

    this.hintContainer = new BaseElement(tagNames.div, [styles.hintContainer]).getNode();
    this.puzzleField = new BaseElement(tagNames.div, [styles.puzzleField]).getNode();
    this.piecesContainer = new BaseElement(tagNames.div, [styles.piecesContainer]).getNode();

    this.append(this.hintContainer, this.puzzleField, this.piecesContainer);

    this.store = store;

    this.initialize()
      .then(() => {})
      .catch(() => {
        throw new Error('Something went horribly wrong!');
      });
  }

  // TBD Remove too big a method
  // eslint-disable-next-line max-lines-per-function
  private displayAudio(): void {
    const { currentRoundData, currentSentenceIndex, hintSoundOn } = this.store.getState();
    const audioContainer = new BaseElement(tagNames.div, [styles.audioContainer]).getNode();
    const glowingAudioCircle = new BaseElement(tagNames.div, [styles.glowingAudioCircle]).getNode();

    if (!hintSoundOn) {
      glowingAudioCircle.classList.add(styles.hidden);
    }

    const currentAudio = currentRoundData.words[currentSentenceIndex].audioExample;
    const audioSource = `${dataLinks.audioLink}${currentAudio}`;
    let audioElement: HTMLAudioElement;

    const soundCheckbox = document.createElement('input');
    soundCheckbox.type = 'checkbox';
    soundCheckbox.checked = hintSoundOn;

    soundCheckbox.addEventListener('change', () => {
      const { hintSoundOn } = this.store.getState();
      if (!soundCheckbox.checked && audioElement && !audioElement.paused) {
        audioElement.pause();
        glowingAudioCircle.classList.add(styles.pulsate);
        glowingAudioCircle.classList.add(styles.glowingAudioCircle);
      }
      this.handleHint(this.store, switchSoundHint(), hintSoundOn, glowingAudioCircle);
    });

    audioContainer.addEventListener(eventNames.CLICK, async () => {
      if (audioElement && !audioElement.paused && soundCheckbox.checked) {
        audioElement.pause();
        glowingAudioCircle.classList.add(styles.pulsate);
      } else {
        audioElement = document.createElement('audio');
        audioElement.addEventListener('pause', () => {
          glowingAudioCircle.classList.remove(styles.pulsate);
        });
        audioElement.setAttribute('controls', 'true');
        audioElement.src = audioSource;
        audioElement.addEventListener('ended', () => {
          glowingAudioCircle.classList.remove(styles.pulsate);
        });
        if (soundCheckbox.checked) {
          await audioElement.play();
          glowingAudioCircle.classList.add(styles.pulsate);
        }
      }
    });

    audioContainer.append(glowingAudioCircle);
    this.hintContainer.append(soundCheckbox, audioContainer);
  }

  private displaySentence(): void {
    const { currentRoundData, currentSentenceIndex } = this.store.getState();
    const currentSentence = currentRoundData.words[currentSentenceIndex].textExample;
    const sentenceElement = new BaseElement(tagNames.div, [styles.sentenceElement], {}, currentSentence).getNode();
    this.piecesContainer.append(sentenceElement);
  }

  private displaySentenceTranslation(): void {
    const { currentRoundData, currentSentenceIndex, hintTranslationOn } = this.store.getState();
    const translationHintContainer = new BaseElement(tagNames.div, [styles.translationHintContainer]).getNode();
    const translationHintLogoContainer = new BaseElement(tagNames.div, [styles.translationHintLogoContainer]).getNode();
    const glowingCircle = new BaseElement(tagNames.div, [styles.glowingCircle]).getNode();
    const currentSentenceTranslation = currentRoundData.words[currentSentenceIndex].textExampleTranslate;
    const sentenceTranslationElement = new BaseElement(
      tagNames.div,
      [styles.sentenceElement],
      {},
      currentSentenceTranslation,
    ).getNode();

    if (!hintTranslationOn) {
      glowingCircle.classList.add(styles.hidden);
      sentenceTranslationElement.classList.add(styles.hidden);
    }

    translationHintLogoContainer.append(glowingCircle);
    translationHintContainer.append(translationHintLogoContainer, sentenceTranslationElement);
    this.hintContainer.append(translationHintContainer);

    translationHintLogoContainer.addEventListener(eventNames.CLICK, () => {
      const { hintTranslationOn } = this.store.getState();
      this.handleHint(
        this.store,
        switchTranslationHint(),
        hintTranslationOn,
        glowingCircle,
        sentenceTranslationElement,
      );
    });
  }

  private handleHint(
    store: ReduxStore<State, Action>,
    action: Action, // TBD how to make it optional?
    hint: boolean,
    ...elements: HTMLElement[]
  ): void {
    if (!hint) {
      elements.forEach((element) => {
        element.classList.remove(styles.hidden);
      });
    } else {
      elements.forEach((element) => {
        element.classList.add(styles.hidden);
      });
    }
    store.dispatch(action);
  }

  private async initialize(): Promise<void> {
    try {
      await fetchDataAndProcess(this.store);
    } catch (error) {
      throw new Error('Something happened while fetching round data :(');
    }

    clearOutPieces();
    this.setDefaultRoundState();
    this.displayImage();
    this.displayAudio();
    this.displaySentence();
    this.displaySentenceTranslation();
  }

  private setDefaultRoundState(): void {
    this.store.dispatch(setCurrentSentenceIndex(0));
    this.store.dispatch(setDefaultPhrases(''));
  }

  public addCompletedNotPhraseWithAudio(): void {
    const { currentRoundData, currentSentenceIndex } = this.store.getState();
    const currentPhrase = currentRoundData.words[currentSentenceIndex].textExample;
    const currentAudio = currentRoundData.words[currentSentenceIndex].audioExample;
    this.store.dispatch(addPhraseNotLearned(`${currentPhrase}@${currentAudio}`)); // TBD
  }

  public addCompletedPhraseWithAudio(): void {
    const { currentRoundData, currentSentenceIndex } = this.store.getState();
    const currentPhrase = currentRoundData.words[currentSentenceIndex].textExample;
    const currentAudio = currentRoundData.words[currentSentenceIndex].audioExample;
    this.store.dispatch(addPhraseLearned(`${currentPhrase}@${currentAudio}`)); // TBD
  }

  // TBD get rid of code duplication, change naming

  public displayImage(): void {
    createCanvas(this.store, this.puzzleField);
  }

  public displayInfoAboutRound(): void {
    const { currentRoundData } = this.store.getState();
    const IMAGE_DESCRIPTION = `${currentRoundData.levelData.name} by ${formatAuthorName(this.store)} (${currentRoundData.levelData.year})`;
    clearOutField(this.hintContainer, this.piecesContainer);

    const imageContainer = new BaseElement(tagNames.div, [styles.imageContainer]).getNode();
    const imageElement = new BaseElement(tagNames.img, [styles.imageElement], {
      alt: IMAGE_DESCRIPTION,
      src: `${dataLinks.levelLink}${currentRoundData.levelData.imageSrc}`,
    }).getNode();

    const imageDescriptionPlate = new BaseElement(
      tagNames.div,
      [styles.imageDescriptionPlate],
      {},
      IMAGE_DESCRIPTION,
    ).getNode();

    imageContainer.append(imageElement);

    this.puzzleField.append(imageContainer);
    this.piecesContainer.append(imageDescriptionPlate);
  }

  public moveToNextSentence(): void {
    clearOutField(this.piecesContainer, this.hintContainer);
    this.store.dispatch(updateCurrentSentenceIndex());
    this.displayAudio();
    this.displaySentence();
    this.displaySentenceTranslation();
  }
}

function clearOutField(...args: HTMLElement[]): void {
  args.forEach((element) => {
    if (element instanceof HTMLElement) {
      const currentElement = element;
      currentElement.innerHTML = '';
    }
  });
}
