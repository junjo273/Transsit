import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'MisViajes',
        loadChildren: () => import('../MisViajes/MisViajes.module').then(m => m.MisViajesPageModule)
      },
      {
        path: 'Home',
        loadChildren: () => import('../Home/Home.module').then(m => m.HomePageModule)
      },
      {
        path: 'viaje',
        loadChildren: () => import('../Viaje/Viaje.module').then(m => m.ViajePageModule)
      },
      {
        path: 'viajefinalizado',
        loadChildren: () => import('../viajefinalizado/viajefinalizado.module').then(m => m.ViajefinalizadoPageModule)
      },
      {
        path: 'AjustesUsuario',
        loadChildren: () => import('../ajustes-usuario/AjustesUsuario.module').then(m => m.AjustesUsuarioPageModule)
      },
      {
        path: 'AjustesUsuario/cambiar-datos',
        loadChildren: () => import('../cambiar-datos/cambiar-datos.module').then(m => m.CambiarDatosPageModule)
      },
      {
        path: 'AjustesUsuario/cambiar-password',
        loadChildren: () => import('../cambiar-password/cambiar-password.module').then(m => m.CambiarPasswordPageModule)
      },
      {
        path: 'createviaje',
        loadChildren: () => import('../create-viaje/create-viaje.module').then(m => m.CreateViajePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/Home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/Home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
