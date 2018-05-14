import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {UserRegistrationService} from "./service/user-registration.service";
// import {UserParametersService} from "./service/user-parameters.service";
import {UserLoginService, GroupBasedRedirect} from "./service/user-login.service";
import {CognitoUtil} from "./service/cognito.service";
// import {routing} from "./app.routes";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ClinicsHomeComponent } from './secure/clinics/clinics-home/clinics-home.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './auth/register/register.component';
import { ConfirmRegistrationComponent } from './auth/confirm-registration/confirm-registration.component';
import { NewpasswordComponent } from './auth/newpassword/newpassword.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ClinicsNavbarComponent } from './secure/clinics/clinics-navbar/clinics-navbar.component';
import { AgmCoreModule,MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { MapComponent } from './map/map.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ClinicsAppointmentsComponent } from './secure/clinics/clinics-appointments/clinics-appointments.component';
import { RegisterDoctorComponent } from './auth/register-doctor/register-doctor.component';
import { ClinicsService } from './service/clinics.service';
import { LoginChangeTemporaryComponent } from './auth/login-change-temporary/login-change-temporary.component';
import { DoctorsHomeComponent } from './secure/doctors/doctors-home/doctors-home.component';
import { DoctorsNavbarComponent } from './secure/doctors/doctors-navbar/doctors-navbar.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UpdateComponent } from './auth/update/update.component'
import { ImageUploadModule } from "angular2-image-upload"
import { UtilsService } from './service/utils.service';
import { ClinicsMenuComponent } from './secure/clinics/clinics-menu/clinics-menu.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    RegisterComponent,
    NewpasswordComponent,
    NavbarComponent,
    ClinicsNavbarComponent,
    MapComponent,
    ConfirmRegistrationComponent,
    ClinicsHomeComponent,
    LoginComponent,
    LogoutComponent,
    ClinicsAppointmentsComponent,
    RegisterDoctorComponent,
    LoginChangeTemporaryComponent,
    DoctorsHomeComponent,
    DoctorsNavbarComponent,
    ForgotPasswordComponent,
    UpdateComponent,
    ClinicsMenuComponent
  ],
  imports: [
    ImageUploadModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDMTXagwBKP_WjEBQQRPHXT5YhA9MOyEm8",
       libraries: ["places"]
    }),
    HttpClientModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CognitoUtil,
    UserRegistrationService,
    UserLoginService,
    ClinicsService,
    GroupBasedRedirect,
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
