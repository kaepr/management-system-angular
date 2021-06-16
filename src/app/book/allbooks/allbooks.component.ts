import { Component, OnDestroy, OnInit } from "@angular/core";
import { AdminService } from "src/app/service/admin/admin.service";
import { Subscription } from "rxjs";
import { IBook } from "../../interfaces/Book";
import { IUser } from "../../interfaces/User";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { SnackService } from "src/app/service/snack/snack.service";

@Component({
  selector: "app-allbooks",
  templateUrl: "./allbooks.component.html",
  styleUrls: ["./allbooks.component.scss"],
})
export class AllbooksComponent implements OnInit, OnDestroy {
  books: IBook[];
  user: IUser;
  book_sub: Subscription;
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
    this.book_sub = this.adminService
      .getAllBooks()
      .subscribe((books: IBook[]) => {
        this.books = books;
      });

    this.user_sub = this.afs
      .doc(`users/${this.user_uid}`)
      .valueChanges()
      .subscribe((data: any) => {
        this.user = data;
      });
  }

  async issueBook(bookData: IBook) {
    this.loading = true;
    console.log("bookData = ", bookData);

    let exists: boolean = false;

    this.user.books?.filter((book) => {
      console.log("book", book);
      if (bookData.id == book.book.id) {
        exists = true;
      }
    });

    if (exists) {
      this.snack.bookError("Book already issued !!");
      this.loading = false;
      return;
    }

    try {
      const userBooks = this.user.books;
      userBooks?.push({
        issued: false,
        book: bookData,
        issueId: this.afs.createId(),
      });
      await this.afs.doc(`users/${this.user_uid}`).update({ books: userBooks });
    } catch (err) {
      console.log("Error while updating", err);
    }

    this.loading = false;
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
    this.book_sub.unsubscribe();
    this.user_sub.unsubscribe();
  }
}
