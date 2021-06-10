import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../service/auth/auth.service";
import { SnackService } from "../service/snack/snack.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private snack: SnackService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isLoggedIn) {
      this.snack.authError();
      return this.router.parseUrl("/login");
    }
    await this.auth.isAdmin();

    if (!this.auth.isUserAdmin) {
      this.snack.adminError();
      return this.router.parseUrl("/login");
    }
    return this.auth.isUserAdmin;
  }
}
