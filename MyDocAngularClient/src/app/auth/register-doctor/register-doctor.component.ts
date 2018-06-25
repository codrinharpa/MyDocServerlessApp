import { Component, OnInit } from '@angular/core';
import { ClinicsService } from '../../service/clinics.service';
import { UserLoginService } from '../../service/user-login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from '../../service/utils.service';


export class RegistrationDoctor {
  firstname:string;
  surname:string;
  password: string;
  email: string;
  phone: string;
  specialization: string;
}

@Component({
  selector: 'app-register-doctor',
  templateUrl: './register-doctor.component.html',
  styleUrls: ['./register-doctor.component.scss']
})
export class RegisterDoctorComponent{

    registrationDoctor: RegistrationDoctor;
    router: Router;
    errorMessage: string;
    successMessage:string;
    registrationFormGroup: FormGroup;
    specializations: any;
    
    constructor(private formBuilder: FormBuilder,public clinicsService: ClinicsService,public utilsService: UtilsService, router: Router) {
            this.router = router;
            this.onInit();
        }
    onInit() {
        var clinicsDetails = JSON.parse(localStorage.getItem('clinicsDetails')).user;
        this.utilsService.getSpecializations(clinicsDetails.practiceType).subscribe( (data) =>{
            this.specializations = data['specializations'];
            console.log(this.specializations);
        });
        this.registrationDoctor = new RegistrationDoctor();
        this.errorMessage = null;
        this.registrationFormGroup = this.formBuilder.group({
            firstname: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', [Validators.required,Validators.email]],
            phone: ['', [Validators.required,Validators.pattern('(0[0-9]{9})')]],
            specialization: ['', Validators.required],
        });
    }

    onCreateDoctor() {
        this.errorMessage = null;
        this.successMessage = null;
        console.log(this.registrationDoctor);
        this.clinicsService.createDoctor(this.registrationDoctor).subscribe( (data:any) =>{
            console.log(data);
            if(data.message == 'Created'){
                this.successMessage = 'Doctorul a fost creeat cu succes';
            }
            else{
                this.errorMessage = 'A fost intampinata o eroare';
            }
        },(err)=>{
            this.errorMessage = 'A fost intampinata o eroare';
        });
    }

    get firstname() { return this.registrationFormGroup.get('firstname'); }

    get surname() { return this.registrationFormGroup.get('surname'); }

    get email() { return this.registrationFormGroup.get('email'); }

    get phone() { return this.registrationFormGroup.get('phone');}

    get specialization() { return this.registrationFormGroup.get('specialization');}

}
