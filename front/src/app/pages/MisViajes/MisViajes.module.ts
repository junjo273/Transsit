import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MisViajesPage } from './MisViajes.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MisViajesPageRoutingModule } from './MisViajes-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MisViajesPageRoutingModule,
  ],
  declarations: [MisViajesPage]
})
export class MisViajesPageModule {}
