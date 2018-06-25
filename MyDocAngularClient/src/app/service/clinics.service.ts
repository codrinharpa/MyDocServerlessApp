import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { environment } from "../../environments/environment";
import { RegistrationDoctor } from "../auth/register-doctor/register-doctor.component";
import { RegistrationUser } from '../auth/register/register.component';
import { UserLoginService } from './user-login.service';
import { CognitoUtil, Callback } from './cognito.service';
import { UpdateUser } from '../auth/update/update.component';

const endpoint = environment.clinicsServiceEndpoint;
@Injectable()
export class ClinicsService {
    token: string;
    httpOptions:any;
    constructor(public cognitoUtil:CognitoUtil,private httpClient: HttpClient) {
        let vm = this;
        var currentUser = null;
        var tryAgain = true;
        while(tryAgain){
            tryAgain = false;
            currentUser = this.cognitoUtil.getCurrentUser();
            console.log("in clinics service",currentUser)
            if(currentUser) {
                currentUser.getSession(function(err,session){
                    if(err){
                        console.log(err);
                        vm.token = null;
                        tryAgain = true;
                        return;
                    }
                    vm.token = session.getIdToken().getJwtToken();
                    vm.httpOptions = {
                        headers: new HttpHeaders({
                            'Content-Type':  'application/json',
                            'Authorization': vm.token
                        })
                    };
                    console.log('initialized clinics service');
                    console.log(vm.httpOptions);
                });
            }
        }
    }

    // Uses http.get() to load data from a single API endpoint

    getClincsDetails(clinicsEmail:string){
        return this.httpClient.get(endpoint + '/' + clinicsEmail);
    }

    register(clinic: RegistrationUser){
        let body = JSON.stringify(clinic);
        let route = '/register';
        return this.httpClient.post(endpoint + route, body);
    }

    update(clinic: UpdateUser){
        let body = JSON.stringify(clinic);
        let route = '/update';
        return this.httpClient.post(endpoint + route, body);
    }


    createDoctor(doctor: RegistrationDoctor) {
        let body = JSON.stringify(doctor);
        let route = '/createDoctor/';
        return this.httpClient.post(endpoint + route, body, this.httpOptions);
    }
    getDoctors(){
        var route = "/getDoctors";
        console.log('doctors',this.httpOptions);
        return this.httpClient.get(endpoint + route, this.httpOptions);
    }

}
