import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/service/auth/auth.service";

@Component({
  selector: "app-email-password-login",
  templateUrl: "./email-password-login.component.html",
  styleUrls: ["./email-password-login.component.scss"],
})
export class EmailPasswordLoginComponent implements OnInit {
  form: FormGroup;

  type: "login" | "signup" = "signup";
  loading: boolean;

  serverMessage: string;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.minLength(6), Validators.required]],
      passwordConfirm: ["", []],
    });
  }

  changeType(val: "login" | "signup") {
    this.type = val;
  }

  get isLogin() {
    return this.type === "login";
  }

  get isSignup() {
    return this.type === "signup";
  }

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  get passwordConfirm() {
    return this.form.get("passwordConfirm");
  }

  get passwordDoesMatch() {
    if (this.type !== "signup") {
      return true;
    } else {
      return this.password?.value === this.passwordConfirm?.value;
    }
  }

  async onSubmit() {
    this.loading = true;

    const email: string = this.email?.value;
    const password: string = this.password?.value;

    try {
      if (this.isLogin) {
        await this.afAuth.signInWithEmailAndPassword(email, password);
      }

      if (this.isSignup) {
        await this.afAuth.createUserWithEmailAndPassword(email, password);
      }
    } catch (err) {
      this.serverMessage = err;
    }

    this.loading = false;
  }
}
