import { Component, OnDestroy, OnInit } from "@angular/core";
import { AdminService } from "src/app/service/admin/admin.service";
import { Subscription } from "rxjs";
import { IBook } from "../../interfaces/Book";
import { IUser, IUserBooks } from "../../interfaces/User";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
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
  issued_books: IUserBooks[] | undefined;
  waiting_books: IUserBooks[] | undefined;
  user: IUser;
  user_sub: Subscription;
  loading: boolean;
  user_uid: string = JSON.parse(localStorage.getItem("user") || "{}").uid;

  constructor(
    public adminService: AdminService,
    public auth: AngularFireAuth,
    public afs: AngularFirestore,
    private snack: SnackService
  ) {}

  ngOnInit(): void {
    this.user_sub = this.afs
      .doc(`users/${this.user_uid}`)
      .valueChanges()
      .subscribe((data: any) => {
        this.user = data;

        this.issued_books = this.user.books?.filter((item) => item.issued);
        this.waiting_books = this.user.books?.filter((item) => !item.issued);
      });
  }

  async removeBook(issueId: string) {
    this.loading = true;
    const updatedBooks = this.user.books?.filter((book) => {
      if (book.issueId != issueId) {
        return book;
      }
      return;
    });

    await this.afs
      .doc(`users/${this.user_uid}`)
      .update({ books: updatedBooks });
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.user_sub.unsubscribe();
  }
}
