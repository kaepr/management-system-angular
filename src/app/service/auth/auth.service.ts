import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { IUser } from "src/app/interfaces/User";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any;
  isUserAdmin: boolean;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.afAuth.authState.subscribe(async (user) => {
      /**
       * If user from firebase exists, then set that object inside localstorage
       * else sets a empty object, which should be handled properly
       */
      if (user) {
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        this.isAdmin();
      } else {
        localStorage.setItem("user", "{}");
        this.isUserAdmin = false;
      }
    });
  }

  async SignIn(email: string, password: string) {
    try {
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);

      this.router.navigate([""]);
      await this.isAdmin();
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
      this.router.navigate([""]);
    } catch (err) {
      throw err;
    }
  }

  async SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      isAdmin: false,
      books: [],
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
      this.isUserAdmin = false;
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
      const user: any = await this.getData();
      if (user) {
        const fsData: any = await this.getFireStoreData(user.uid);
        this.isUserAdmin = fsData.isAdmin;

        return this.isUserAdmin;
      }
    }
    this.isUserAdmin = false;
    return this.isUserAdmin;
  }
}
