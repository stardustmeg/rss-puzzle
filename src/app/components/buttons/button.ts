import { tagNames } from '../../constants/constants.ts';
import { BaseElement } from '../../utils/base-element.ts';
import styles from './button.module.scss';

export default class ButtonElement {
  private buttonElement: BaseElement;

  constructor(text: string, parentElement: BaseElement) {
    this.buttonElement = new BaseElement(tagNames.button, [styles.button], {}, text);
    parentElement.append(this.buttonElement);
  }

  public onClick(callback: () => void): void {
    this.buttonElement.addListener('click', callback);
  }
}
