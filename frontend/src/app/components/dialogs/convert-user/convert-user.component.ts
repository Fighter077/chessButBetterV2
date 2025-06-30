import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordComponent } from '../../input/password/password.component';
import { LoadingButtonComponent } from '../../loading-button/loading-button.component';
import { UserService } from 'src/app/services/user/user.service';
import { passwordMatchValidator } from 'src/app/validators/passwordMatch.validator';

@Component({
  selector: 'app-convert-user',
  imports: [
    MatDialogModule,
    MatButtonModule,
    LoadingButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    LoadingButtonComponent,
    ReactiveFormsModule,
    PasswordComponent,
    TranslateModule
  ],
  templateUrl: './convert-user.component.html',
  styleUrl: './convert-user.component.scss'
})
export class ConvertUserComponent {
  convertForm!: FormGroup; // Form group for convert
  loading = false; // Loading state for the button

  convertSubscription: any; // Subscription for convert form

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConvertUserComponent>,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.convertForm = this.fb.group({
      username: [this.userService.getCurrentUser()?.username, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator }); // Custom validator to check if passwords match
  }

  submit(): void {
    if (this.convertForm.valid) {
      this.loading = true; // Set loading state to true
      this.convertSubscription = this.userService.convertUser(
        {
          'username': this.convertForm.value.username,
          'password': this.convertForm.value.password,
          'email': this.convertForm.value.email
        }
      ).subscribe(
        () => this.close(),
        error => {
          console.error('Conversion failed', error);
          this.loading = false; // Reset loading state
          if (error.status === 409) {
            if (error?.error?.error?.startsWith('User with username')) {
              this.convertForm.get('username')?.setErrors({ taken: true });
            }
            if (error?.error?.error?.startsWith('User with email')) {
              this.convertForm.get('email')?.setErrors({ taken: true });
            }
          }
        }
      );
    }
  }

  get passwordControl(): FormControl {
    return this.convertForm.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.convertForm.get('confirmPassword') as FormControl;
  }

  close(): void {
    this.dialogRef.close(); // Close the dialog without passing any data
  }
}
