import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClinicsService } from '../service/clinics.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { CognitoUtil } from '../service/cognito.service';
import { map } from 'rxjs/operator/map';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  public showdoctorselect: boolean = false;
  public doctors:any[];
  public doctorsNames:any;
  public doctorsNamesToEmails:any;
  public activeDoctor:string = null;
  @Input() feature;
  @Output() changedActiveDoctor = new EventEmitter<Event>();
  constructor(public cognitoUtil:CognitoUtil,public clinicService: ClinicsService) {
    this.doctorsNamesToEmails = {};
   }
  isClinicFeature(){
    console.log(this.feature);
    return this.feature === 'clinics';
  }
  ngOnInit() {
    this.clinicService.getDoctors().subscribe( (data:any) =>{
      let mapping = {};
      data.doctors.forEach(function(doctor) {
        mapping[doctor['firstname'] + ' ' + doctor['surname'] ] = doctor.email;
      });
      this.doctorsNamesToEmails = mapping;
      this.doctorsNames = data.doctors.map(doctor => doctor.firstname + ' ' + doctor.surname);

  });

  }
  toggleDoctorSelect(){
    this.showdoctorselect = !this.showdoctorselect;
  }
  onActivateDoctor(doctorName){
    this.activeDoctor = doctorName;
    localStorage.setItem('doctorEmail', this.doctorsNamesToEmails[doctorName]);
    this.changedActiveDoctor.emit(this.doctorsNamesToEmails[doctorName]);
  }

}
