import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BooksComponent } from "./books/books.component";
import { AllBooksRoutingModule } from "./allbooks.routing.module";
import { SharedModule } from "../shared/shared.module";
import { EditBookComponent } from "./edit-book/edit-book.component";

@NgModule({
  declarations: [BooksComponent, EditBookComponent],
  imports: [
    CommonModule,
    AllBooksRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  entryComponents: [EditBookComponent],
})
export class AllbooksModule {}
