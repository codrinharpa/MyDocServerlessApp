import { Component, OnInit,OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserRegistrationService} from "../../service/user-registration.service";
import {UserLoginService, GroupBasedRedirect} from "../../service/user-login.service";
import {LoggedInCallback} from "../../service/cognito.service";
import { CognitoUserSession } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent implements OnInit {

  confirmationCode: string;
    email: string;
    errorMessage: string;
    private sub: any;

    constructor(public groupRedirect:GroupBasedRedirect,public regService: UserRegistrationService, public router: Router, public route: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['username'];

        });

        this.errorMessage = null;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onConfirmRegistration() {
        this.errorMessage = null;
        this.regService.confirmRegistration(this.email, this.confirmationCode, this);
    }

    cognitoCallback(session:CognitoUserSession, message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("message: " + this.errorMessage);
        } else { //success
            //move to the next step
            console.log("Moving to securehome");
            this.groupRedirect.redirect(session);
        }
    }

}







