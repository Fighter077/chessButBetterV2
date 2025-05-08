import { Component, Inject, OnDestroy } from '@angular/core';
import { LoadingButtonComponent } from "../../loading-button/loading-button.component";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
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
export class ConfirmComponent implements OnDestroy {
  loading = false; // Loading state for the button

  resultSubscription: Subscription | undefined; // Subscription to the result observable

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
        this.resultSubscription = result.subscribe(() => {
          this.loading = false; // Set loading state to false after the observable completes
          this.dialogRef.close(true);
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe(); // Unsubscribe from the result observable to prevent memory leaks
    }
  }
}

