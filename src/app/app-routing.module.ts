import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AdminGuard } from "./user/admin.guard";
import { AuthGuard } from "./user/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "login",
    loadChildren: () =>
      import("./user/user.module").then((module) => module.UserModule),
  },
  {
    path: "book",
    loadChildren: () =>
      import("./book/book.module").then((module) => module.BookModule),
    canActivate: [AuthGuard],
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((module) => module.AdminModule),
    canActivate: [AdminGuard],
  },
  {
    path: "allbooks",
    loadChildren: () =>
      import("./allbooks/allbooks.module").then(
        (module) => module.AllbooksModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
