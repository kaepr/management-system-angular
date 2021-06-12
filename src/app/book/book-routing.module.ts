import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllbooksComponent } from "./allbooks/allbooks.component";

const routes: Routes = [
  {
    path: "",
    component: AllbooksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookRoutingModule {}
