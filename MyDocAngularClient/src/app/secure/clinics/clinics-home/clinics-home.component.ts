import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../../../service/user-login.service';
import { LoggedInCallback } from '../../../service/cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clinics-home',
  templateUrl: './clinics-home.component.html',
  styleUrls: ['./clinics-home.component.scss']
})
export class ClinicsHomeComponent implements OnInit,LoggedInCallback {

  constructor(public userService:UserLoginService,public router:Router) { 
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
