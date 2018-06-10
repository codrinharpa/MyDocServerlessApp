import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { environment } from "../../environments/environment";
import { RegistrationDoctor } from "../auth/register-doctor/register-doctor.component";
import { RegistrationUser } from '../auth/register/register.component';
import { UserLoginService } from './user-login.service';
import { CognitoUtil, Callback } from './cognito.service';
import { UpdateUser } from '../auth/update/update.component';

const endpoint = environment.clinicsServiceEndpoint;
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type':'application/json'
  })
};
@Injectable()
export class ClinicsService {
    token: string;
    constructor(public cognitoUtil:CognitoUtil,private httpClient: HttpClient) {
        let vm = this;
        this.cognitoUtil.getCurrentUser().getSession(function(err,session){
            if(err){
                console.log(err);
                vm.token = null;
                return;
            }
            vm.token = session.getIdToken().getJwtToken();
        });
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
        let route = '/createDoctor';
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': this.token
            })
        };
        return this.httpClient.post(endpoint + route, body, httpOptions);
    }
    getDoctors(){
        var route = "/getDoctors";
        let client = this.httpClient;
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': this.token
            })
        };
        return client.get(endpoint + route, httpOptions);
    }

}
