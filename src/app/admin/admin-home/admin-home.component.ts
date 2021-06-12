import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AdminService } from "src/app/service/admin/admin.service";
import { IBook } from "../../interfaces/Book";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.scss"],
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  books: IBook[];
  sub: Subscription;
  createBookForm: FormGroup;
  serverMessage: any;
  loading: boolean;

  constructor(public adminService: AdminService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createBookForm = this.fb.group({
      title: ["", [Validators.required]],
      author: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    this.sub = this.adminService.getAllBooks().subscribe((books: IBook[]) => {
      this.books = books;
      console.log("books = ", books);
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
    this.sub.unsubscribe();
  }
}
