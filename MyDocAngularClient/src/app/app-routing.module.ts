import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent} from './auth/register/register.component'
import { RegisterDoctorComponent} from './auth/register-doctor/register-doctor.component'
import { LoginComponent } from './auth/login/login.component'
import { ConfirmRegistrationComponent} from './auth/confirm-registration/confirm-registration.component'
import { HomeComponent} from './home/home.component'
import { SecureHomeComponent } from './secure/secure-home/secure-home.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { SecureAppointmentsComponent } from './secure/secure-appointments/secure-appointments.component';
import { NewPasswordUser, NewpasswordComponent } from './auth/newpassword/newpassword.component';
import { LoginChangeTemporaryComponent } from './auth/login-change-temporary/login-change-temporary.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UpdateComponent } from './auth/update/update.component';
import { AboutComponent } from './about/about.component';
import { PacientSearchComponent } from './pacients/pacient-search/pacient-search.component';
import { PacientsComponent } from './pacients/pacients.component';
import { CreatePacientComponent } from './pacients/create-pacient/create-pacient.component';
import { SettingsComponent } from './settings/settings.component';
import { ClinicsHomeComponent } from './secure/clinics-home/clinics-home.component';
import { DoctorsHomeComponent } from './secure/doctors-home/doctors-home.component';

const routes: Routes = [
  {path: "",redirectTo: "home",pathMatch: 'full'},
  {
    path:"home",
    component: HomeComponent,
  },
  {path:"about",component: AboutComponent},
  {path:"register",component: RegisterComponent},
  {path:"login",component: LoginComponent},
  {path:'confirmRegistration/:username',component: ConfirmRegistrationComponent},
  {path:'logout',component: LogoutComponent},
  {path:'newPassword',component: NewpasswordComponent},
  {path:'forgotPassword',component: ForgotPasswordComponent},
  {path:'changeTemporary',component: LoginChangeTemporaryComponent},
  {
    path:"clinics",
    component: ClinicsHomeComponent,
    children: [
        {path:"settings",component: SettingsComponent},
        {path:"updateClinic",component: UpdateComponent},
        {path:"createDoctor",component: RegisterDoctorComponent},
        {path:"appointments",component: SecureAppointmentsComponent},
        {path:"pacients",component: PacientsComponent},
        {path:"pacients/createPacient",component: CreatePacientComponent}
    ]
  },
  {
    path:"doctors",
    component: DoctorsHomeComponent,
    children: [
        {path:"updateClinic",component: UpdateComponent},
        {path:"appointments",component: SecureAppointmentsComponent},
        {path:"pacients",component: PacientsComponent},
        {path:"pacients/createPacient",component: CreatePacientComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
