import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViajePage } from './Viaje.page';

const routes: Routes = [
  {
    path: '',
    component: ViajePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViajePageRoutingModule {}
