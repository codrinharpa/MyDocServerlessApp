import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { environment } from "../../environments/environment";
import { CreatePacientModel } from '../pacients/create-pacient/create-pacient.component';
import { CognitoUtil } from './cognito.service';
const endpoint = environment.pacientsServiceEndpoint;
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type':'application/json'
  })
};
@Injectable()
export class PacientsService {
    token: string;

    constructor(public cognitoUtil:CognitoUtil, private httpClient: HttpClient) { 
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

    createPacient(pacient: CreatePacientModel) {
        let body = JSON.stringify(pacient);
        let route = '/create';
        let client = this.httpClient;
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': this.token
            })
        };
        return this.httpClient.post(endpoint + route, body, httpOptions);
    }
    getPacientsNames(){
        let route = '/getPacientsNames';
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': this.token
            })
        };
        return this.httpClient.get(endpoint + route, httpOptions);
    }
    getPacient(phone){
        let route = '/getPacient/';
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': this.token
            })
        };
        return this.httpClient.get(endpoint + route + phone, httpOptions);
    }
    

}
