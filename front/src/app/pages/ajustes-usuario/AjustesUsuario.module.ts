import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AjustesUsuarioPage } from './AjustesUsuario.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AjustesUsuarioPageRoutingModule } from './AjustesUsuario-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AjustesUsuarioPageRoutingModule
  ],
  declarations: [AjustesUsuarioPage]
})
export class AjustesUsuarioPageModule {}
