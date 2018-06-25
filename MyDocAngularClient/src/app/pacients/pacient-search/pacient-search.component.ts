import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PacientsService } from '../../service/pacients.service';
import { CognitoUtil } from '../../service/cognito.service';
import { AppointmentService } from '../../service/appointment.service';

@Component({
  selector: 'app-pacient-search',
  templateUrl: './pacient-search.component.html',
  styleUrls: ['./pacient-search.component.scss']
})
export class PacientSearchComponent implements OnInit {
  public addPacientShown:boolean = false;
  public pacients = [];
  public searchResults = []; 
  @Output() pacientDetails = new EventEmitter<any>();
  constructor(public cognitoUtil: CognitoUtil,public pacientService: PacientsService, public appointmentService: AppointmentService) {}

    ngOnInit() {
        this.pacientService.getPacientsNames()
            .subscribe( (data) => {
                this.pacients = data['pacients'];
                console.log(this.pacients);
                this.searchResults = this.pacients;
                this.viewPacient(this.searchResults[0].phone);
            });
    }
  toggleAddPacient(isShown){
    this.addPacientShown = isShown;
  }
  onSearchChange(value){
    var results = [];
    if(value == ''){
        this.searchResults = this.pacients;
        return;
    }
    for ( var i = 0; i < this.pacients.length; i++) {
        if(this.pacients[i].phone.indexOf(value) == 0){
            results.push(this.pacients[i]);
        }
        var splitted = value.split(' ');
        if(splitted.length == 1){
            if(this.pacients[i].firstname.toUpperCase().indexOf(value.toUpperCase()) == 0){
                results.push(this.pacients[i]);
            }
            else if(this.pacients[i].surname.toUpperCase().indexOf(value.toUpperCase()) == 0){
                results.push(this.pacients[i]);
            }
        }
        else if (splitted.length == 2){
            if(this.pacients[i].firstname.toUpperCase().indexOf(splitted[0].toUpperCase()) == 0 
            && this.pacients[i].surname.toUpperCase().indexOf(splitted[1].toUpperCase()) == 0){
                results.push(this.pacients[i]);
            }
            else if(this.pacients[i].firstname.toUpperCase().indexOf(splitted[1].toUpperCase()) == 0 
            && this.pacients[i].surname.toUpperCase().indexOf(splitted[0].toUpperCase()) == 0){
                results.push(this.pacients[i]);
            }
        }
    }
    this.searchResults = results;
  }
  addNewPacientCreated(pacient){
      this.pacients.push(pacient)
      this.searchResults = this.pacients;
  }
  viewPacient(value){
    this.pacientService.getPacient(value)
        .subscribe( (data) => {
            this.pacientDetails.emit(data['pacient']);
        });
    this.appointmentService.getPacientAppointments(value)
        .subscribe( (data) => {
            console.log(data);
        });
  }

}
