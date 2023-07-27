import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateViajePage } from './create-viaje.page';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: CreateViajePage
  }
];

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [HttpClient],
  bootstrap: [CreateViajePage],
})
export class CreateViajePageRoutingModule {}
