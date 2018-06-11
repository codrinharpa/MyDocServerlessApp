import { Component, OnInit } from '@angular/core';
import { ClinicsService } from '../service/clinics.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
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
