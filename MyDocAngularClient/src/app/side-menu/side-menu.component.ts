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
  public activeDoctor:string = null;
  @Input() feature;
  constructor(public cognitoUtil:CognitoUtil,public clinicService: ClinicsService) {
   }
  isClinicFeature(){
    return this.feature === 'clinics';
  }
  ngOnInit() {

  }

}
