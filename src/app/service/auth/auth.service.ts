import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any;
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
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user") || "{}");
      } else {
        localStorage.setItem("user", "{}");
        JSON.parse(localStorage.getItem("user") || "{}");
      }
    });
  }

  async SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.ngZone.run(() => {
          this.router.navigate(["home"]);
        });
        this.SetUserData(res.user);
      })
      .catch((err) => {
        // TODO Need to change to toasts later
        window.alert(err.message);
      });
  }

  async SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.SetUserData(res.user);
      })
      .catch((err) => {
        // TODO Need to change to toasts later
        window.alert(err.message);
      });
  }

  async SetUserData(user: any) {
    console.log("inside set user data = ", user);
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
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem("user");
      this.router.navigate(["login"]);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("inside is logged in:", user);
    
    if (Object.keys(user).length !== 0) {
      return true;
    }
    return false;
  }
}
