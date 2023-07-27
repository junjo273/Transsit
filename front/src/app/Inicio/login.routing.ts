import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { registerPage } from './register/register.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
  { path: 'register',
    children: [
      { path: '', component: registerPage},
    ]
  },
  {path: '**' ,redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
