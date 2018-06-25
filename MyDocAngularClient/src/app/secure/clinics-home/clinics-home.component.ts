import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clinics-home',
  templateUrl: './clinics-home.component.html',
  styleUrls: ['./clinics-home.component.scss']
})
export class ClinicsHomeComponent implements OnInit {
  feature:string = "clinics";
  constructor() { 
    localStorage.setItem('doctorEmail','');
  }

  ngOnInit() {
  }

}
