import { SnackService } from "src/app/service/snack/snack.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IBook } from "src/app/interfaces/Book";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription, Observable } from "rxjs";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-edit-book",
  templateUrl: "./edit-book.component.html",
  styleUrls: ["./edit-book.component.scss"],
})
export class EditBookComponent implements OnInit {
  public editForm: FormGroup;
  public loading: boolean;
  public uploadPercent: Observable<number | undefined>;
  public downloadURL: Observable<string>;
  public imgUrl: string = "";

  constructor(
    public snack: SnackService,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    public afs: AngularFirestore,
    public dialogRef: MatDialogRef<EditBookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IBook
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      title: [this.data.title, [Validators.required]],
      author: [this.data.author, [Validators.required]],
      description: [
        this.data.description,
        [Validators.required, Validators.maxLength(200)],
      ],
      price: [this.data.price, [Validators.required]],
    });
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
    return this.editForm.get("author");
  }

  get title() {
    return this.editForm.get("title");
  }

  get description() {
    return this.editForm.get("description");
  }

  get price() {
    return this.editForm.get("price");
  }

  async updateBookData() {
    this.loading = true;
    const title = this.title?.value;
    const author = this.author?.value;
    const description = this.description?.value;
    const price = this.price?.value;

    try {
      const updatedBook = {
        title,
        author,
        description,
        imageUrl: this.imgUrl,
        price,
      };
      await this.afs.doc(`books/${this.data.id}`).update(updatedBook);
      this.snack.generalMessage("Book successfully updated");
    } catch (err) {
      this.snack.generalMessage("Error in updating book");
      // console.log("Error in updating book");
    }

    this.onNoClick();
    this.loading = false;
  }
}
