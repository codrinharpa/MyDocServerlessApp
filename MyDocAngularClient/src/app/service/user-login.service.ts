import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { CognitoCallback, CognitoUtil, LoggedInCallback } from "./cognito.service";
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import * as STS from "aws-sdk/clients/sts";
import { NewPasswordUser } from "../auth/login-change-temporary/login-change-temporary.component"
import { Router } from "@angular/router";
import { ClinicsService } from "./clinics.service";

@Injectable()
export class GroupBasedRedirect {
    constructor(public router:Router){

    }
    redirect(session: CognitoUserSession){
        var payload = session.getAccessToken()['payload']
        var groups = payload['cognito:groups'];
        console.log(payload);
        if( groups.includes('Clinics')){
            this.router.navigate(['/clinics']);
        }
        else if(groups.includes('Doctors')){
            this.router.navigate(['/doctors']);
        }
    }
}

@Injectable()
export class UserLoginService{
    loginDetails:NewPasswordUser;

    private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession, username) => {

        console.log("In authenticateUser onSuccess callback");
        AWS.config.credentials = this.cognitoUtil.buildCognitoCreds(session.getAccessToken().getJwtToken());
        console.log(this.cognitoUtil.buildCognitoCreds(session.getIdToken().getJwtToken()));
        // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
        // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
        // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
        // security credentials. The identity is then injected directly into the credentials object.
        // If the first SDK call we make wants to use our IdentityID, we have a
        // chicken and egg problem on our hands. We resolve this problem by "priming" the AWS SDK by calling a
        // very innocuous API call that forces this behavior.
        let clientParams: any = {};
        if (environment.sts_endpoint) {
            clientParams.endpoint = environment.sts_endpoint;
        }
        let sts = new STS(clientParams);
        sts.getCallerIdentity(function (err, data) {
            console.log("UserLoginService: Successfully set the AWS credentials");
            callback.cognitoCallback(null, session);
        });
        this.clinicsService.getClincsDetails(session.getIdToken()['payload'].email)
            .subscribe( (data) => {
                console.log(data);
                localStorage.setItem('clinicsDetails', JSON.stringify(data));
                console.log(localStorage.getItem('clinicsDetails'));
            });
        console.log(session.getIdToken().getJwtToken());
        localStorage.setItem('username',username);
        this.groupRedirect.redirect(session);
    }

    private onLoginError = (callback: CognitoCallback, err) => {
        callback.cognitoCallback(err.message, null);
    }

    constructor(public groupRedirect:GroupBasedRedirect,
        public router: Router, public cognitoUtil: CognitoUtil, 
        public clinicsService: ClinicsService) {

        console.log(cognitoUtil._POOL_DATA);
    }

    authenticate(username: string, password: string, callback: CognitoCallback) {
        console.log("UserLoginService: starting the authentication");

        let authenticationData = {
            Username: username,
            Password: password,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        console.log("UserLoginService: Params set...Authenticating the user");
        let cognitoUser = new CognitoUser(userData);
        console.log("UserLoginService: config is " + AWS.config);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                this.loginDetails = {
                    username: authenticationDetails.getUsername(),
                    existingPassword: authenticationDetails.getPassword(),
                    password: null
                }
                this.router.navigate(['changeTemporary']);
                callback.cognitoCallback('User needs to set password.', null)
            },
            onSuccess: result => this.onLoginSuccess(callback, result, authenticationData.Username),
            onFailure: err => this.onLoginError(callback, err),
            mfaRequired: (challengeName, challengeParameters) => {
                callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
                    cognitoUser.sendMFACode(confirmationCode, {
                        onSuccess: result => this.onLoginSuccess(callback, result,authenticationData.Username),
                        onFailure: err => this.onLoginError(callback, err)
                    });
                });
            }
        });
    }

    forgotPassword(username: string, callback) {
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function () {

            },
            onFailure: function (err) {
                callback(err.message, null);
            },
            inputVerificationCode() {
                callback(null, null);
            }
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback) {
        let userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: function () {
                callback(null, null);
            },
            onFailure: function (err) {
                callback(err.message, null);
            }
        });
    }

    logout() {
        console.log("UserLoginService: Logging out");
        this.cognitoUtil.getCurrentUser().signOut();
    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null)
            throw("UserLoginService: Callback in isAuthenticated() cannot be null");

        let cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
                    callback.isLoggedIn(err, false);
                }
                else {
                    console.log("UserLoginService: Session is " + session.isValid());
                    this.groupRedirect.redirect(session);
                    callback.isLoggedIn(err, session.isValid());
                    
                }
            }.bind(this));
        } else {
            console.log("UserLoginService: can't retrieve the current user");
            callback.isLoggedIn("Can't retrieve the CurrentUser", false);
        }
    }
}
