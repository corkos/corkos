export type Position = {
  readonly x: number;
  readonly y: number;
};

export type Note = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly position: Position;
};
