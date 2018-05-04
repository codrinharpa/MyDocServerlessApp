import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserRegistrationService } from "../../service/user-registration.service";
import { CognitoCallback } from "../../service/cognito.service";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ElementRef,ViewChild } from '@angular/core';
import { RegistrationValidator } from '../../validators/register.validator';
import { GroupBasedRedirect } from '../../service/user-login.service';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
export class RegistrationUser {
    name: string;
    email: string;
    phone: string;
    password: string;
    practiceType:string;
    city:string;
    latitude:string;
    longitude:string;
    description:string;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements CognitoCallback {
    registrationUser: RegistrationUser;
    router: Router;
    errorMessage: string;
    registrationFormGroup: FormGroup;
    passwordFormGroup: FormGroup;
    
    constructor(private groupRedirect:GroupBasedRedirect,private formBuilder: FormBuilder,public userRegistration: UserRegistrationService, router: Router) {
            this.router = router;
            this.onInit();
        }
    onInit() {
        this.registrationUser = new RegistrationUser();
        this.errorMessage = null;

        this.passwordFormGroup = this.formBuilder.group({
        password: ['', [Validators.required,Validators.minLength(8)]],
        passwordConfirmation: ['', Validators.required]
        }, {
        validator: RegistrationValidator.validate.bind(this)
        });
        this.registrationFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            phone: ['', [Validators.required,Validators.pattern('(0[0-9]{9})')]],
            practiceType: ['', Validators.required],
            city: ['', Validators.required],
            description: ['', Validators.required],
            email: ['', [Validators.required,Validators.email]],
            passwordFormGroup: this.passwordFormGroup
        });
    }
    receiveLatLng(event){
        this.registrationUser.latitude = event.latitude.toString();
        this.registrationUser.longitude = event.longitude.toString();
        console.log(this.registrationUser);
    }

    onRegister() {
        this.errorMessage = null;
        console.log(this.registrationUser);
        this.userRegistration.register(this.registrationUser, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
        } else { //success
            //move to the next step
            console.log("redirecting");
            this.router.navigate(['home/confirmRegistration', result.user.username]);
        }
    }

    get name() { return this.registrationFormGroup.get('name'); }

    get email() { return this.registrationFormGroup.get('email'); }

    get phone() { return this.registrationFormGroup.get('phone');}

    get city() { return this.registrationFormGroup.get('city');}

    get password() { return this.passwordFormGroup.get('password'); }

    get passwordConfirmation() { return this.passwordFormGroup.get('passwordConfirmation'); }

}


