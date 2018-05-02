import { Component, OnInit } from '@angular/core';
import { ClinicsService } from '../../service/clinics.service';


export class RegistrationDoctor {
  firstname:string;
  surname:string;
  password: string;
  email: string;
  phone: string;
  
}

@Component({
  selector: 'app-register-doctor',
  templateUrl: './register-doctor.component.html',
  styleUrls: ['./register-doctor.component.scss']
})
export class RegisterDoctorComponent implements OnInit {

  constructor(public service: ClinicsService) { }

  ngOnInit() {
  }
  onRegister(){
      var doctor:RegistrationDoctor = new RegistrationDoctor();
      doctor.password = "parolaparola";
      doctor.email = "andrei.harpa.ah@gmail.com";
      doctor.phone = "+40749230350";
      doctor.firstname = "Andrei";
      doctor.surname = "Harpa";
      this.service.createDoctor(doctor);
  }

}
