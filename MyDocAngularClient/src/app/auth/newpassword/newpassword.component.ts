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
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.scss']
})
export class NewpasswordComponent implements OnInit,CognitoCallback {

    registrationUser: NewPasswordUser;
    router: Router;
    errorMessage: string;

    constructor(public groupRedirect:GroupBasedRedirect,public userRegistration: UserRegistrationService, public userService: UserLoginService, router: Router) {
        this.router = router;
        this.onInit();
    }

    onInit() {
        this.registrationUser = new NewPasswordUser();
        this.errorMessage = null;
    }

    ngOnInit() {
        this.errorMessage = null;
    }

    onRegister() {
      console.log(this.userService);
      this.errorMessage = null;
      this.userRegistration.newPassword(this.registrationUser, this);
    }

    cognitoCallback(session,message: string, result: any) {
      if (message != null) { //error
          this.errorMessage = message;
          console.log("result: " + this.errorMessage);
      } else { //success
          //move to the next step
          console.log("redirecting");
          this.groupRedirect.redirect(session);
      }
    }

}
