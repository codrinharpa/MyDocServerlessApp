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
import { SecureHomeComponent } from './secure/secure-home/secure-home.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './auth/register/register.component';
import { ConfirmRegistrationComponent } from './auth/confirm-registration/confirm-registration.component';
import { NewpasswordComponent } from './auth/newpassword/newpassword.component';
import { SecureNavbarComponent } from './secure/secure-navbar/secure-navbar.component';
import { AgmCoreModule,MapsAPILoader } from '@agm/core';
import {} from 'google-maps';
import { MapComponent } from './map/map.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { RegisterDoctorComponent } from './auth/register-doctor/register-doctor.component';
import { ClinicsService } from './service/clinics.service';
import { LoginChangeTemporaryComponent } from './auth/login-change-temporary/login-change-temporary.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { UpdateComponent } from './auth/update/update.component'
import { ImageUploadModule } from "angular2-image-upload"
import { UtilsService } from './service/utils.service';
import { SideMenuComponent } from '././side-menu/side-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollToModule } from 'ng2-scroll-to-el';
// import * as jQuery from 'jquery';
// import { AutoCompleteModule, ScheduleModule, DialogModule, CalendarModule, DropdownModule } from 'primeng/primeng';
import { CreatePacientComponent } from './pacients/create-pacient/create-pacient.component';
import { PacientSearchComponent } from './pacients/pacient-search/pacient-search.component';
import { PacientsComponent } from './pacients/pacients.component';
import { PacientsService } from './service/pacients.service';
import { SettingsComponent } from './settings/settings.component';
import { FullCalendarModule } from 'ng-fullcalendar';
import { AppointmentService } from './service/appointment.service';
import { ClinicsHomeComponent } from './secure/clinics-home/clinics-home.component';
import { DoctorsHomeComponent } from './secure/doctors-home/doctors-home.component';
// (window as any).jQuery = (window as any).$ = jQuery; // This is needed to resolve issue.

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    RegisterComponent,
    NewpasswordComponent,
    SecureNavbarComponent,
    MapComponent,
    ConfirmRegistrationComponent,
    SecureHomeComponent,
    LoginComponent,
    LogoutComponent,
    RegisterDoctorComponent,
    LoginChangeTemporaryComponent,
    ForgotPasswordComponent,
    UpdateComponent,
    SideMenuComponent,
    SchedulerComponent,
    CreatePacientComponent,
    PacientSearchComponent,
    PacientsComponent,
    SettingsComponent,
    ClinicsHomeComponent,
    DoctorsHomeComponent,
    ClinicsHomeComponent,
    DoctorsHomeComponent
  ],
  imports: [
    FullCalendarModule,
    BrowserAnimationsModule,
    ImageUploadModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDMTXagwBKP_WjEBQQRPHXT5YhA9MOyEm8",
       libraries: ["places"]
    }),
    ScrollToModule.forRoot(),
    HttpClientModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
        // ScheduleModule
  ],
  providers: [
    CognitoUtil,
    UserRegistrationService,
    UserLoginService,
    ClinicsService,
    GroupBasedRedirect,
    UtilsService,
    PacientsService,
    AppointmentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
