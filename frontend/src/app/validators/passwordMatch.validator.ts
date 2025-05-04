import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const passwordControl = formGroup.get('password');
  const confirmPasswordControl = formGroup.get('confirmPassword');

  if (!passwordControl || !confirmPasswordControl) return null;

  const password = passwordControl.value;
  const confirmPassword = confirmPasswordControl.value;

  // Don't proceed if confirmPassword has its own validation errors (like 'required')
  if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mismatch']) {
    return null;
  }

  if (password !== confirmPassword) {
    confirmPasswordControl.setErrors({ ...confirmPasswordControl.errors, mismatch: true });
  } else {
    // Remove only the mismatch error, retain others (like required)
    const errors = { ...confirmPasswordControl.errors };
    delete errors['mismatch'];
    confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
  }

  return null;
};
