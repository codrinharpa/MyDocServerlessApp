import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent} from './auth/register/register.component'
import { LoginComponent } from './auth/login/login.component'
import { ConfirmRegistrationComponent} from './auth/confirm-registration/confirm-registration.component'
import { HomeComponent} from './home/home.component'
import { ClinicSecurehomeComponent } from './clinic/secure/clinicsecurehome/clinicsecurehome.component';
import { LogoutComponent } from './auth/logout/logout.component';

const routes: Routes = [
  {path: "",redirectTo: "home",pathMatch: 'full'},
  {
    path:"home",
    component: HomeComponent,
    children: [
      {path:"register",component: RegisterComponent},
      {path:"login",component: LoginComponent},
      {path:'confirmRegistration/:username',component: ConfirmRegistrationComponent},
      {path:'logout',component: LogoutComponent}
    ]
  },
  {
    path:"securehome",
    component: ClinicSecurehomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
