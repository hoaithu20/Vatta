export enum QuestionStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  BLOCK = 2,
}

export enum Level {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

export const LevelMap ={
  [Level.EASY]: 'dễ',
  [Level.MEDIUM]: 'trung bình',
  [Level.HARD]: 'khó',

}

export enum GetQuestionType {
  ACTIVE,
  INACTIVE,
  MINE,
  DONE,
  NOT_DONE,
}
