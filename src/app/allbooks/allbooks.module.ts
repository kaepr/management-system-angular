import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BooksComponent } from "./books/books.component";
import { AllBooksRoutingModule } from "./allbooks.routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [BooksComponent],
  imports: [CommonModule, AllBooksRoutingModule, SharedModule],
})
export class AllbooksModule {}
