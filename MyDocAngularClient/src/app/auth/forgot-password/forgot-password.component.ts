import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public errorMessage:String;
  public mfaStep:boolean;
  showSuccessMessage:boolean;
  constructor() { }

  ngOnInit() {
  }

}
