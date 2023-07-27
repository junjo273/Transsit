import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajefinalizadoPage } from './viajefinalizado.page';

const routes: Routes = [
  {
    path: '',
    component: ViajefinalizadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajefinalizadoPageRoutingModule {}
