import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajePage } from './Viaje.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ViajePageRoutingModule } from './Viaje-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ViajePageRoutingModule
  ],
  declarations: [ViajePage]
})
export class ViajePageModule {}
