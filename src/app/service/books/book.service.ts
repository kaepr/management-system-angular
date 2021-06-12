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
  constructor(private afAuth: AngularFireAuth, private fs: AngularFirestore) {}

  getUserBooks(){
    
  }

}
