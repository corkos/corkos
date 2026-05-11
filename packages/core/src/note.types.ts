export type Position = {
  readonly x: number;
  readonly y: number;
};

export type Note = {
  readonly id: string;
  readonly title: string;
  readonly position: Position;
};
