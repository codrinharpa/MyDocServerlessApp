import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserLoginService, GroupBasedRedirect } from "../../service/user-login.service";
import { ChallengeParameters, CognitoCallback, LoggedInCallback } from "../../service/cognito.service";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { ClinicsService } from "../../service/clinics.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit{
    email: string;
    password: string;
    errorMessage: string;
    mfaStep = false;
    mfaData = {
        destination: '',
        callback: null
    };
    authType: string;

    constructor(public router: Router,public groupRedirect:GroupBasedRedirect,
                public userService: UserLoginService) {
        console.log("LoginComponent constructor");
        console.log(userService);
    }

    ngOnInit() {
        this.errorMessage = null;
        console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
        this.userService.isAuthenticated(this);
    }

    onLogin() {
        if (this.email == null || this.password == null) {
            this.errorMessage = "All fields are required";
            return;
        }
        this.errorMessage = null;
        this.userService.authenticate(this.email, this.password, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
            if (this.errorMessage === 'User is not confirmed.') {
                console.log("redirecting");
                this.router.navigate(['/home/confirmRegistration', this.email]);
            } else if (this.errorMessage === 'User needs to set password.') {
                console.log("redirecting to set new password");

            }
        } else { //success
            // this.ddb.writeLogEntry("login");
            console.log("Successfully authentificated "+ result);
        }
    }



    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            console.log('Already logged in')
        }
    }

}
