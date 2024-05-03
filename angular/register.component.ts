import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    email: '',
    username: '',
    password: ''
  };

  constructor(private router: Router) { }

  signup(): void {
    if (this.user.email.trim() === "" || this.user.username.trim() === "" || this.user.password.trim() === "") {
      alert("Fill in all the details");
    } else {
      localStorage.setItem('email', this.user.email);
      localStorage.setItem('username', this.user.username);
      localStorage.setItem('password', this.user.password);
      console.log("Registered");
      this.router.navigate(['/profile']);
      alert("Registration successful. Please login to continue.");
    }
  }

}
