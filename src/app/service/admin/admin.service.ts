import { IUser } from "src/app/interfaces/User";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { switchMap, map } from "rxjs/operators";
import { IBook } from "../../interfaces/Book";
import { isNgContent } from "@angular/compiler";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  createBook(data: IBook) {
    return this.afs.collection("books").add({
      ...data,
    });
  }

  async updateBook(bookId: any, updatedData: any) {
    try {
      await this.afs.doc(`books/${bookId}`).update(updatedData);
    } catch (err) {
      throw err;
    }
  }

  getAllBooks() {
    return this.afs.collection("books").valueChanges({ idField: "id" });
  }

  getAllUsers() {
    return this.afs.collection("users").valueChanges();
  }

  async allowBookIssue(users: IUser[], user: IUser, bookId: string) {
    try {
      const book_owner = users.filter((item) => item.uid == user.uid);

      let cur_user = book_owner[0];
      const updatedBooks = cur_user?.books?.map((book) => {
        if (book.issueId == bookId) {
          book.issued = true;
          return book;
        } else {
          return book;
        }
      });

      cur_user.books = updatedBooks;

      await this.afs.doc(`users/${user.uid}`).update(cur_user);
    } catch (err) {
      throw err;
    }
  }
}
