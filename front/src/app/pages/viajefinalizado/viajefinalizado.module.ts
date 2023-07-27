import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajefinalizadoPageRoutingModule } from './viajefinalizado-routing.module';

import { ViajefinalizadoPage } from './viajefinalizado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajefinalizadoPageRoutingModule
  ],
  declarations: [ViajefinalizadoPage]
})
export class ViajefinalizadoPageModule {}
