// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {
  

// }
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user = {
    username: '',
    password: ''
  };

  constructor(private router: Router) { }

  login(): void {
    if (this.user.username.trim() === "" || this.user.password.trim() === "") {
      alert("Fill in the details");
    } else {
      localStorage.setItem('username', this.user.username);
      localStorage.setItem('password', this.user.password);
      console.log("Entered");
      this.router.navigate(['/profile']);
      alert("Successfully Logged in");
    }
  }


}
