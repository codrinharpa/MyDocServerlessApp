import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pacients',
  templateUrl: './pacients.component.html',
  styleUrls: ['./pacients.component.scss']
})
export class PacientsComponent implements OnInit {
    public pacientDetails:any;
    constructor() { }

    ngOnInit() {
    }
    setPacientDetails(pacientDetails){
        this.pacientDetails = pacientDetails;
    }

}
