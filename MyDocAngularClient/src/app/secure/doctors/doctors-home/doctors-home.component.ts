import { Component, OnInit } from '@angular/core';
import { LoggedInCallback } from '../../../service/cognito.service';
import { UserLoginService, GroupBasedRedirect } from '../../../service/user-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctors-home',
  templateUrl: './doctors-home.component.html',
  styleUrls: ['./doctors-home.component.scss']
})
export class DoctorsHomeComponent implements OnInit,LoggedInCallback {

  constructor(public groupRedirect:GroupBasedRedirect,public userService:UserLoginService,public router:Router) { 
    this.userService.isAuthenticated(this);
  }

  ngOnInit() {
  }
  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

}
