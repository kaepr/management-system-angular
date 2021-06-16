import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SnackService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  bookError(errorMessage: string) {
    this.snackBar.open(errorMessage, "OK", {
      duration: 4000,
    });
  }

  authError() {
    this.snackBar.open("You must be logged in!", "OK", {
      duration: 5000,
    });

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(tap((_) => this.router.navigate(["/login"])))
      .subscribe();
  }

  adminError() {
    this.snackBar.open("You do not have the authorization!", "OK", {
      duration: 3000,
    });

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(tap((_) => this.router.navigate(["/login"])))
      .subscribe();
  }
}
