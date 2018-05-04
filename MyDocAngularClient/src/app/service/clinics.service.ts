import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { environment } from "../../environments/environment";
import { RegistrationDoctor } from "../auth/register-doctor/register-doctor.component";
import { RegistrationUser } from '../auth/register/register.component';
import { UserLoginService } from './user-login.service';
import { CognitoUtil, Callback } from './cognito.service';

const endpoint = environment.clinicsServiceEndpoint;
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type':'application/json'
  })
};
@Injectable()
export class ClinicsService {
  constructor(public cognitoUtil:CognitoUtil,private httpClient: HttpClient) {}
 
    // Uses http.get() to load data from a single API endpoint
    register(clinic: RegistrationUser){
      let body = JSON.stringify(clinic);
      let route = '/register';
      return this.httpClient.post(endpoint + route, body);
    }


    createDoctor(doctor: RegistrationDoctor) {
        let body = JSON.stringify(doctor);
        let route = '/createDoctor';
        let client = this.httpClient;
        this.cognitoUtil.getCurrentUser().getSession(function(err,session){
          if(err){

            return;
          }
          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': session.getIdToken().getJwtToken()
            })
          };
          client.post(endpoint + route, body, httpOptions)
          .subscribe(
            (data:any) => {
              console.log(data);
            }
          )
        });
    }

}
