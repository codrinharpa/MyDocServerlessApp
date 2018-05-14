import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRegistrationService } from '../../service/user-registration.service';
import { Router } from '@angular/router';
import { CognitoUtil } from '../../service/cognito.service';

export class UpdateUser{
  name: string;
  phone: string;
  practiceType:string;
  city:string;
  latitude:string;
  longitude:string;
  description:string;
}
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent{

    updateUser: UpdateUser;
    router: Router;
    errorMessage: string;
    updateFormGroup: FormGroup;
    
    constructor(public cognitoUtil:CognitoUtil,private formBuilder: FormBuilder,public userRegistration: UserRegistrationService, router: Router) {
            this.router = router;
            this.onInit();
        }
    onInit() {
        this.updateUser = new UpdateUser();
        var update = this.updateUser;
        this.cognitoUtil.getCurrentUser().getSession(function(err,session){
          update = session;
          console.log(update)
        });
        this.errorMessage = null;
        this.updateFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            phone: ['', [Validators.required,Validators.pattern('(0[0-9]{9})')]],
            practiceType: ['', Validators.required],
            description: ['', Validators.required],
            city: ['', Validators.required]
        });
    }
    receiveLatLng(event){
        this.updateUser.latitude = event.latitude.toString();
        this.updateUser.longitude = event.longitude.toString();
        console.log(this.updateUser);
    }

    onUpdate() {
        this.errorMessage = null;
        console.log(this.updateUser);
        this.userRegistration.update(this.updateUser, this);
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

    get name() { return this.updateFormGroup.get('name'); }

    get email() { return this.updateFormGroup.get('email'); }

    get phone() { return this.updateFormGroup.get('phone');}

    get city() { return this.updateFormGroup.get('city');}



}
