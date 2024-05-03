import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    // Retrieve user details from local storage
    this.username = localStorage.getItem('username') || '';
    this.password = localStorage.getItem('password') || '';
  }

}
