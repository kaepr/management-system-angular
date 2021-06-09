import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any;
  currentUserData: any;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.afAuth.authState.subscribe((user) => {
      /**
       * If user from firebase exists, then set that object inside localstorage
       * else sets a empty object, which should be handled properly
       */
      if (user) {
        this.userData = user;
        this.currentUserData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
      } else {
        localStorage.setItem("user", "{}");
      }
    });
  }

  async SignIn(email: string, password: string) {
    try {
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      await this.SetUserData(res.user);
      this.ngZone.run(() => {
        this.router.navigate([""]);
      });
    } catch (err) {
      throw err;
    }
  }

  async SignUp(email: string, password: string) {
    try {
      const res = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.SetUserData(res.user);
      this.ngZone.run(() => {
        this.router.navigate([""]);
      });
    } catch (err) {
      throw err;
    }
  }

  async SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    const userData = {
      uid: user.uid,
      email: user.email,
      isAdmin: false,
    };

    return userRef.set(userData, {
      merge: true,
    });
  }

  async SignOut() {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem("user");
      this.router.navigate(["login"]);
    } catch (err) {
      console.log(err);
    }
    return;
  }

  userLogged() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (Object.keys(user).length !== 0) {
      return true;
    }
    return false;
  }

  get isLoggedIn(): boolean {
    return this.userLogged();
  }

  getData() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async getFireStoreData(userID: string) {
    const userDoc = this.afs.collection("users").doc(`${userID}`);
    const data = await userDoc.valueChanges().pipe(first()).toPromise();
    return data;
  }

  async isAdmin() {
    if (this.userLogged()) {
      const user = await this.getData();
      console.log("UID here = ", user?.uid);
      if (user) {
        const fsData: any = await this.getFireStoreData(user.uid);
        console.log("fsData", fsData);
        return fsData.isAdmin;
      }
    }
    return false;
  }
}
