import type { ReduxStore } from '../../lib/store/types.ts';
import type { Router } from '../../router/router.ts';
import type { Action, State } from '../../store/reducer.ts';

import { formatAuthorName } from '../../components/playground/helpers/playground-helper.ts';
import { APP_ROUTE } from '../../constants/app-routes.ts';
import { buttonsTextContent, dataLinks, tagNames } from '../../constants/constants.ts';
import { BaseElement } from '../../utils/base-element.ts';
import styles from './not-found.module.scss';

export default function createNotFoundPage(store: ReduxStore<State, Action>, router: Router): BaseElement {
  const notFoundPage = new BaseElement(tagNames.div, [styles.pageContainer], {}, '<h1>404</h1>');

  const pageText =
    "You were never supposed to see this page. Literally. Ever. Something went incredibly horribly wrong! If you see this, please contact me immediately! Thanks a ton! Here's a random artwork for you. Enjoy 😉"; // TBD make it random
  const pageDescription = new BaseElement(tagNames.div, [styles.pageDescription], {}, pageText);

  // TBD make a separate function

  const { currentRoundData } = store.getState();
  const IMAGE_DESCRIPTION = `${currentRoundData.levelData.name} by ${formatAuthorName(store)} (${currentRoundData.levelData.year})`;

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

  pageDescription.append(imageContainer, imageDescriptionPlate);

  const startButton = document.createElement(tagNames.button);
  startButton.textContent = buttonsTextContent.GO_BACK;

  startButton.onclick = (event): void => {
    event.preventDefault();
    router.navigateTo(APP_ROUTE.Start);
  };

  notFoundPage.append(pageDescription, startButton);

  return notFoundPage;
}

// TBD don't need it anymore
