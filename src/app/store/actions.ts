import type { RoundData } from '../components/playground/helpers/playground-helper';
import type { State } from './reducer';

const ACTIONS = {
  ADD_FINISHED_LEVEL: 'addFinishedLevel',
  ADD_FINISHED_ROUND: 'addFinishedRound',
  ADD_PHRASE_LEARNED: 'addPhraseLearned',
  ADD_PHRASE_NOT_LEARNED: 'addPhraseNotLearned',
  ADD_USER_FIRST_NAME: 'addUserFirstName',
  ADD_USER_LAST_NAME: 'addUserLastName',
  CHANGE_LEVEL: 'changeLevel',
  CHANGE_ROUND: 'changeRound',
  SET_CURRENT_SENTENCE_INDEX: 'setCurrentSentenceIndex',
  SET_DEFAULT_HINT_STATE: 'setDefaultHintState',
  SET_DEFAULT_PHRASES: 'setDefaultPhrases',
  SWITCH_BACKGROUND_HINT: 'switchBackgroundHint',
  SWITCH_SOUND_HINT: 'switchSoundHint',
  SWITCH_TRANSLATION_HINT: 'switchTranslationHint',
  UPDATE_CURRENT_ROUND_COUNT: 'updateCurrentRoundCount',
  UPDATE_CURRENT_ROUND_DATA: 'updateCurrentRoundData',
  UPDATE_CURRENT_SENTENCE_INDEX: 'updateCurrentSentenceIndex',
  UPDATE_STORE_TO_INITIAL_STATE: 'updateStoreToInitialState',
} as const;

type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];

interface ActionWithPayload<T, U extends ActionType> {
  payload: T;
  type: U;
}

interface ActionWithoutPayload<T extends ActionType> {
  type: T;
}

export const addPhraseLearned = (value: string): ActionWithPayload<string, typeof ACTIONS.ADD_PHRASE_LEARNED> => ({
  payload: value,
  type: ACTIONS.ADD_PHRASE_LEARNED,
});

export const addPhraseNotLearned = (
  value: string,
): ActionWithPayload<string, typeof ACTIONS.ADD_PHRASE_NOT_LEARNED> => ({
  payload: value,
  type: ACTIONS.ADD_PHRASE_NOT_LEARNED,
});

export const addUserFirstName = (value: string): ActionWithPayload<string, typeof ACTIONS.ADD_USER_FIRST_NAME> => ({
  payload: value,
  type: ACTIONS.ADD_USER_FIRST_NAME,
});

export const addUserLastName = (value: string): ActionWithPayload<string, typeof ACTIONS.ADD_USER_LAST_NAME> => ({
  payload: value,
  type: ACTIONS.ADD_USER_LAST_NAME,
});

export const changeRound = (value: number): ActionWithPayload<number, typeof ACTIONS.CHANGE_ROUND> => ({
  payload: value,
  type: ACTIONS.CHANGE_ROUND,
});

export const changeLevel = (value: number): ActionWithPayload<number, typeof ACTIONS.CHANGE_LEVEL> => ({
  payload: value,
  type: ACTIONS.CHANGE_LEVEL,
});

export const addFinishedLevel = (value: number): ActionWithPayload<number, typeof ACTIONS.ADD_FINISHED_LEVEL> => ({
  payload: value,
  type: ACTIONS.ADD_FINISHED_LEVEL,
});

export const addFinishedRound = (value: {
  level: number;
  round: number;
}): ActionWithPayload<{ level: number; round: number }, typeof ACTIONS.ADD_FINISHED_ROUND> => ({
  payload: value,
  type: ACTIONS.ADD_FINISHED_ROUND,
});

export const switchBackgroundHint = (): ActionWithoutPayload<typeof ACTIONS.SWITCH_BACKGROUND_HINT> => ({
  type: ACTIONS.SWITCH_BACKGROUND_HINT,
});

export const switchSoundHint = (): ActionWithoutPayload<typeof ACTIONS.SWITCH_SOUND_HINT> => ({
  type: ACTIONS.SWITCH_SOUND_HINT,
});

export const switchTranslationHint = (): ActionWithoutPayload<typeof ACTIONS.SWITCH_TRANSLATION_HINT> => ({
  type: ACTIONS.SWITCH_TRANSLATION_HINT,
});

export const updateCurrentRoundCount = (
  value: number,
): ActionWithPayload<number, typeof ACTIONS.UPDATE_CURRENT_ROUND_COUNT> => ({
  payload: value,
  type: ACTIONS.UPDATE_CURRENT_ROUND_COUNT,
});

export const updateCurrentRoundData = (
  data: RoundData,
): ActionWithPayload<RoundData, typeof ACTIONS.UPDATE_CURRENT_ROUND_DATA> => ({
  payload: data,
  type: ACTIONS.UPDATE_CURRENT_ROUND_DATA,
});

export const updateCurrentSentenceIndex = (): ActionWithoutPayload<typeof ACTIONS.UPDATE_CURRENT_SENTENCE_INDEX> => ({
  type: ACTIONS.UPDATE_CURRENT_SENTENCE_INDEX,
});

export const setCurrentSentenceIndex = (
  value: number,
): ActionWithPayload<number, typeof ACTIONS.SET_CURRENT_SENTENCE_INDEX> => ({
  payload: value,
  type: ACTIONS.SET_CURRENT_SENTENCE_INDEX,
});

export const updateStoreToInitialState = (
  value: State,
): ActionWithPayload<State, typeof ACTIONS.UPDATE_STORE_TO_INITIAL_STATE> => ({
  payload: value,
  type: ACTIONS.UPDATE_STORE_TO_INITIAL_STATE,
});

export const setDefaultHintState = (
  value: boolean,
): ActionWithPayload<boolean, typeof ACTIONS.SET_DEFAULT_HINT_STATE> => ({
  payload: value,
  type: ACTIONS.SET_DEFAULT_HINT_STATE,
});

export const setDefaultPhrases = (value: string): ActionWithPayload<string, typeof ACTIONS.SET_DEFAULT_PHRASES> => ({
  payload: value,
  type: ACTIONS.SET_DEFAULT_PHRASES,
});
