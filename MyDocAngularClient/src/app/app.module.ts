import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from "@angular/http";
import {UserRegistrationService} from "./service/user-registration.service";
// import {UserParametersService} from "./service/user-parameters.service";
import {UserLoginService} from "./service/user-login.service";
import {CognitoUtil} from "./service/cognito.service";
// import {routing} from "./app.routes";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ClinicSecurehomeComponent } from './clinic/secure/clinicsecurehome/clinicsecurehome.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './auth/register/register.component';
import { ConfirmRegistrationComponent } from './auth/confirm-registration/confirm-registration.component';
import { NewpasswordComponent } from './auth/newpassword/newpassword.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AgmCoreModule,MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { MapComponent } from './map/map.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    RegisterComponent,
    NewpasswordComponent,
    NavbarComponent,
    MapComponent,
    ConfirmRegistrationComponent,
    ClinicSecurehomeComponent,
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDMTXagwBKP_WjEBQQRPHXT5YhA9MOyEm8",
      libraries: ["places"]
    }),
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CognitoUtil,
    UserRegistrationService,
    UserLoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
