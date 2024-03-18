import type { State } from '../store/reducer';

export const tagNames = {
  audio: 'audio',
  button: 'button',
  div: 'div',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  img: 'img',
  input: 'input',
  option: 'option',
  select: 'select',
} as const;

export const levels = {
  LEVEL_FIVE: 4,
  LEVEL_FOUR: 3,
  LEVEL_ONE: 0,
  LEVEL_SIX: 5,
  LEVEL_THREE: 2,
  LEVEL_TWO: 1,
} as const;

export const eventNames = {
  // do I need it?
  BEFOREUNLOAD: 'beforeunload',
  CHANGE: 'change',
  CLICK: 'click',
  DOM_CONTENT_LOADED: 'DOMContentLoaded',
  INPUT: 'input',
};

export const paths = {
  chooseGamePage: './pages/choose-game/choose-game.ts',
  loginPage: './pages/login/login.ts',
  mainPage: './pages/main/main.ts',
  notFoundPage: './pages/not-found/not-found.ts',
  startPage: './pages/start/start.ts',
  statisticsPage: './pages/statistics/statistics.ts',
} as const;

export const initialState: State = {
  currentGameLevel: 0,
  currentGameRound: -1, // start will increment it
  currentRoundCount: 45, // TBD lvl1
  currentRoundData: {
    levelData: {
      author: '',
      cutSrc: '',
      id: '',
      imageSrc: '',
      name: '',
      year: '',
    },
    words: [],
  },
  currentSentenceIndex: 0,
  gameLevelsFinished: [],
  gameRoundsFinished: {
    level0: [],
    level1: [],
    level2: [],
    level3: [],
    level4: [],
    level5: [],
  },
  hintBackgroundOn: true,
  hintSoundOn: true,
  hintTranslationOn: true,
  phrasesLearned: [],
  phrasesNotLearned: [],
  userFirstName: '',
  userLastName: '',
};

export const buttonsTextContent = {
  CHOOSE_GAME: 'Choose Game',
  CONTINUE: 'Continue',
  GO_BACK: 'Wake Up',
  I_DONT_KNOW: "I Don't Know",
  LOG_OUT: 'Log Out',
  START: 'Start',
  STATISTICS: 'Statistics',
} as const;

export const gameDescriptions = {
  GAME_NAME: '<h1>RSS Puzzle</h1>',
  MAIN_DESCRIPTION:
    "is a fun and engaging language activity designed to help improve your English skills. In this interactive game, you'll rearrange words to form sentences. With different difficulty levels, helpful hints, and captivating artwork, you'll enjoy a unique puzzle-solving experience while sharpening your language abilities.",
} as const;

export const dataLinks: Record<string, string> = {
  audioLink: 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/',
  level0: 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel1.json',
  level1: 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel2.json',
  level2: 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel3.json',
  level3: 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel4.json',
  level4: 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel5.json',
  level5: 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/data/wordCollectionLevel6.json',
  levelLink: 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/',
} as const;

export type LinksTypes = (typeof dataLinks)[keyof typeof dataLinks];

export const specialPrefixes = [
  'dell',
  'van',
  'von',
  'de',
  'di',
  'del',
  'el',
  'la',
  'le',
  'mac',
  'mc',
  "o'",
  'al',
  'ben',
  'ibn',
] as const;

export const SVGs = {
  endPiece: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><path d="M0 0
  h200
  v100H0v-35.17c0-7.95 9.53 4.7 19.23 5.38 11.13 0.75 20.78-9.05 20.78-20.2 0-11.15-10.6-22.17-20.77-20.2-7.97 1.55-19.22 11.28-19.22,3.7z" fill="none" stroke="#372549" stroke-width="2"/>
  </svg>
  `,
  middlePiece: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 100"><path d="M0 0
  h200
  v33.5c0 7.56 11.25-2.15 19.23-3.69 10.17-1.98 20.77 9.04 20.77 20.19 0 11.15-9.65 20.96-20.77 20.19-9.69-0.65-19.23-13.31-19.23-5.35v35.2H0v-35.2c0-7.96 9.54 4.71 19.23 5.35 11.13 0.77 20.77-9.04 20.77-20.19 0-11.15 -10.6-22.17 -20.77-20.19 -7.98 1.54 -19.23 11.25-19.23 3.69z" fill="none" stroke="#372549" stroke-width="2"/>
  </svg>
  `,

  startPiece: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 100"><path d="M0 0
  h200
  v33.5c0 7.56 11.24-2.13 19.23-3.68 10.16-1.98 20.77 9.03 20.77 20.18 0 11.16-9.64 20.95-20.77 20.19-9.7-0.65-19.23-13.3-19.23-5.36v35.17H0V0z" fill="none" stroke="#372549" stroke-width="2"/>
  </svg>`,
} as const;
