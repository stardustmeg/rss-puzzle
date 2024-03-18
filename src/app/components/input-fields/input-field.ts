import { eventNames, tagNames } from '../../constants/constants.ts';
import { BaseElement } from '../../utils/base-element.ts';
import styles from './input-field.module.scss';

const EMPTY_STRING = '';

type EventListenerFunction = (event: Event) => void;

export default class InputField {
  private errorElement: HTMLDivElement;

  private inputElement: BaseElement;

  private minValue: number;

  public getValidationState = (): boolean => this.inputIsValid;

  public inputIsValid = false;

  public inputValue = EMPTY_STRING;

  constructor(placeholder: string, parentElement: BaseElement, minValue: number) {
    const container = new BaseElement(tagNames.div, [styles.inputContainer]);

    this.inputElement = new BaseElement(tagNames.input, [styles.inputField], { placeholder });
    this.inputElement.addEventListener(eventNames.INPUT, this.handleInputChange.bind(this));
    container.append(this.inputElement);

    this.errorElement = document.createElement(tagNames.div);
    this.errorElement.className = styles.errorMessage;

    this.minValue = minValue;

    this.inputElement.addEventListener(eventNames.INPUT, () => {
      this.inputIsValid = this.validate(this.inputValue);
    });

    container.append(this.errorElement);
    container.appendTo(parentElement);
  }

  private handleInputChange(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      const { target } = event;
      this.inputValue = target.value;
    }
  }

  private hideError(): void {
    this.errorElement.textContent = EMPTY_STRING;
  }

  private showError(message: string): void {
    this.errorElement.textContent = message;
  }

  public addEventListener(eventName: string, listener: EventListenerFunction): void {
    this.inputElement.addEventListener(eventName, listener);
  }

  public validate(value: string): boolean {
    const VALID_CHARS = /^[A-Za-z\\-]+$/;
    const START_WITH_UPPER_CHAR = /^[A-Z]/;

    const errorMessages = {
      ENGLISH_LETTERS_AND_HYPHEN_ONLY: 'Use English letters and/or a hyphen.',
      FIELD_REQUIRED: 'This field is required.',
      MIN_LENGTH_REQUIRED: `Minimum ${this.minValue} characters required.`,
      UPPERCASE_FIRST_LETTER: 'The first letter must be uppercase.',
    } as const;

    const NO_INPUT_VALUE = 0;
    switch (true) {
      case value.length === NO_INPUT_VALUE:
        this.showError(errorMessages.FIELD_REQUIRED);
        return false;

      case !VALID_CHARS.test(value):
        this.showError(errorMessages.ENGLISH_LETTERS_AND_HYPHEN_ONLY);
        return false;

      case !START_WITH_UPPER_CHAR.test(value):
        this.showError(errorMessages.UPPERCASE_FIRST_LETTER);
        return false;

      case value.length < this.minValue:
        this.showError(errorMessages.MIN_LENGTH_REQUIRED);
        return false;

      default:
        this.hideError();
        return true;
    }
  }
}
