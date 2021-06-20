import { Component, OnInit, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { IUser, IUserBooks } from "src/app/interfaces/User";
import { AdminService } from "src/app/service/admin/admin.service";
import { IBook } from "../../interfaces/Book";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.scss"],
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  users: IUser[];
  users_filtered: IUser[];
  book_sub: Subscription;
  user_sub: Subscription;
  createBookForm: FormGroup;
  serverMessage: any;
  loading: boolean;
  uploadPercent: Observable<number | undefined>;
  downloadURL: Observable<string>;
  imgUrl: string = "";

  constructor(
    public adminService: AdminService,
    private fb: FormBuilder,
    public afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.createBookForm = this.fb.group({
      title: ["Book Title", [Validators.required]],
      author: ["Author Name", [Validators.required]],
      description: [
        "Book description",
        [Validators.required, Validators.maxLength(200)],
      ],
      price: ["150", [Validators.required]],
    });

    this.user_sub = this.afs
      .collection("users")
      .valueChanges()
      .subscribe((users: any) => {
        this.users = users;
        this.users_filtered = this.users?.map((user) => {
          const books: any = user.books?.filter((item) => !item.issued);
          if (books?.length > 0) {
            const obj: IUser = {
              email: user.email,
              books: books,
              isAdmin: user.isAdmin,
              uid: user.uid,
            };
            return obj;
          }
          return;
        });

        console.log("filtered ", this.users_filtered);
      });
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    const imageName = this.afs.createId();
    const filePath = `books/${imageName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url) => {
            this.imgUrl = url;
          });
        })
      )
      .subscribe();
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

  get price() {
    return this.createBookForm.get("price");
  }

  async allowIssue(bookId: string, user: IUser) {
    this.loading = true;

    try {
      const updatedBooks = user?.books?.filter((book) => {
        if (book.issueId == bookId) {
          book.issued = true;
          return book;
        } else {
          return book;
        }
      });

      user.books = updatedBooks;
      await this.afs.doc(`users/${user?.uid}`).update(user);
    } catch (err) {
      console.log("Error in updating issue info", err);
    }

    this.loading = false;
  }

  async createBookSubmit() {
    this.loading = true;
    const title = this.title?.value;
    const author = this.author?.value;
    const description = this.description?.value;
    const price = this.price?.value;
    try {
      await this.adminService.createBook({
        title,
        author,
        description,
        price,
        imageUrl: this.imgUrl,
      });
    } catch (err) {
      this.serverMessage = err;
    }
    this.imgUrl = "";
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.user_sub.unsubscribe();
  }
}
