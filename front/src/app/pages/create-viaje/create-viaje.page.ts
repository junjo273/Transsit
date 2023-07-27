import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from '../../../environments/environment';
import { ViajeService} from '../../services/viajes.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-viaje',
  templateUrl: './create-viaje.page.html',
  styleUrls: ['./create-viaje.page.scss'],
})
export class CreateViajePage implements OnInit {

  constructor(private http: HttpClient, private viajeService: ViajeService) {}

  solicitudViaje = {
    date: '',
    time: '',
    destination: '',
    lat_destination: 0,
    long_destination: 0,
    exit_point: '',
    lat_exit_point: 0,
    long_exit_point: 0,
    pasajeros: 1,
  }


  markeraqui1: any;
  markeraqui2: any;


  mostrarMensaje: boolean = false;
  errorMessage: string;
  succesMessage: string;

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


  ngOnInit() {
    this.initAutocomplete();
    
  }


  enviar(){
    if(this.markeraqui1 && this.markeraqui2){
      this.calculateAverageBounds(this.markeraqui1,this.markeraqui2);
    }else{
      this.alertError("Introduce la direccion de destino y de salida");
      return;
    }
    var inputElement = document.getElementById("pac-input") as HTMLInputElement;
    this.solicitudViaje.destination = inputElement.value;
    var inputElement2 = document.getElementById("pac-input2") as HTMLInputElement;
    this.solicitudViaje.exit_point = inputElement2.value;

      if(this.solicitudViaje.destination!='' && this.solicitudViaje.exit_point!='' && this.solicitudViaje.date!='' && this.solicitudViaje.time!=''){
        
        this.viajeService.crearViaje(this.solicitudViaje).subscribe( res => {
          
          this.solicitudViaje = {
            date: '',
            time: '',
            destination: '',
            lat_destination: 0,
            long_destination: 0,
            exit_point: '',
            lat_exit_point: 0,
            long_exit_point: 0,
            pasajeros: 1,
          }
          this.enviargoogle(res.solicitud);

        }, (err) => {
          console.log(err);
          this.alertError(err.error.msg);

        });
      }else{
        this.alertError("Rellene todos los campos");
        return;
      }
      
  }

  enviargoogle(solicitud:any){
    this.viajeService.google(solicitud).subscribe( data => {
      if(data.agregado){
        this.actualiizarSolicitudEstado(solicitud.uid)
      }else{
        this.alertSucces("Solicitud de viaje creada con exito");
      }
      

    }, (errror) => {
      console.log("error peticion");
      this.alertError(errror.error.msg);
    });
  }

  actualiizarSolicitudEstado(solicitudID:any){
    this.viajeService.actualizarSolicitud(solicitudID,"EN GRUPO").subscribe( data => {
      this.alertSucces("¡Viaje encontrado!");
    }, (errror) => {
      console.log("error peticion");
      this.alertError(errror.error.msg);
    });
  }


  guardarFechaSeleccionada(event: any) {
    const fechaSeleccionada = new Date(event.target.value);
    const fechaActual = new Date();
    const numeroFechaSeleccionada = transformarFechaANumero(fechaSeleccionada);
    const numeroFechaActual = transformarFechaANumero(fechaActual);
  
  
    if (numeroFechaSeleccionada < numeroFechaActual) {
      this.solicitudViaje.date = fechaActual.toISOString().split('T')[0];
    } else {
      // Fecha válida, asignar al modelo
      this.solicitudViaje.date = fechaSeleccionada.toISOString().split('T')[0];
    }
  
  }
  
  
  


  incrementarPasajeros() {
    if (this.solicitudViaje.pasajeros < 4) {
      this.solicitudViaje.pasajeros++;
    }
  }
  
  decrementarPasajeros() {
    if (this.solicitudViaje.pasajeros > 1) {
      this.solicitudViaje.pasajeros--;
    }
  }


  
  initAutocomplete() {
    const map = new google.maps.Map(document.getElementById("map") as HTMLDivElement, {
      center: { lat: 38.3451, lng: -0.4814 },
      zoom: 10,
      mapTypeId: "roadmap",
    });
  
    const markers: google.maps.Marker[] = [];
    let marker1: google.maps.LatLngBounds | null = null;
    let marker2: google.maps.LatLngBounds | null = null;
  
    function addMarker(place: google.maps.places.PlaceResult, searchBox: google.maps.places.SearchBox) {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
  
      const icon = {
        url: place.icon as string,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
  
      const marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
      });
  
      markers.push(marker);
  
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(marker.getPosition()!));

      if (searchBox === searchBox1) {
        marker1 = bounds;
      } else if (searchBox === searchBox2) {
        marker2 = bounds;
      }
      map.fitBounds(bounds);
      map.setZoom(15);
    }


  
    function clearMarkers() {
      markers.forEach((marker) => marker.setMap(null));
      markers.length = 0;
    }
  
    function searchBoxListener(searchBox: google.maps.places.SearchBox) {
      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces()!;

        if (places.length === 0) {
          return;
        }
  
        clearMarkers();
  
        places.forEach((place) => {
          addMarker(place, searchBox);
        });
      });
    }
  
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox1 = new google.maps.places.SearchBox(input);
    searchBoxListener(searchBox1);
  
    const input2 = document.getElementById("pac-input2") as HTMLInputElement;
    const searchBox2 = new google.maps.places.SearchBox(input2);
    searchBoxListener(searchBox2);
  
    map.addListener("bounds_changed", () => {
      searchBox1.setBounds(map.getBounds() as google.maps.LatLngBounds);
      searchBox2.setBounds(map.getBounds() as google.maps.LatLngBounds);
      if (marker1) {
        this.markeraqui1 = marker1;
      }
  
      if (marker2) {
        this.markeraqui2 = marker2;
      }
    });
  }
  

  calculateAverageBounds(salida: any, destino: any) {
  
  const haSum = (salida.Ha.lo + salida.Ha.hi) / 2;
  const vaSum = (salida.Va.lo + salida.Va.hi) / 2;

  const haSum2 = (destino.Ha.lo + destino.Ha.hi) / 2;
  const vaSum2 = (destino.Va.lo + destino.Va.hi) / 2;

  this.solicitudViaje.lat_destination = haSum;
  this.solicitudViaje.long_destination = vaSum;

  this.solicitudViaje.lat_exit_point = haSum2;
  this.solicitudViaje.long_exit_point = vaSum2;
  }

}




function transformarFechaANumero(fecha:Date) {
  const año = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;
  const día = fecha.getDate();

  // Combinar los componentes en un número de 8 dígitos (ejemplo: 20201228)
  const numeroFecha = año * 10000 + mes * 100 + día;

  return numeroFecha;
}
