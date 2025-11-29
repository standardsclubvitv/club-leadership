export interface Position {
  id: string;
  title: string;
  description: string;
  questions: string[];
  isActive: boolean;
}

export interface PositionAnswer {
  question: string;
  answer: string;
}

export interface PositionApplication {
  positionId: string;
  positionName: string;
  answers: PositionAnswer[];
}
