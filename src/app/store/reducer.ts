/* eslint-disable max-lines-per-function */
import type { RoundData } from '../components/playground/helpers/playground-helper.ts';
import type { Reducer } from '../lib/store/types.ts';
import type * as actions from './actions.ts';

export interface State {
  currentGameLevel: number;
  currentGameRound: number;
  currentRoundCount: number;
  currentRoundData: RoundData;
  currentSentenceIndex: number;
  gameLevelsFinished: number[];
  gameRoundsFinished: gameRoundsFinished;
  hintBackgroundOn: boolean;
  hintSoundOn: boolean;
  hintTranslationOn: boolean;
  phrasesLearned: string[];
  phrasesNotLearned: string[];
  userFirstName: string;
  userLastName: string;
}

interface gameRoundsFinished {
  [key: string]: number[];
}

type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;

export type Action = ReturnType<InferValueTypes<typeof actions>>;
export const rootReducer: Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
    case 'addPhraseLearned':
      return {
        ...state,
        phrasesLearned: [...state.phrasesLearned, action.payload],
      };
    case 'addPhraseNotLearned':
      return {
        ...state,
        phrasesNotLearned: [...state.phrasesNotLearned, action.payload],
      };
    case 'addUserFirstName':
      return {
        ...state,
        userFirstName: action.payload,
      };
    case 'addUserLastName':
      return {
        ...state,
        userLastName: action.payload,
      };
    case 'changeLevel':
      return {
        ...state,
        currentGameLevel: action.payload,
      };
    case 'changeRound':
      return {
        ...state,
        currentGameRound: action.payload,
      };
    case 'addFinishedLevel':
      return {
        ...state,
        gameLevelsFinished: [...state.gameLevelsFinished, action.payload],
      };
    case 'addFinishedRound': {
      const { level, round } = action.payload;
      return {
        ...state,
        gameRoundsFinished: {
          ...state.gameRoundsFinished,
          [`level${level}`]: [...state.gameRoundsFinished[`level${level}`], round],
        },
      };
    }
    case 'switchBackgroundHint':
      return {
        ...state,
        hintBackgroundOn: !state.hintBackgroundOn,
      };
    case 'switchSoundHint':
      return {
        ...state,
        hintSoundOn: !state.hintSoundOn,
      };
    case 'switchTranslationHint':
      return {
        ...state,
        hintTranslationOn: !state.hintTranslationOn,
      };
    case 'updateCurrentRoundData':
      return {
        ...state,
        currentRoundData: action.payload,
      };
    case 'updateCurrentRoundCount':
      return {
        ...state,
        currentRoundCount: action.payload,
      };
    case 'updateCurrentSentenceIndex':
      return {
        ...state,
        currentSentenceIndex: state.currentSentenceIndex + 1,
      };
    case 'setCurrentSentenceIndex':
      return {
        ...state,
        currentSentenceIndex: action.payload,
      };
    case 'updateStoreToInitialState':
      return action.payload;
    case 'setDefaultHintState':
      return {
        ...state,
        hintBackgroundOn: action.payload,
        hintSoundOn: action.payload,
        hintTranslationOn: action.payload,
      };
    case 'setDefaultPhrases':
      return {
        ...state,
        phrasesLearned: [...action.payload],
        phrasesNotLearned: [...action.payload],
      };
    default:
      return state;
  }
};
