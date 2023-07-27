import { Component } from '@angular/core';
import { ViajeService } from '../../services/viajes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-MisViajes',
  templateUrl: 'MisViajes.page.html',
  styleUrls: ['MisViajes.page.scss']
})
export class MisViajesPage {
  selectedSegment: string = 'actuales';
  viajesActuales: any[] = [];
  solicitudesPendientes: any[] = [];
  viajesRealizados: any[] = [];


  mostrarMensaje: boolean = false;
  errorMessage: string;
  succesMessage: string;

  paginacargada=false;

  mostrarAlgo() {
    this.mostrarMensaje = true;
    setTimeout(() => {
      this.mostrarMensaje = false;
    }, 3 * 1000); // milisegundos* 
  }

  alertSucces(msg:string){
    this.succesMessage=msg;
    this.errorMessage = "";
    this.mostrarAlgo();
  }

  alertError(msg:string){
    this.succesMessage="";
    this.errorMessage = msg;
    this.mostrarAlgo();
  }

  constructor(private viajeService: ViajeService, private router: Router) {}
  
  ionViewDidEnter() {
    this.paginacargada = false;
    this.cargarViajes();
    this.cargarSolicitudes();

    this.verificarViajesActuales();
    this.verificarSolicitudesPendientes();
    this.verificarViajesRealizados();
    
    
  }

  navegar(viaje: string) {
    this.router.navigate(['/tabs/viaje'], { queryParams: { viaje: viaje }});
  }

  viajefianlizado(uid: string) {
    this.router.navigate(['/tabs/viajefinalizado'], { queryParams: { viaje: uid }});
  }

  cancelar(solicitud: string) {
    this.viajeService.borrarSolicitud(solicitud).subscribe(
      (response) => {
        this.cargarSolicitudes();
        this.alertSucces('Solicitud borrada correctamente');
        this.verificarSolicitudesPendientes();
      },
      (error) => {
        console.error(error);
        this.alertError('Se ha producido un error borrando la solicitud');
      }
    );
  }

  cargarViajes() {
    this.viajeService.getViajes().subscribe(
      (response) => {
        this.viajesActuales = [];
        this.viajesRealizados = [];
        for (let i = 0; i < response.solicitudesUsuario.length; i++) {
          const viaje = response.solicitudesUsuario[i];
          if (viaje.estado === 'BUSCANDO' || viaje.estado === 'LISTO') {
            this.viajesActuales.push(viaje);
          } else if (viaje.estado === 'FINALIZADO') {
            this.viajesRealizados.push(viaje);
          }
        }
        this.verificarViajesActuales();
        this.verificarViajesRealizados();
        this.paginacargada = true;
      },
      (error) => {
        console.error(error);
        this.alertError('Ha ocurido un error cargando los viajes');
      }
    );
  }

  cargarSolicitudes() {
    this.viajeService.getSolicitudes().subscribe(
      (response) => {
        this.solicitudesPendientes = [];
        for (let i = 0; i < response.solicitudesUsuario.length; i++) {
          const viaje = response.solicitudesUsuario[i];
          if (viaje.estado === 'BUSCANDO') {
            this.solicitudesPendientes.push(viaje);
          }
        }
        this.verificarSolicitudesPendientes();
        
      },
      (error) => {
        console.error(error);
        this.alertError('Ha ocurido un error cargando las solicitudes de viaje');
      }
    );
  }


  mostrarMensajeViajesActuales: boolean = false;
  mostrarMensajeSolicitudesPendientes: boolean = false;
  mostrarMensajeViajesRealizados: boolean = false;

  // Funciones para verificar si hay elementos en las listas
  verificarViajesActuales() {
    if(this.viajesActuales.length === 0){
      this.mostrarMensajeViajesActuales = true; 
    }else{
      this.mostrarMensajeViajesActuales = false; 
    }

  }

  verificarSolicitudesPendientes() {
    if(this.solicitudesPendientes.length === 0){
      this.mostrarMensajeSolicitudesPendientes = true; 
    }else{
      this.mostrarMensajeSolicitudesPendientes = false; 
    }
  }

  verificarViajesRealizados() {
    if(this.viajesRealizados.length === 0){
      this.mostrarMensajeViajesRealizados = true; 
    }else{
      this.mostrarMensajeViajesRealizados = false; 
    }
  }

}
