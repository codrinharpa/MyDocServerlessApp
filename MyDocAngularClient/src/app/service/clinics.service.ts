import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { environment } from "../../environments/environment";
import { RegistrationDoctor } from "../auth/register-doctor/register-doctor.component";
import { RegistrationUser } from '../auth/register/register.component';

const endpoint = environment.clinicsServiceEndpoint;
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type':'application/json'
  })
};
@Injectable()
export class ClinicsService {

  constructor(private httpClient: HttpClient) {}
 
    // Uses http.get() to load data from a single API endpoint
    register(clinic: RegistrationUser){
      let body = JSON.stringify(clinic);
      let route = '/register';
      return this.httpClient.post(endpoint + route, body);
    }

    createDoctor(doctor: RegistrationDoctor) {
        let body = JSON.stringify(doctor);
        let route = '/createDoctor';
        this.httpClient.post(endpoint + route, body)
          .subscribe(
            (data:any) => {
              console.log(data);
            }
          )
    }

}
