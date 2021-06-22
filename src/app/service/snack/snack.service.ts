import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SnackService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  bookError(errorMessage: string) {
    this.snackBar.open(errorMessage, "OK", {
      duration: 4000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

  authError() {
    this.snackBar.open("You must be logged in!", "OK", {
      duration: 4000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(tap((_) => this.router.navigate(["/login"])))
      .subscribe();
  }

  adminError() {
    this.snackBar.open("You do not have the authorization!", "OK", {
      duration: 4000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });

    return this.snackBar._openedSnackBarRef
      ?.onAction()
      .pipe(tap((_) => this.router.navigate(["/login"])))
      .subscribe();
  }
}
