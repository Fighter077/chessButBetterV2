import { Component, Inject } from '@angular/core';
import { LoadingButtonComponent } from "../../loading-button/loading-button.component";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm',
  imports: [
    LoadingButtonComponent,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {
  loading = false; // Loading state for the button

  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      confirmTitle: string;
      confirmText: string;
      confirmButtonText: string;
      onConfirm?: () => Observable<any> | void
    }
  ) { }

  confirm() {
    this.loading = true; // Set loading state to true
    if (this.data.onConfirm) {
      const result = this.data.onConfirm();
      if (result instanceof Observable) {
        result.subscribe(() => {
          this.loading = false; // Set loading state to false after the observable completes
          this.dialogRef.close(true);
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}

