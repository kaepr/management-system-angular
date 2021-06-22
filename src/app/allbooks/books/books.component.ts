import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";
import { IBook } from "src/app/interfaces/Book";
import { IUser } from "src/app/interfaces/User";
import { AdminService } from "src/app/service/admin/admin.service";
import { SnackService } from "src/app/service/snack/snack.service";

@Component({
  selector: "app-books",
  templateUrl: "./books.component.html",
  styleUrls: ["./books.component.scss"],
})
export class BooksComponent implements OnInit, OnDestroy {
  public books: IBook[];
  public user: IUser;
  private book_sub: Subscription;
  private user_sub: Subscription;
  public loading: boolean;
  public user_uid: string = JSON.parse(localStorage.getItem("user") || "{}")
    .uid;

  constructor(
    public adminService: AdminService,
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

  ngOnDestroy(): void {
    this.book_sub.unsubscribe();
    this.user_sub.unsubscribe();
  }
}
