import { Component, OnInit } from '@angular/core';
import { LoggedInCallback } from '../service/cognito.service';
import { UserLoginService } from '../service/user-login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, LoggedInCallback{
  public successMessage:string;
  public showSuccessMessage:boolean;
  constructor(public userService:UserLoginService) { }

  ngOnInit() {
    this.userService.isAuthenticated(this);
  }
  setSuccessMessage(successMessage){
    this.successMessage = successMessage;
    this.showSuccessMessage = true;
  }
  clearSuccessMessage(){
    this.successMessage = "";
    this.showSuccessMessage = false;
  }
  isLoggedIn(message: string, isLoggedIn: boolean){
    if (isLoggedIn) {
      console.log('Already logged in')
    }
  }

}
