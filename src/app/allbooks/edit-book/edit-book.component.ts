import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IBook } from "src/app/interfaces/Book";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-edit-book",
  templateUrl: "./edit-book.component.html",
  styleUrls: ["./edit-book.component.scss"],
})
export class EditBookComponent implements OnInit {
  public editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditBookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IBook
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
