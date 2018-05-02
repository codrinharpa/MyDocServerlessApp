import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { environment } from "../../environments/environment";
import { RegistrationDoctor } from "../auth/register-doctor/register-doctor.component";

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
