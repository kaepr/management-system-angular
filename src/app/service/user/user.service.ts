import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  getUserData(userId: string) {
    return this.afs.collection("users").doc(userId).valueChanges();
  }
}
