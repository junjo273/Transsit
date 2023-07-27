import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjustesUsuarioPage } from './AjustesUsuario.page';

const routes: Routes = [
  {
    path: '',
    component: AjustesUsuarioPage,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjustesUsuarioPageRoutingModule {}
