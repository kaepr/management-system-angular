import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { switchMap, map } from "rxjs/operators";
import { IBook } from "../../interfaces/Book";

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

  updateBook(boardId: string, data: IBook) {
    return this.afs.collection("books").doc(boardId).update(data);
  }

  getAllBooks() {
    return this.afs.collection("books").valueChanges({ idField: "id" });
  }
}
