import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BookRoutingModule } from "./book-routing.module";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AllbooksComponent } from "./allbooks/allbooks.component";

@NgModule({
  declarations: [AllbooksComponent],
  imports: [CommonModule, BookRoutingModule, SharedModule, ReactiveFormsModule],
})
export class BookModule {}
