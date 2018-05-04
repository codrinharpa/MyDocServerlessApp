import { Component, OnInit } from '@angular/core';
import { LoggedInCallback } from '../service/cognito.service';
import { UserLoginService } from '../service/user-login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, LoggedInCallback{

  constructor(public userService:UserLoginService) { }

  ngOnInit() {
    this.userService.isAuthenticated(this);
  }
  isLoggedIn(message: string, isLoggedIn: boolean){
    if (isLoggedIn) {
      console.log('Already logged in')
    }
  }

}
