import { IBook } from "./Book";

interface UserBooks {
  book: IBook;
  issued: boolean;
  issueId: string;
}

export interface IUser {
  uid: string;
  email: string;
  isAdmin: boolean;
  books?: UserBooks[];
}
