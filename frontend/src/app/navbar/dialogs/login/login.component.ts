import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Userservice } from '../../../services/user/user.service';
import { LoadingButtonComponent } from '../../../components/loading-button/loading-button.component';
import { expandCollapse, slideLeftRight, slideRightLeft } from '../../../animations/fade.animation';
import { CommonModule } from '@angular/common';

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
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    slideLeftRight,
    slideRightLeft,
    expandCollapse
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

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Email field for signup
      confirmPassword: ['', Validators.required] // Confirm password field for signup
    });
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
            // Handle login error (e.g., show a message to the user)
          }
        );
      }
    } else {
      if (this.signupForm.valid) {
        this.loading = true; // Set loading state to true
        this.userService.register(this.signupForm.value).subscribe(
          response => {
            console.log('Signup successful', response);
            this.loading = false; // Reset loading state
            this.dialogRef.close(this.signupForm.value); // Close the dialog and pass the form data
          },
          error => {
            console.error('Signup failed', error);
            this.loading = false; // Reset loading state
            // Handle signup error (e.g., show a message to the user)
          }
        );
      }
    }
  }

  // Method to switch between login and signup
  toggleLoginSignup(): void {
    this.isLogin = !this.isLogin; // Toggle the login/signup state
  }

  close(): void {
    this.dialogRef.close(); // Close the dialog without passing any data
  }
}
