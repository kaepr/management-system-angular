import { BookService } from "./../../service/books/book.service";
import { UserService } from "./../../service/user/user.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IUser, IUserBooks } from "../../interfaces/User";
import { SnackService } from "src/app/service/snack/snack.service";

@Component({
  selector: "app-allbooks",
  templateUrl: "./allbooks.component.html",
  styleUrls: [
    "./allbooks.component.scss",
    "../../allbooks/books/books.component.scss",
  ],
})
export class AllbooksComponent implements OnInit, OnDestroy {
  public issued_books: IUserBooks[] | undefined;
  public waiting_books: IUserBooks[] | undefined;
  public user: IUser;
  private user_sub: Subscription;
  public loading: boolean;
  private user_uid: string = JSON.parse(localStorage.getItem("user") || "{}")
    .uid;

  constructor(
    private snack: SnackService,
    private userService: UserService,
    private bookSerive: BookService
  ) {}

  ngOnInit(): void {
    this.user_sub = this.userService
      .getUserData(this.user_uid)
      .subscribe((data: any) => {
        this.user = data;
        this.issued_books = this.user.books?.filter((item) => item.issued);
        this.waiting_books = this.user.books?.filter((item) => !item.issued);
      });
  }

  async removeBook(issueId: string) {
    this.loading = true;
    try {
      await this.bookSerive.removeBook(issueId, this.user_uid, this.user);
    } catch (err) {
      this.snack.bookError("Error in removing book");
    }
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.user_sub.unsubscribe();
  }
}
