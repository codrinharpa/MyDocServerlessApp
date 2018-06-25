import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { CognitoUtil } from './cognito.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
const endpoint = environment.appointmentServiceEndpoint;
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type':'application/json'
  })
};
@Injectable()
export class AppointmentService {
  token: string;

  constructor(public cognitoUtil:CognitoUtil, private httpClient: HttpClient) { 
      let vm = this;
      let currentUser = this.cognitoUtil.getCurrentUser();
      if(currentUser){
          currentUser.getSession(function(err,session){
              if(err){
                  console.log(err);
                  vm.token = null;
                  return;
              }
              vm.token = session.getIdToken().getJwtToken();
          });
      }
  }
  getPacientAppointments(phone:string){
    var route = "/getPacientAppointments/";
    let httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.token
      })
    };
    return this.httpClient.get(endpoint + route + phone, httpOptions);
  }

  getAppointmentsInRange(doctorEMail,start,end){
    var route = "/getAppointmentsInRange/";
    var queryParams = "?doctorEmail=" + doctorEMail + "&start=" + start + "&end=" + end;
    let httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.token
      })
    };
    return this.httpClient.get(encodeURI(endpoint + route + queryParams), httpOptions);
  }

  createAppointment(appointment:any){
    var route = "/create/"
    let httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.token
      })
    };
    var body = JSON.stringify(appointment);
    return this.httpClient.post(endpoint + route, body, httpOptions);
  }

  updateAppointment(updateAppointment:any){
    var route = "/update/"
    let httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.token
      })
    };
    var body = JSON.stringify(updateAppointment);
    return this.httpClient.post(endpoint + route, body, httpOptions);
  }
  deleteAppointment(deleteAppointment:any){
    var route = "/delete/"
    let httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.token
      })
    };
    var body = JSON.stringify(deleteAppointment);
    return this.httpClient.post(endpoint + route, body, httpOptions);
  }

}
