import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UserLoginService } from '../../service/user-login.service';
import { LoggedInCallback } from '../../service/cognito.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-secure-home',
  templateUrl: './secure-home.component.html',
  styleUrls: ['./secure-home.component.scss']
})
export class SecureHomeComponent implements OnInit,LoggedInCallback {
  public showSuccessMessage:Boolean;
  public successMessage:String;
  @ViewChild('scheduler') scheduler;
  @Input() feature:String;
  public doctorEmail:String;
  constructor(public userService:UserLoginService,public router:Router) { 
    this.userService.isAuthenticated(this);
    this.showSuccessMessage = false;
  }
  
  setSuccessMessage(successMessage){
    this.successMessage = successMessage;
    this.showSuccessMessage = true;
  }
  clearSuccessMessage(){
    this.successMessage = "";
    this.showSuccessMessage = false;
  }
  onChangedActiveDoctor(event){
    this.doctorEmail = event;
    console.log(this.scheduler);
    
  }

  ngOnInit() {
    console.log("home",this.feature);
  }
  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

}