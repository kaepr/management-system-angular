import { Component, OnDestroy, OnInit } from "@angular/core";
import { AdminService } from "src/app/service/admin/admin.service";
import { Subscription } from "rxjs";
import { IBook } from "../../interfaces/Book";

@Component({
  selector: "app-allbooks",
  templateUrl: "./allbooks.component.html",
  styleUrls: ["./allbooks.component.scss"],
})
export class AllbooksComponent implements OnInit, OnDestroy {
  books: IBook[];
  sub: Subscription;

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    this.sub = this.adminService.getAllBooks().subscribe((books: IBook[]) => {
      this.books = books.map((book: IBook) => {
        return {
          title: book.title,
          description: book.description,
          author: book.author,
        };
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
