/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { LinksTypes } from '../../../constants/constants.ts';
import type { ReduxStore } from '../../../lib/store/types.ts';
import type { Action, State } from '../../../store/reducer.ts';

import { dataLinks, specialPrefixes } from '../../../constants/constants.ts';
import {
  changeLevel,
  changeRound,
  // setDefaultHintState,
  updateCurrentRoundCount,
  updateCurrentRoundData,
} from '../../../store/actions.ts';

export interface LevelData {
  author: string;
  cutSrc: string;
  id: string;
  imageSrc: string;
  name: string;
  year: string;
}

export interface Word {
  audioExample: string;
  id: number;
  textExample: string;
  textExampleTranslate: string;
  word: string;
  wordTranslate: string;
}

export interface RoundData {
  levelData: LevelData;
  words: Word[];
}

interface RoundResponse {
  rounds: RoundData[];
}

export async function fetchRoundData(store: ReduxStore<State, Action>): Promise<RoundData[]> {
  const { currentGameLevel } = store.getState();
  const url: LinksTypes = dataLinks[`level${currentGameLevel}`];
  try {
    const response = await fetch(url); // TBD do typechecking later
    if (!response.ok) {
      throw new Error('Failed to fetch data :(');
    }
    const data: RoundResponse = await response.json();
    if (!data || !data.rounds || !Array.isArray(data.rounds)) {
      throw new Error('Something is wrong with data format');
    }
    return data.rounds;
  } catch (error) {
    throw new Error('Something horrible happened!');
  }
}

export async function fetchRoundsCount(store: ReduxStore<State, Action>): Promise<number> {
  const { currentGameLevel } = store.getState();
  const url: LinksTypes = dataLinks[`level${currentGameLevel}`];
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data :(');
    }
    const data = await response.json();
    if (!data || typeof data.roundsCount !== 'number' || data.roundsCount <= 0) {
      throw new Error('Invalid or missing roundsCount property in data');
    }
    return data.roundsCount;
  } catch (error) {
    throw new Error('Something horrible happened!');
  }
}

export async function fetchDataAndProcess(store: ReduxStore<State, Action>): Promise<RoundData> {
  const { currentGameRound } = store.getState();
  try {
    const fetchedData = await fetchRoundData(store);
    const roundCount = await fetchRoundsCount(store);

    store.dispatch(updateCurrentRoundData(fetchedData[currentGameRound]));
    store.dispatch(updateCurrentRoundCount(roundCount));

    return fetchedData[currentGameRound];
  } catch (error) {
    throw new Error('Something horrible happened!');
  }
}

export async function fetchPicturesForLevel(store: ReduxStore<State, Action>): Promise<string[]> {
  const { currentGameLevel } = store.getState();
  const url: LinksTypes = dataLinks[`level${currentGameLevel}`];
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data :(');
    }
    const data = await response.json();
    if (!data || !data.rounds || !Array.isArray(data.rounds)) {
      throw new Error('Something is wrong with data format');
    }

    const levelPictures = [];
    for (let i = 0; i < data.rounds.length; i += 1) {
      levelPictures.push(data.rounds[i].levelData.imageSrc);
    }

    return levelPictures;
  } catch (error) {
    throw new Error('Something horrible happened!');
  }
}

export function updateNextRound(store: ReduxStore<State, Action>): void {
  const { currentGameLevel, currentGameRound, currentRoundCount } = store.getState();
  const nextRound = currentGameRound + 1; // TBD +1 === next round

  if (nextRound <= currentRoundCount - 1) {
    // TBD a correction for data indices gotten from array
    store.dispatch(changeRound(nextRound));
  } else if (currentGameLevel === 5) {
    // TBD get rid of magic (5 === last level) // create a function to count levels?
    store.dispatch(changeLevel(0));
    store.dispatch(changeRound(0));
  } else {
    store.dispatch(changeLevel(currentGameLevel + 1)); // TBD +1 === next level
    store.dispatch(changeRound(0));
  }
  // store.dispatch(setDefaultHintState(true)); // TBD Check with requirements again if it's needed
}

export function formatAuthorName(store: ReduxStore<State, Action>): string {
  const { currentRoundData } = store.getState();
  const currentAuthor = currentRoundData.levelData.author;

  let authorName = currentAuthor.trim();

  const prefix = specialPrefixes.find((prefix) => authorName.toLowerCase().includes(`${prefix.toLowerCase()}'`));

  if (prefix) {
    const index = authorName.toLowerCase().indexOf(`${prefix.toLowerCase()}'`) + prefix.length;
    authorName =
      authorName.substring(0, index) + authorName.charAt(index).toUpperCase() + authorName.substring(index + 1);
  } else if (authorName.includes(',')) {
    const parts = authorName.split(', ');
    if (parts.length === 2) {
      const lastName = parts[0].trim().charAt(0).toUpperCase() + parts[0].trim().slice(1).toLowerCase();
      const firstName = parts[1].trim().split(' ')[0].trim();
      authorName = `${firstName} ${lastName}`;
    }
  } else {
    authorName = authorName.charAt(0).toUpperCase() + authorName.slice(1).toLowerCase();
  }

  return authorName;
}
