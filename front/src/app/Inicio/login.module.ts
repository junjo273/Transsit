import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { LoginPage } from './login/login.page';
import { registerPage } from './register/register.page';


import { LoginRoutingModule } from './login.routing';


@NgModule({
  declarations: [
    LoginPage,
    registerPage,
  ],
  exports: [
    LoginPage,
    registerPage,

  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoginRoutingModule,
  ]
})

export class LoginModule { }
