import { IUser } from "src/app/interfaces/User";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { switchMap, map } from "rxjs/operators";
import { IBook } from "../../interfaces/Book";

@Injectable({
  providedIn: "root",
})
export class BookService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  getUserBooks() {}

  async issueBook(userId: string, bookData: IBook, user: IUser) {
    try {
      const userBooks = user.books;
      userBooks?.push({
        issued: false,
        book: bookData,
        issueId: this.afs.createId(),
      });
      await this.afs.doc(`users/${userId}`).update({ books: userBooks });
    } catch (err) {
      throw err;
    }
  }

  async removeBook(issueId: string, userId: string, user: IUser) {
    try {
      const updatedBooks = user.books?.filter((book) => {
        if (book.issueId != issueId) {
          return book;
        }
        return;
      });
      await this.afs.doc(`users/${userId}`).update({ books: updatedBooks });
    } catch (err) {
      throw err;
    }
  }
}
