import { environment } from "../../environments/environment";
import { Inject,Injectable } from '@angular/core';
import {CognitoCallback, CognitoUtil} from "./cognito.service";
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute} from "amazon-cognito-identity-js";
import {RegistrationUser} from "../auth/register/register.component";
import {NewPasswordUser} from "../auth/newpassword/newpassword.component";
import * as AWS from "aws-sdk/global";
import { ClinicsService } from "./clinics.service";
import { GroupBasedRedirect } from "./user-login.service";
import { UpdateUser } from "../auth/update/update.component";
import 'rxjs/add/operator/map'
@Injectable()
export class UserRegistrationService {
    constructor(public clinicsService: ClinicsService,public cognitoUtil:CognitoUtil,public groupRedirect:GroupBasedRedirect) {
    }

    register(user: RegistrationUser, callback: CognitoCallback): void {
        
        this.clinicsService.register(user).subscribe((data:any) => {
            console.log(data);
            callback.cognitoCallback(null, data.user);
        },(err:any)=>{
            console.log(err);
            callback.cognitoCallback(err.error.input.message, null);
        });

    }

    update(user: UpdateUser, callback: CognitoCallback): void {
        
        this.clinicsService.update(user).subscribe((data:any) => {
            console.log(data);
            callback.cognitoCallback(null, data.user);
        });

    }

    confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {

        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    resendCode(username: string, callback: CognitoCallback): void {
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }
    
    newPassword(newPasswordUser: NewPasswordUser, callback: CognitoCallback): void {
        console.log(newPasswordUser);
        // Get these details and call
        //cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        let authenticationData = {
            Username: newPasswordUser.username,
            Password: newPasswordUser.existingPassword,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
            Username: newPasswordUser.username,
            Pool: this.cognitoUtil.getUserPool()
        };

        console.log("UserLoginService: Params set...Authenticating the user");
        let cognitoUser = new CognitoUser(userData);
        console.log("UserLoginService: config is " + AWS.config);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.

                // the api doesn't accept this field back
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, requiredAttributes, {
                    onSuccess: function (result) {
                        callback.cognitoCallback(null, userAttributes);
                    },
                    onFailure: function (err) {
                        callback.cognitoCallback(err, null);
                    }
                });
            },
            onSuccess: function (result) {
                callback.cognitoCallback(null, result);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err, null);
            }
        });
    }
}
