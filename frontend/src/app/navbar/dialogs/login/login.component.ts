import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Userservice } from '../../../services/user/user.service';
import { LoadingButtonComponent } from '../../../components/loading-button/loading-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    LoadingButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    LoadingButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false; // Loading state for the button

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private userService: Userservice
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true; // Set loading state to true
      this.userService.login(this.form.value).subscribe(
        response => {
          console.log('Login successful', response);
          this.loading = false; // Reset loading state
          this.dialogRef.close(this.form.value); // Close the dialog and pass the form data
        },
        error => {
          console.error('Login failed', error);
          this.loading = false; // Reset loading state
          // Handle login error (e.g., show a message to the user)
        }
      );
    }
  }

  close(): void {
    this.dialogRef.close(); // Close the dialog without passing any data
  }
}
