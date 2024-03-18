import type { ReduxStore } from '../../lib/store/types.ts';
import type { Action, State } from '../../store/reducer.ts';

import { SVGs, dataLinks } from '../../constants/constants.ts';

const size: Record<string, number> = {
  columns0: 0,
  columns1: 0,
  columns2: 0,
  columns3: 0,
  columns4: 0,
  columns5: 0,
  columns6: 0,
  columns7: 0,
  columns8: 0,
  columns9: 0,
  height: 0,
  rows: 10,
  width: 0,
  x: 0,
  y: 0,
};

const INITIAL_WIDTH = 700;

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

let pieces: Piece[][] = [];
let selectedPiece: Piece | null = null;

function updatePuzzleFieldSize(store: ReduxStore<State, Action>): void {
  const { currentRoundData } = store.getState();

  size.rows = currentRoundData.words.length;

  for (let i = 0; i < size.rows; i += 1) {
    const wordsArray = currentRoundData.words[i].textExample.split(' ');
    const columnKey = `columns${i}`;
    size[columnKey] = wordsArray.length;
  }
}

function updateCanvasDimensions(
  store: ReduxStore<State, Action>,
  handleResize: (img: HTMLImageElement) => void,
): Promise<void> {
  const { currentSentenceIndex } = store.getState();
  return new Promise((resolve) => {
    // context.clearRect(0, 0, canvas.width, canvas.height); // TBD Get back to that later, I like this idea
    // context.globalAlpha = 0.5;
    const img = new Image();
    img.onload = function resizeOnload(): void {
      if (!context) {
        throw new Error('Something went wrong with canvas context!');
      }

      handleResize(img);
      // context.globalAlpha = 1;
      createPiecesForRow(store, currentSentenceIndex, img);
      randomizePieces(store);

      pieces[currentSentenceIndex].forEach((piece) => {
        piece.draw(context, currentSentenceIndex);
      });

      resolve();
    };

    const { currentRoundData } = store.getState();
    updatePuzzleFieldSize(store);
    const imageLink = `${dataLinks.levelLink}${currentRoundData.levelData.imageSrc}`;
    img.src = imageLink;
  });
}

function handleResize(img: HTMLImageElement): void {
  if (context) {
    const canvasWidth = INITIAL_WIDTH;
    const canvasHeight = canvasWidth * (img.height / img.width);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.drawImage(img, 0, 0, canvasWidth, canvasHeight);

    size.width = canvasWidth;
    size.height = canvasHeight;
  } else {
    throw new Error('Something went wrong with canvas context!');
  }
}

export function clearOutCanvas(): void {
  try {
    const parent = canvas.parentNode;
    if (parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    } else {
      throw new Error('Parent element not found for canvas!');
    }
  } catch (error) {
    throw new Error('Something is wrong');
  }
}
export default function createCanvas(store: ReduxStore<State, Action>, parent: HTMLElement): void {
  addEventListeners(store);
  updateCanvasDimensions(store, (img) => handleResize(img))
    .then(() => {
      parent.append(canvas);
    })
    .catch(() => {
      throw new Error('Something went horribly wrong!');
    });
}

function addEventListeners(store: ReduxStore<State, Action>): void {
  canvas.addEventListener('mousedown', (evt: MouseEvent) => onMouseDown(store, evt));
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
}

function onMouseDown(store: ReduxStore<State, Action>, evt: MouseEvent): void {
  selectedPiece = getPressedPiece(store, { x: evt.offsetX, y: evt.offsetY });
  if (selectedPiece != null) {
    selectedPiece.offset = {
      x: evt.x - selectedPiece.x,
      y: evt.y - selectedPiece.y,
    };
  }
}

function onMouseMove(evt: MouseEvent): void {
  if (selectedPiece != null) {
    selectedPiece.x = evt.x - selectedPiece.offset.x;
    selectedPiece.y = evt.y - selectedPiece.offset.y;
  }
}

function onMouseUp(): void {
  selectedPiece = null;
}

