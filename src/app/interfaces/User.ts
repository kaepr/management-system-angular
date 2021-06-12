interface UserBooks {
  id: string;
  issued: boolean;
}

export interface IUser {
  uid?: string;
  email: string;
  isAdmin: boolean;
  books?: UserBooks[];
}
