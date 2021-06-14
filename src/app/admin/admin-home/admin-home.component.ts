import { Component, OnInit, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { IUser } from "src/app/interfaces/User";
import { AdminService } from "src/app/service/admin/admin.service";
import { IBook } from "../../interfaces/Book";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.scss"],
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  books: IBook[];
  users: IUser[];
  book_sub: Subscription;
  createBookForm: FormGroup;
  serverMessage: any;
  loading: boolean;
  user_sub: Subscription;

  constructor(
    public adminService: AdminService,
    private fb: FormBuilder,
    public afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.createBookForm = this.fb.group({
      title: ["", [Validators.required]],
      author: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    this.book_sub = this.adminService
      .getAllBooks()
      .subscribe((books: IBook[]) => {
        this.books = books;
      });

    this.user_sub = this.afs
      .collection("users")
      .valueChanges()
      .subscribe((users: any) => {
        this.users = users;
      });
  }

  get author() {
    return this.createBookForm.get("author");
  }

  get title() {
    return this.createBookForm.get("title");
  }

  get description() {
    return this.createBookForm.get("description");
  }

  async allowIssue(bookId: string, user: IUser) {
    // console.log("bookID, user", bookId, user);
    this.loading = true;

    try {
      const updatedBooks = user.books?.filter((book) => {
        if (book.issueId == bookId) {
          book.issued = true;
          return book;
        } else {
          return book;
        }
      });

      user.books = updatedBooks;

      // console.log("updated user = ", user);

      await this.afs.doc(`users/${user.uid}`).update(user);
    } catch (err) {
      console.log("Error in updating issue info", err);
    }

    this.loading = false;
    // update the document
  }

  async createBookSubmit() {
    this.loading = true;
    const title = this.title?.value;
    const author = this.author?.value;
    const description = this.description?.value;
    try {
      await this.adminService.createBook({
        title,
        author,
        description,
      });
    } catch (err) {
      this.serverMessage = err;
    }

    this.loading = false;
  }

  ngOnDestroy(): void {
    this.book_sub.unsubscribe();
    this.user_sub.unsubscribe();
  }
}
