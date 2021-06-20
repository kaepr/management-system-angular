import { IBook } from "./Book";

export interface IUserBooks {
  book: IBook;
  issued: boolean;
  issueId: string;
}

export interface IUser {
  uid: string;
  email: string;
  isAdmin: boolean;
  books?: IUserBooks[];
}
