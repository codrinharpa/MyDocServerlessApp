import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctors-home',
  templateUrl: './doctors-home.component.html',
  styleUrls: ['./doctors-home.component.scss']
})
export class DoctorsHomeComponent implements OnInit {
  constructor() { 
    localStorage.setItem('doctorEmail',localStorage.getItem('username'));
  }

  ngOnInit() {
  }

}
