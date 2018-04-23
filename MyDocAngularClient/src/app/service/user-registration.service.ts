import { Inject,Injectable } from '@angular/core';
import {CognitoCallback, CognitoUtil} from "./cognito.service";
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute} from "amazon-cognito-identity-js";
import {RegistrationUser} from "../auth/register/register.component";
import {NewPasswordUser} from "../auth/newpassword/newpassword.component";
import * as AWS from "aws-sdk/global";
import { environment } from '../../environments/environment';

@Injectable()
export class UserRegistrationService {

    constructor(@Inject(CognitoUtil) public cognitoUtil: CognitoUtil) {
        cognitoUtil.setPoolData(environment.clinicsPoolData);
    }

    register(user: RegistrationUser, callback: CognitoCallback): void {
        console.log("UserRegistrationService: user is " + user);

        let attributeList = [];

        let dataName = {
            Name: 'name',
            Value: user.name
        };
        let dataPhone = {
            Name: 'custom:phone',
            Value: user.phone
        };
        let dataPracticeType = {
            Name: 'custom:practiceType',
            Value: user.practiceType
        };
        let dataDescription = {
            Name: 'custom:description',
            Value: user.description
        };
        let dataAddress = {
            Name: 'custom:address',
            Value: user.address
        };
        attributeList.push(new CognitoUserAttribute(dataName));
        attributeList.push(new CognitoUserAttribute(dataPhone));
        attributeList.push(new CognitoUserAttribute(dataPracticeType));
        attributeList.push(new CognitoUserAttribute(dataDescription));
        attributeList.push(new CognitoUserAttribute(dataAddress));

        this.cognitoUtil.getUserPool().signUp(user.email, user.password, attributeList, null, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                console.log("UserRegistrationService: registered user is " + result);
                callback.cognitoCallback(null, result);
            }
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