function getPressedPiece(store: ReduxStore<State, Action>, location: { x: number; y: number }): Piece | null {
  const { currentSentenceIndex } = store.getState();

  for (let i = 0; i < pieces[currentSentenceIndex].length; i += 1) {
    const piece = pieces[currentSentenceIndex][i];
    if (
      location.x > piece.x &&
      location.x < piece.x + piece.width &&
      location.y > piece.y &&
      location.y < piece.y + piece.height
    ) {
      return piece;
    }
  }
  return null;
}

export function clearOutPieces(): void {
  pieces = [];
}

function randomizePieces(store: ReduxStore<State, Action>): void {
  const { currentSentenceIndex } = store.getState();
  for (let i = 0; i < pieces[currentSentenceIndex].length; i += 1) {
    const location = {
      x: Math.random() * (canvas.width - pieces[currentSentenceIndex][i].width - 40),
      y: Math.random() * (canvas.height - pieces[currentSentenceIndex][i].height),
    };
    pieces[currentSentenceIndex][i].x = location.x;
    pieces[currentSentenceIndex][i].y = location.y;
  }
}

export function createPiecesForRow(store: ReduxStore<State, Action>, rowIndex: number, img: HTMLImageElement): void {
  const endPieceSVG = new Image();
  endPieceSVG.src = `data:image/svg+xml,${encodeURIComponent(SVGs.endPiece)}`;

  const middlePieceSVG = new Image();
  middlePieceSVG.src = `data:image/svg+xml,${encodeURIComponent(SVGs.middlePiece)}`;

  const startPieceSVG = new Image();
  startPieceSVG.src = `data:image/svg+xml,${encodeURIComponent(SVGs.startPiece)}`;

  if (!pieces[rowIndex]) {
    pieces[rowIndex] = [];
  }

  for (let j = 0; j < size[`columns${rowIndex}`]; j += 1) {
    let svg;
    if (j === 0) {
      svg = startPieceSVG;
    } else if (j === size[`columns${rowIndex}`] - 1) {
      svg = endPieceSVG;
    } else {
      svg = middlePieceSVG;
    }
    pieces[rowIndex].push(new Piece(store, rowIndex, j, svg, img));
  }
}

class Piece {
  private colIndex: number;

  private img: HTMLImageElement;

  private rowIndex: number;

  private svg: HTMLImageElement;

  private word: string;

  public height: number;

  public offset: { x: number; y: number };

  public width: number;

  public x: number;

  public y: number;

  constructor(
    store: ReduxStore<State, Action>,
    rowIndex: number,
    colIndex: number,
    svg: HTMLImageElement,
    img: HTMLImageElement,
  ) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.img = img;

    const { currentRoundData } = store.getState();

    this.word = currentRoundData.words[rowIndex].textExample.split(' ')[colIndex];

    this.width = size.width / size[`columns${rowIndex}`];
    this.height = size.height / size.rows;

    this.x = size.x + this.width * this.colIndex - 1;
    this.y = size.y + this.height * this.rowIndex - 1;

    this.svg = svg;
    this.offset = { x: 0, y: 0 };
  }

  public draw(context: CanvasRenderingContext2D, rowIndex: number): void {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);

    context.save();
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + this.width + 40, this.y);
    context.lineTo(this.x + this.width + 40, this.y + this.height);
    context.lineTo(this.x, this.y + this.height);
    context.closePath();

    context.drawImage(this.svg, this.x, this.y, this.width, this.height);

    context.clip();

    context.drawImage(
      this.img,
      (this.colIndex * this.img.width) / size[`columns${rowIndex}`],
      (this.rowIndex * this.img.height) / size.rows,
      this.img.width / size[`columns${rowIndex}`],
      this.img.height / size.rows,
      this.x,
      this.y,
      this.width,
      this.height,
    );

    context.restore();

    context.font = 'bold 11px Arial';
    context.fillStyle = '#1a1423';
    context.strokeStyle = '#eacdc2';
    context.lineWidth = 2;

    const textX = this.x + (this.width - context.measureText(this.word).width) / 2;
    const textY = this.y + this.height / 2;
    context.strokeText(this.word, textX, textY);
    context.fillText(this.word, textX, textY);
  }
}
