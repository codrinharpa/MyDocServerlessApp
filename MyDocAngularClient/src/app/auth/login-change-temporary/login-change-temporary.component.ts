import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserRegistrationService} from "../../service/user-registration.service";
import {UserLoginService, GroupBasedRedirect} from "../../service/user-login.service";
import {CognitoCallback} from "../../service/cognito.service";

export class NewPasswordUser {
  username: string;
  existingPassword: string;
  password: string;
}
@Component({
  selector: 'app-login-change-temporary',
  templateUrl: './login-change-temporary.component.html',
  styleUrls: ['./login-change-temporary.component.scss']
})
export class LoginChangeTemporaryComponent implements OnInit {

  registrationUser: NewPasswordUser;
  router: Router;
  errorMessage: string;

  constructor(public groupRedirect:GroupBasedRedirect, public userRegistration: UserRegistrationService, public userService: UserLoginService, router: Router) {
      this.router = router;
      this.onInit();
  }

  onInit() {
      this.registrationUser = new NewPasswordUser();
      this.registrationUser = this.userService.loginDetails;
      this.errorMessage = null;
  }

  ngOnInit() {
      this.errorMessage = null;
  }

  onRegister() {
    this.errorMessage = null;
    this.userRegistration.newPassword(this.registrationUser, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
        this.errorMessage = message;
        console.log("result: " + this.errorMessage);
    } else { //success
      this.router.navigate(['/login']);
    }
  }


}