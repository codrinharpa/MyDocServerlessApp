import { Component, OnInit } from '@angular/core';
import { ClinicsService } from '../../../service/clinics.service';

@Component({
  selector: 'app-clinics-menu',
  templateUrl: './clinics-menu.component.html',
  styleUrls: ['./clinics-menu.component.scss']
})
export class ClinicsMenuComponent implements OnInit {
  public showdoctorselect: boolean = false;
  public doctors:any[];
  constructor(public clinicService: ClinicsService) { }

  ngOnInit() {
    this.clinicService.getDoctors().subscribe( (data) =>{
      console.log(data);
  });

  }
  toggleDoctorSelect(){
    this.showdoctorselect = !this.showdoctorselect;
  }

}
