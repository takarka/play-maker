import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    
    // constructor(private router: Router) {}

    // ngOnInit() {}

    // onLogin() {
    //     localStorage.setItem('isLoggedin', 'true');
    //     this.router.navigate(['/dashboard']);
    // }

    loginForm: FormGroup;

    constructor(private authService: AuthService) {}
  
    ngOnInit() {
      this.loginForm = new FormGroup({
        email: new FormControl('', {
          validators: [Validators.required, Validators.email]
        }),
        password: new FormControl('', { validators: [Validators.required] })
      });
    }
  
    onLogin() {
      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      });
    }
}
