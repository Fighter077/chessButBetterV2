import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Userservice } from '../../../services/user/user.service';
import { LoadingButtonComponent } from '../../../components/loading-button/loading-button.component';
import { expandCollapse, slideLeftRight, slideRightLeft } from '../../../animations/fade.animation';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../../validators/passwordMatch.validator';
import { PasswordComponent } from "../../../components/input/password/password.component";

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    LoadingButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    LoadingButtonComponent,
    ReactiveFormsModule,
    PasswordComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    slideLeftRight(),
    slideRightLeft(),
    expandCollapse('horizontal', 150)
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  signupForm!: FormGroup; // Form group for signup
  loading = false; // Loading state for the button

  isLogin: boolean = true; // Flag to determine if the user is logging in or signing up

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private userService: Userservice
  ) { }

  clearInvalidLoginError(): void {
    if (this.form.get('username')?.hasError('invalidLogin')) {
      this.form.get('username')?.setErrors(null); // Clear the error if the username is valid
    }
    if (this.form.get('password')?.hasError('invalidLogin')) {
      this.form.get('password')?.setErrors(null); // Clear the error if the password is valid
    }
  }

  shareValue(to: FormGroup, type: string, value: string): void {
    if (to.get(type)?.value !== value) {
      to.get(type)?.setValue(value); // Set the value in the other form group
    }
  }

  setupSharedValue(from: FormGroup, to: FormGroup, type: string, clear: boolean): void {
    from.get(type)?.valueChanges.subscribe(() => {
      if (clear) {
        this.clearInvalidLoginError(); // Clear the error if the username is valid
      }
      this.shareValue(to, type, from.get(type)?.value); // Share the value between the two forms
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      password: ['', [Validators.required, Validators.maxLength(20)]]
    });

    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator }); // Custom validator to check if passwords match

    this.setupSharedValue(this.form, this.signupForm, 'username', true); // Share the value between the two forms
    this.setupSharedValue(this.form, this.signupForm, 'password', true); // Share the value between the two forms

    this.setupSharedValue(this.signupForm, this.form, 'username', false); // Share the value between the two forms
    this.setupSharedValue(this.signupForm, this.form, 'password', false); // Share the value between the two forms
  }

  animationsEnabled = false;

  ngAfterViewInit() {
    // Enable animations **after initial render**
    setTimeout(() => this.animationsEnabled = true);
  }

  submit(): void {
    if (this.isLogin) {
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

            if (error.status === 401) {
              this.form.get('username')?.setErrors({ invalidLogin: true });
              this.form.get('password')?.setErrors({ invalidLogin: true });
            }
          }
        );
      }
    } else {
      if (this.signupForm.valid) {
        this.loading = true; // Set loading state to true
        this.userService.register(
          {
            'username': this.signupForm.value.username,
            'password': this.signupForm.value.password,
            'email': this.signupForm.value.email
          }
        ).subscribe(
          response => {
            console.log('Signup successful', response);
            this.loading = false; // Reset loading state
            this.dialogRef.close(this.signupForm.value); // Close the dialog and pass the form data
          },
          error => {
            console.error('Signup failed', error);
            this.loading = false; // Reset loading state
            if (error.status === 409) {
              console.log(error.error.error);
              if (error?.error?.error?.startsWith('User with username')) {
                this.signupForm.get('username')?.setErrors({ taken: true });
              }
              if (error?.error?.error?.startsWith('User with email')) {
                this.signupForm.get('email')?.setErrors({ taken: true });
              }
            }
          }
        );
      }
    }
  }

  get passwordControlLogin(): FormControl {
    return this.form.get('password') as FormControl; // Get the password control from the login form
  }

  get passwordControlSignUp(): FormControl {
    return this.signupForm.get('password') as FormControl;
  }

  get confirmPasswordControlSignUp(): FormControl {
    return this.signupForm.get('confirmPassword') as FormControl;
  }

  // Method to switch between login and signup
  toggleLoginSignup(): void {
    this.isLogin = !this.isLogin; // Toggle the login/signup state
  }

  close(): void {
    this.dialogRef.close(); // Close the dialog without passing any data
  }
}
