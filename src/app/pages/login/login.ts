import type { ReduxStore } from '../../lib/store/types.ts';
import type { Router } from '../../router/router.ts';
import type { Action, State } from '../../store/reducer.ts';

import InputField from '../../components/input-fields/input-field.ts';
import { APP_ROUTE } from '../../constants/app-routes.ts';
import { eventNames, tagNames } from '../../constants/constants.ts';
import { saveCurrentStateToLocalStorage } from '../../services/local-storage.service.ts';
import { addUserFirstName, addUserLastName } from '../../store/actions.ts';
import { BaseElement } from '../../utils/base-element.ts';
import styles from './login.module.scss';

const inputAttributes = {
  FIRST_NAME_LENGTH: 3,
  FIRST_NAME_PLACEHOLDER: 'First Name',
  LAST_NAME_LENGTH: 4,
  LAST_NAME_PLACEHOLDER: 'Last Name',
} as const;

const elementsTextContent = {
  HEADING: '<h1>Log In</h1>',
  LOGIN_BUTTON: 'Log In',
} as const;

interface InputComponent {
  getValidationState(): boolean;
}

export default function createLoginPage(store: ReduxStore<State, Action>, router: Router): BaseElement {
  const pageWrapper = new BaseElement(tagNames.div, [styles.wrapper]);
  const loginPage = new BaseElement(tagNames.div, [styles.pageContainer], {}, elementsTextContent.HEADING);
  const formContainer = new BaseElement(tagNames.div, [styles.formContainer]);
  const loginButton = new BaseElement(
    tagNames.button,
    [styles.button, styles.hidden],
    {},
    elementsTextContent.LOGIN_BUTTON,
  );

  const firstNameInput = new InputField(
    inputAttributes.FIRST_NAME_PLACEHOLDER,
    formContainer,
    inputAttributes.FIRST_NAME_LENGTH,
  );
  const lastNameInput = new InputField(
    inputAttributes.LAST_NAME_PLACEHOLDER,
    formContainer,
    inputAttributes.LAST_NAME_LENGTH,
  );

  pageWrapper.append(loginPage);
  formContainer.append(loginButton);
  loginPage.append(formContainer);

  firstNameInput.addEventListener(eventNames.INPUT, () => {
    checkInputsValidity([firstNameInput, lastNameInput], loginButton, styles.hidden);
  });

  lastNameInput.addEventListener(eventNames.INPUT, () => {
    checkInputsValidity([firstNameInput, lastNameInput], loginButton, styles.hidden);
  });

  loginButton.addEventListener(eventNames.CLICK, (event) =>
    handleLoginButtonClick(event, firstNameInput, lastNameInput, store, router),
  );

  return loginPage;
}

function checkInputsValidity(inputs: InputComponent[], element: BaseElement, styleToRemove: string): void {
  const isValid = inputs.every((input) => input.getValidationState());
  if (isValid) {
    element.removeCssClass(styleToRemove);
  } else {
    element.addCssClass(styleToRemove);
  }
}

function handleLoginButtonClick(
  event: Event,
  firstNameInput: InputField,
  lastNameInput: InputField,
  store: ReduxStore<State, Action>,
  router: Router,
): void {
  changeUserCredentialsState(firstNameInput, lastNameInput, store);
  saveCurrentStateToLocalStorage(store.getState());

  event.preventDefault();
  router.navigateTo(APP_ROUTE.Start);
}

function changeUserCredentialsState(
  firstNameInput: InputField,
  lastNameInput: InputField,
  store: ReduxStore<State, Action>,
): void {
  store.dispatch(addUserFirstName(firstNameInput.inputValue));
  store.dispatch(addUserLastName(lastNameInput.inputValue));
}
