import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserLoginService, GroupBasedRedirect } from "../../service/user-login.service";
import { ChallengeParameters, CognitoCallback, LoggedInCallback } from "../../service/cognito.service";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";

@Component({
  selector: 'app-register',
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
        console.log(this.authType);
        this.userService.authenticate(this.email, this.password, this);
    }

    cognitoCallback(session:CognitoUserSession, message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
            if (this.errorMessage === 'User is not confirmed.') {
                console.log("redirecting");
                this.router.navigate(['/home/confirmRegistration', this.email]);
            } else if (this.errorMessage === 'User needs to set password.') {
                console.log("redirecting to set new password");
                this.userService.loginDetails = {
                    username: this.email,
                    existingPassword:this.password,
                    password:""
                }
                this.router.navigate(['/home/changeTemporary']);
            }
        } else { //success
            // this.ddb.writeLogEntry("login");
            console.log(result);
            this.groupRedirect.redirect(session);
        }
    }



    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.router.navigate(['/securehome']);
        }
    }

}
