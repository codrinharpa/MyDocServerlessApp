import { Component, OnInit } from '@angular/core';
import {LoggedInCallback} from "../../service/cognito.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserLoginService} from "../../service/user-login.service";
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements LoggedInCallback {

  constructor(public router: Router,
              public userService: UserLoginService) {
      this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
      if (isLoggedIn) {
          this.userService.logout();
          // this.router.navigate(['/home']);
      }

    //ijo9h6y  this.router.navigate(['/home']);
  }
}