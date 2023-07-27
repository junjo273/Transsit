import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  constructor(private http: HttpClient) {}

  getViajes(): Observable<any> {
    const IDpersona = localStorage['uid']
    const url = `${environment.base_url}/api/viajes/${IDpersona}`; 
    return this.http.get(url, this.cabeceras);
  }

  getSolicitudes(): Observable<any> {
    const IDpersona = localStorage['uid']
    const url = `${environment.base_url}/api/solicitudesviajes/${IDpersona}`; 
    return this.http.get(url, this.cabeceras);
  }

  getViaje(uid:string): Observable<any> {
    const url = `${environment.base_url}/api/viajes/datos/${uid}`; 
    return this.http.get(url, this.cabeceras);
  }

  google(solicitud:any): Observable<any> {
    const url = `${environment.base_url}/api/viajes/google/google/`; 
    const data = {
      solicitud: solicitud,
      idUsuario: localStorage['uid'],
      nombre: localStorage['nombre'],
      email: localStorage['email'],
    }
    return this.http.post(url, data ,this.cabeceras);
  }

  actualizarSolicitud(uid:string, estado:string): Observable<any> {
    const url = `${environment.base_url}/api/solicitudesviajes/actualizar/${estado}/${uid}`; 
    return this.http.get(url, this.cabeceras);
  }

  confirmarViaje(uid:string, estado:string): Observable<any> {
    const url = `${environment.base_url}/api/viajes/confirmarviaje/${estado}/${uid}`; 
    return this.http.get(url, this.cabeceras);
  }

  crearViaje(viaje: any): Observable<any> {
    const url = `${environment.base_url}/api/solicitudesviajes`; 
    const fecha = viaje.date;
    const hora = viaje.time; 
    const fechaHoraCombinada = `${fecha}T${hora}`;
    viaje.date = fechaHoraCombinada;
    const data = {
      idUsuario: localStorage['uid'],
      nombre: localStorage['nombre'],
      email: localStorage['email'],
      fecha: viaje.date as Date,
      salida: viaje.exit_point,
      destino: viaje.destination,
      pasajeros: viaje.pasajeros,
      lat_destino: viaje.lat_destination,
      long_destino: viaje.long_destination,
      lat_salida: viaje.lat_exit_point,
      long_salida: viaje.long_exit_point,
    }
    return this.http.post(url, data, this.cabeceras);
  }

  quitarUsuario(uid: string){
    const url = `${environment.base_url}/api/viajes/borrarUsuario`;
    const data = {
      idUsuario: localStorage['uid'],
      uid: uid,
    }
    return this.http.post(url, data, this.cabeceras);
  }

  borrarSolicitud(solicitud:string){
    const uid = solicitud;
    const url = `${environment.base_url}/api/solicitudesviajes/${uid}`;
    return this.http.delete(url, this.cabeceras);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': localStorage.getItem('token') || ''
      }};
  }

}
