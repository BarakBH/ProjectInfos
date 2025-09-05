import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  apiError = '';

  constructor( private fb: FormBuilder, private auth: AuthService, private router: Router, private sharedService: SharedService) { }


  ngOnInit() {
  // this.loading = true;           
  }

  // Reactive form with validations
  // - Email must valid and in english
  // - Password min 8 chars, must includ uppercase + digit, and in english
  form = this.fb.group({
    email: [ '', [ Validators.required, Validators.email, this.validateEnglishOnly ],
    ],

    password: ['', [ Validators.required, Validators.minLength(8), this.validateDigitAndCapital, this.validateEnglishOnly ], 
    ],
  });

  //getters for my form inputs
  get email() { 
    return this.form.get('email')!; 
  }

  get password() { 
    return this.form.get('password')!; 
  }


  // password must include at least one uppercase letter and one digit
 validateDigitAndCapital(ctrl: AbstractControl): ValidationErrors | null {
  const v = String(ctrl.value || '');
  const hasUpper = /[A-Z]/.test(v); // pattern for capital letters
  const hasDigit = /\d/.test(v); // pattern for digits 
  return hasUpper && hasDigit ? null : { weak: true };
}

// --- Ensure ASCII only (English letters/symbols), as per spec - took example from one of my work projects
 validateEnglishOnly(ctrl: AbstractControl): ValidationErrors | null {
  const v = String(ctrl.value || '');
  // allow printable ASCII only
  return /^[\x20-\x7E]*$/.test(v) ? null : { nonAscii: true };
}

  onSubmit() {
    this.apiError = '';
    if (this.form.invalid) return;

    this.loading = true;  // show spinner

    const { email, password } = this.form.value as { email: string; password: string };

    // Call AuthService 
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false; // hide spinner
        this.router.navigate(['/info']); // After login, go to /info
      },
      error: (err) => {
        this.loading = false; // hide spinner
        this.apiError = err?.message || 'Login failed...';
      },
    });
  }
}
