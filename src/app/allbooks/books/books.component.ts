import { BookService } from "./../../service/books/book.service";
import { UserService } from "./../../service/user/user.service";
import { AuthService } from "src/app/service/auth/auth.service";
import { EditBookComponent } from "./../edit-book/edit-book.component";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
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
  public filtered_books: any;
  public user: IUser;
  private book_sub: Subscription;
  private user_sub: Subscription;
  public loading: boolean;
  public user_uid: string = JSON.parse(localStorage.getItem("user") || "{}")
    .uid;
  public searchData: { title: string; description: string };

  constructor(
    public adminService: AdminService,
    private snack: SnackService,
    private dialog: MatDialog,
    public auth: AuthService,
    public userService: UserService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.book_sub = this.adminService
      .getAllBooks()
      .subscribe((books: IBook[]) => {
        this.books = books;
        this.filtered_books = books;
      });

    this.user_sub = this.userService
      .getUserData(this.user_uid)
      .subscribe((data: any) => {
        this.user = data;
      });

    this.searchData = {
      title: "",
      description: "",
    };
  }

  filterData() {
    let new_books = this.books;
    if (this.searchData.title.length > 0) {
      new_books = new_books.filter((item) => {
        if (
          item.title?.includes(this.searchData.title) ||
          item.description?.includes(this.searchData.title)
        ) {
          return true;
        } else {
          return false;
        }
      });
    }

    this.filtered_books = new_books;
  }

  clearData() {
    this.filtered_books = this.books;
    this.searchData.title = "";
    this.searchData.description = "";
  }

  async issueBook(bookData: IBook) {
    this.loading = true;
    let exists: boolean = false;

    this.user.books?.filter((book) => {
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
      await this.bookService.issueBook(this.user_uid, bookData, this.user);
    } catch (err) {
      this.snack.bookError("Error while adding book");
    }

    this.loading = false;
  }

  openEditForm(bookData: IBook) {
    const editForm = new MatDialogConfig();
    editForm.disableClose = true;
    editForm.autoFocus = true;
    editForm.data = bookData;
    this.dialog.open(EditBookComponent, editForm);
  }

  ngOnDestroy(): void {
    this.book_sub.unsubscribe();
    this.user_sub.unsubscribe();
  }
}
