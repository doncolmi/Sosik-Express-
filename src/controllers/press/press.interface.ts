export interface Press {
  _id?: string;
  pressId: string;
  pressName: string;
  pressNewsCount?: number;
}

export interface PressFollow {
  _id?: string;
  pressId: string;
  userId: number;
  createdDate?: Date;
  modifiedDate?: Date;
}
