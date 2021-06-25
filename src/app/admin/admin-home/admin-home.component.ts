import { SnackService } from "src/app/service/snack/snack.service";
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
  styleUrls: [
    "./admin-home.component.scss",
    "../../allbooks/books/books.component.scss",
  ],
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  public users: IUser[];
  public users_filtered: any;
  private user_sub: Subscription;
  public createBookForm: FormGroup;
  public serverMessage: any;
  public loading: boolean;
  public uploadPercent: Observable<number | undefined>;
  public downloadURL: Observable<string>;
  public imgUrl: string = "";

  constructor(
    public adminService: AdminService,
    private fb: FormBuilder,
    public afs: AngularFirestore,
    private storage: AngularFireStorage,
    public snack: SnackService
  ) {}

  ngOnInit(): void {
    this.createBookForm = this.fb.group({
      title: ["", [Validators.required]],
      author: ["", [Validators.required]],
      description: ["", [Validators.required, Validators.maxLength(200)]],
      price: ["", [Validators.required]],
    });

    this.user_sub = this.adminService.getAllUsers().subscribe((users: any) => {
      this.users = users;
      this.users_filtered = this.getFilteredUsers(users);
    });
  }

  getFilteredUsers(users: IUser[]) {
    let users_filtered = users?.map((user) => {
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
    return users_filtered;
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
      this.adminService.allowBookIssue(this.users, user, bookId);
    } catch (err) {
      this.snack.bookError("Error in allowing issue");
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
      this.snack.generalMessage("Created Book Successfully !");
    } catch (err) {
      this.serverMessage = err;
    }
    this.createBookForm.reset();
    this.imgUrl = "";
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.user_sub.unsubscribe();
  }
}
