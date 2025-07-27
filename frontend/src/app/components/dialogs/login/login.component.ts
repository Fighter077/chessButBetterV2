import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../services/user/user.service';
import { LoadingButtonComponent } from '../../../components/loading-button/loading-button.component';
import { expandCollapse, slideLeftRight, slideRightLeft } from '../../../animations/fade.animation';

import { passwordMatchValidator } from '../../../validators/passwordMatch.validator';
import { PasswordComponent } from "../../../components/input/password/password.component";
import { NavigationService } from '../../../services/navigation/navigation.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from "@angular/material/list";
import { LogoComponent } from '../../logo/logo.component';
import { environment } from 'src/environments/environment';

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
    PasswordComponent,
    TranslateModule,
    MatListModule,
    LogoComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    slideLeftRight(),
    slideRightLeft(),
    expandCollapse('vertical', 150)
  ]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  form!: FormGroup;
  signupForm!: FormGroup; // Form group for signup
  loading = false; // Loading state for the button

  isLogin: boolean = true; // Flag to determine if the user is logging in or signing up

  sharedValueSubscriptions: (Subscription | undefined)[] = []; // Array to hold subscriptions for shared values
  loginSubscription: Subscription | undefined; // Subscription for login form
  registerSubscription: Subscription | undefined; // Subscription for signup form

  animationsEnabled = false;

  oauthOptions = ['google', 'linkedin']

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private userService: UserService,
    private navigationService: NavigationService,
    private router: Router
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
    this.sharedValueSubscriptions.push(
      from.get(type)?.valueChanges.subscribe(() => {
        if (clear) {
          this.clearInvalidLoginError(); // Clear the error if the username is valid
        }
        this.shareValue(to, type, from.get(type)?.value); // Share the value between the two forms
      }));
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

  ngAfterViewInit() {
    // Enable animations **after initial render**
    setTimeout(() => this.animationsEnabled = true);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.sharedValueSubscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe(); // Unsubscribe from the login subscription
    }
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe(); // Unsubscribe from the register subscription
    }
  }

  submit(): void {
    if (this.isLogin) {
      if (this.form.valid) {
        this.loading = true; // Set loading state to true
        this.loginSubscription = this.userService.login(this.form.value).subscribe(
          () => this.success(),
          error => {
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
        this.registerSubscription = this.userService.register(
          {
            'username': this.signupForm.value.username,
            'password': this.signupForm.value.password,
            'email': this.signupForm.value.email
          }
        ).subscribe(
          () => this.close(),
          error => {
            console.error('Signup failed', error);
            this.loading = false; // Reset loading state
            if (error.status === 409) {
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

  success(): void {
    this.close();
    const returnUrl = this.navigationService.getReturnUrl();
    const returnParams = this.navigationService.getReturnParams();
    if (returnUrl) {
      this.navigationService.clearReturnUrl();
      this.router.navigate([returnUrl], { queryParams: returnParams });
    }
  }

  loginWith(provider: string): void {
    this.loading = true; // Set loading state to true
    window.location.href = `${environment.backendUrl}/authentication/login/oauth/${provider}`;
  }
}
