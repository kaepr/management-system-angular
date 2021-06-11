import { Component, OnInit, OnDestroy } from "@angular/core";
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

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    this.sub = this.adminService.getAllBooks().subscribe((books: IBook[]) => {
      this.books = books;
      console.log("books = ", books);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
