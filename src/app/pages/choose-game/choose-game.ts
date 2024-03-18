import type { ReduxStore } from '../../lib/store/types.ts';
import type { Router } from '../../router/router.ts';
import type { Action, State } from '../../store/reducer.ts';

import { fetchDataAndProcess, fetchPicturesForLevel } from '../../components/playground/helpers/playground-helper.ts';
import { APP_ROUTE } from '../../constants/app-routes.ts';
import { dataLinks, eventNames, tagNames } from '../../constants/constants.ts';
import { changeLevel, changeRound } from '../../store/actions.ts';
import { BaseElement } from '../../utils/base-element.ts';
import styles from './choose-game.module.scss';

export class GameChoiceField extends BaseElement {
  private dropdown: HTMLElement;

  private imagesContainer: HTMLElement;

  constructor(store: ReduxStore<State, Action>, router: Router) {
    super(tagNames.div, [styles.imagesContainer]);

    this.imagesContainer = new BaseElement(tagNames.div, [styles.imagesContainer]).getNode();
    this.dropdown = new BaseElement(tagNames.select, [styles.dropdownMenu]).getNode();

    this.append(this.imagesContainer, this.dropdown);

    this.setupDropdown(store, router);

    this.loadImagesForLevel(store, router).catch((error) => {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred during initialization');
      }
    });
  }

  private async getImageSourcesForLevel(store: ReduxStore<State, Action>): Promise<string[]> {
    try {
      const imageSources: string[] = await fetchPicturesForLevel(store);
      return imageSources;
    } catch {
      throw new Error('Something happened with picture sources array!');
    }
  }

  private async loadImagesForLevel(store: ReduxStore<State, Action>, router: Router): Promise<void> {
    try {
      const sources = await this.getImageSourcesForLevel(store);
      this.imagesContainer.replaceChildren();
      sources.forEach((source, index) => {
        const imageContainer = new BaseElement(tagNames.div, [styles.imageContainer], {
          'data-round': index.toString(),
        }).getNode();
        const imageSource = `${dataLinks.levelLink}${source}`;
        const blurOverlay = new BaseElement(tagNames.div, [styles.blurOverlay], {
          'data-round': index.toString(),
        }).getNode();
        const imageElement = new BaseElement(tagNames.img, [styles.imageElement], {
          'data-round': index.toString(),
          src: imageSource,
        }).getNode();

        imageContainer.addEventListener('click', async () => {
          const round = parseInt(imageContainer.getAttribute('data-round') || '0', 10);
          store.dispatch(changeRound(round));
          await fetchDataAndProcess(store);
          router.navigateTo(APP_ROUTE.Main);
        });

        imageContainer.append(blurOverlay, imageElement);
        this.imagesContainer.append(imageContainer);
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred while loading images');
      }
    }
  }

  private setupDropdown(store: ReduxStore<State, Action>, router: Router): void {
    const levels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6'];
    levels.forEach((level, index) => {
      const option = new BaseElement(tagNames.option, [styles.option], { value: index.toString() }, level).getNode();
      this.dropdown.append(option);
    });

    this.dropdown.addEventListener(eventNames.CHANGE, async (event) => {
      if (event.target instanceof HTMLSelectElement) {
        const selectedLevel = parseInt(event.target.value, 10);
        store.dispatch(changeLevel(selectedLevel));
        try {
          await this.loadImagesForLevel(store, router);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('An unknown error occurred while loading images');
          }
        }
      }
    });
  }
}

export default function createChooseGamePage(store: ReduxStore<State, Action>, router: Router): BaseElement {
  const INITIAL_LEVEL = 0;
  store.dispatch(changeLevel(INITIAL_LEVEL));

  const startPage = new BaseElement(tagNames.div, [styles.pageContainer]);

  const gameChoiceField = new GameChoiceField(store, router);

  startPage.append(gameChoiceField);
  return startPage;
}
