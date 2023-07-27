import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TalkService } from '../../services/talk.service';
import Talk from 'talkjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ViajeService } from '../../services/viajes.service';
import { UsuarioService } from '../../services/usuario.service';

export interface Punto {
  latitud: number;
  longitud: number;
}

@Component({
  selector: 'app-Viaje',
  templateUrl: 'Viaje.page.html',
  styleUrls: ['Viaje.page.scss']
})
export class ViajePage implements OnInit{

  private inicida = false;
  private viaje: any
  private usuarios: any
  private uid: any
  titulo: string
  fecha: string
  chat: boolean
  map: boolean
  check: boolean
  info: boolean
  infowindow: boolean
  @ViewChild('talkjsContainer') talkjsContainer!: ElementRef;

  private salida:Punto
  private destino:Punto
  private waypoints:any
  datos_usuarios: any


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

  constructor(private talkService: TalkService, private router: Router, private route: ActivatedRoute, private viajeService: ViajeService, private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.uid = params['viaje'];
      if(this.uid==""){
        this.router.navigateByUrl('/tabs/tabs1');
      }
      this.cargarViaje(this.uid);
    });
    this.chat=true;
    this.infowindow=false;
    this.map=false;

  }

  cargarViaje(uid:string) {
    this.viajeService.getViaje(this.uid).subscribe(
      (response) => {
        if (response.solicitudes.uid === uid) {
          this.viaje = response.solicitudes;
          this.usuarios= this.viaje.usuarios;
          this.uid= this.viaje.uid;
          this.titulo = this.viaje.destino;
          this.fecha = this.viaje.fechaComienzo;
          this.createInboxChat();
          if(this.viaje.estado=="LISTO"){
            this.info = true;
          }else{
            this.info = false;
          }
          this.encontrarPuntosMasAlejados();
          this.datosUsuarios();
          this.inicida = true;
        }
        for (const usu of this.usuarios){
          if (usu.id == localStorage['uid']){
            if (usu.estado == 'CONFIRMADO'){
              this.check = true;
            }else{
              this.check = false;
            }
          }
        }
        


      },
      (error) => {
        console.error(error); 
        this.alertError(error.error.msg);
      }
    );
  }

  back(){
    this.router.navigate(['tabs/MisViajes']); 
  }

  ionViewDidEnter() {
    if(this.inicida){
      this.encontrarPuntosMasAlejados();
    }
  }


  confirmarviaje(){
    var estado;
    if (this.check == true){
      this.check = false;
      estado = "ESPERA";
    }else{
      this.check = true;
      estado = "CONFIRMADO";
    }
    this.viajeService.confirmarViaje(this.viaje.uid, estado).subscribe(
        (response) => {
          this.info = response.listo;
          if(this.check){
            if (this.info){
              this.alertSucces("Viaje listo");
            }else{
              this.alertSucces("Confimado");
            }
          }else {
            this.alertSucces("Confirmación cancelada");
          }

        },
        (error) => {
          console.error(error); 
          this.alertError(error.error.msg);
        }
    );

  }

  cambiarVentana(ventata:string){
    switch (ventata) {
      case 'chat':
        this.chat =true;
        this.map = false;
        this.infowindow =false;
        (document.querySelector('.chat') as HTMLElement).classList.remove('d-none');
        (document.querySelector('.map') as HTMLElement).classList.add('d-none');
        (document.querySelector('.info') as HTMLElement).classList.add('d-none');
        break;
      case 'map':
        this.chat =false;
        this.map = true;
        this.infowindow =false;
        (document.querySelector('.chat') as HTMLElement).classList.add('d-none');
        (document.querySelector('.map') as HTMLElement).classList.remove('d-none');
        (document.querySelector('.info') as HTMLElement).classList.add('d-none');
        break;
      case 'info':
        this.infowindow =true;
        (document.querySelector('.chat') as HTMLElement).classList.add('d-none');
        (document.querySelector('.map') as HTMLElement).classList.add('d-none');
        (document.querySelector('.info') as HTMLElement).classList.remove('d-none');
        break;
      default:
        console.log('Opción inválida');
        break;
    }
    //this.createInboxChat();
  }

  private async createInboxChat() {
    await this.talkService.getOrCreateConversationChat(this.uid);
  }

  async salirGrupo(){
    await this.talkService.salirGrupo(this.uid);
    var solicitud;
    for (const usuario of this.viaje.usuarios ){
      if (localStorage['uid'] == usuario.id){
        solicitud = usuario.solicitud;
      }
    }
    this.viajeService.borrarSolicitud(solicitud).subscribe(
      (response) => {

      },
      (error) => {
        console.error(error); 
      }
    );
    
    this.router.navigateByUrl('/tabs/tabs1');

  }






  datosUsuarios(){
    const datos: { datos: any; expanded: boolean }[] = [];
    for (const usuario of this.usuarios){
      
      this.usuarioService.cargarUsuariosViaje( usuario.id, this.viaje.uid)
      .subscribe( res => {
        const a = (res as any).usuarios;
        const usu = {
          datos: a,
          expanded: false,
        };
        if (usu.datos.uid != localStorage['uid']){
          datos.push(usu);
        }
        
      },(error) => {
        console.error(error);
      });
    }
    this.datos_usuarios = datos;
    
  }




  toggleUserDetails(usuario: any): void {
    usuario.expanded = !usuario.expanded;
  }












  ////MAPS

  llenarPuntos(){
    let puntos=[];
    for (const viaje of this.viaje.usuarios){
      let punto = { latitud: viaje.lat_destino, longitud: viaje.long_destino };
      let punto2 = { latitud: viaje.lat_salida, longitud: viaje.long_salida };
      puntos.push( punto );
      puntos.push( punto2 );
    }
    return puntos;
  }  
  
  encontrarPuntosMasAlejados() {
    let puntos = this.llenarPuntos();
    let maxDistance = 0;
    let point1: Punto;
    let point2: Punto;
    let haypunto = false

    for (let i = 0; i < puntos.length; i++) {
      for (let j = i + 1; j < puntos.length; j++) {
        const distance = haversineDistance(puntos[i].latitud, puntos[i].longitud, puntos[j].latitud, puntos[j].longitud);
        if (distance > maxDistance) {
          maxDistance = distance;
          point1 = puntos[i];
          point2 = puntos[j];
          haypunto = true;
        }
      }
    }
    if(haypunto){
      this.salida = point1!;
      this.destino = point2!;
      this.waypoints = puntos.filter(punto => punto !== point1 && punto !== point2);
      this.initMap();
    }

    function haversineDistance(lat1:number, lon1:number, lat2:number, lon2:number) {
      const R = 6371000.0; // Radio de la Tierra en metros
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }
    function toRadians(degrees:number) {
      return degrees * (Math.PI / 180);
    }


  }

  
    initMap() {

      const mapOptions: google.maps.MapOptions = {
        center: { lat: 38.3451, lng: -0.4814 },
        zoom: 10,
      };
    
      const map2 = new google.maps.Map(
        document.getElementById("map2") as HTMLElement,
        mapOptions
      );
        
      const directionsService = new google.maps.DirectionsService();
    
      // Crear una capa para mostrar la ruta en el mapa
      const directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map2);
      const origin = new google.maps.LatLng(this.salida.longitud, this.salida.latitud);
      const destination = new google.maps.LatLng(this.destino.longitud, this.destino.latitud);

        
      
      const waypointsLatLng: google.maps.DirectionsWaypoint[] = [];
      for (const punto of this.waypoints) {
        waypointsLatLng.push({
          location: new google.maps.LatLng(punto.longitud, punto.latitud),
        });
      }
    

      // Configurar la solicitud de la ruta
      const request = {
        origin: origin, // Punto de inicio
        destination: destination, // Punto final
        waypoints: waypointsLatLng, // Puntos intermedios (waypoints)
        travelMode: google.maps.TravelMode.DRIVING, // Modo de transporte (DRIVING, WALKING, BICYCLING, TRANSIT)
        optimizeWaypoints: true,
      };

      directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
        } else {
          console.log("Error al obtener la ruta:", status);
        }
      });
    }




}








