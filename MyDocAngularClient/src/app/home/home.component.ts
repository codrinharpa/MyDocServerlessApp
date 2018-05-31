import { Component, OnInit, HostListener, Renderer, ElementRef } from '@angular/core';
import { LoggedInCallback } from '../service/cognito.service';
import { UserLoginService } from '../service/user-login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, LoggedInCallback{
  public successMessage:string;
  public showSuccessMessage:boolean;
  public navOpened:boolean;
  @HostListener('window:scroll', ['$event'])
    checkScroll() {
      if(window.pageYOffset > 200){
        this.el.nativeElement.querySelector('.navbar').classList.add('navbar-fixed');
      }
      else{
        this.el.nativeElement.querySelector('.navbar').classList.remove('navbar-fixed');
      }


    }
  constructor(public el: ElementRef,public userService:UserLoginService) { 
    this.navOpened = false;
  }
 
  toggleNavOpened(){
    this.navOpened = !this.navOpened;
    console.log(this.navOpened);
  }
  ngOnInit() {
    this.userService.isAuthenticated(this);
  }
  setSuccessMessage(successMessage){
    this.successMessage = successMessage;
    this.showSuccessMessage = true;
  }
  clearSuccessMessage(){
    this.successMessage = "";
    this.showSuccessMessage = false;
  }
  isLoggedIn(message: string, isLoggedIn: boolean){
    if (isLoggedIn) {
      console.log('Already logged in')
    }
  }

}
