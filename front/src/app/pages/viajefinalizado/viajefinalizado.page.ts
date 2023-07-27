import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViajeService } from '../../services/viajes.service';
import { ValoracionService } from '../../services/valoracion.service';
import { valoracionForm } from '../../interfaces/valoracion-form.interface';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  edad: number;
  showDetails: boolean;
  valoracion: {
    descripcion: string;
    valor: number;
  };
}

@Component({
  selector: 'app-viajefinalizado',
  templateUrl: './viajefinalizado.page.html',
  styleUrls: ['./viajefinalizado.page.scss'],
})
export class ViajefinalizadoPage implements OnInit {
  private uid:any
  public viaje: any
  public usuarios:any
  public cargaPagina =false;
  pasajeros = 5;


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

  constructor(private router: Router, private route: ActivatedRoute, private viajeService: ViajeService, private valoracionService: ValoracionService ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.uid = params['viaje'];
      this.cargarViaje(this.uid)
    });
  }
  cargarViaje(uid: string) {
    this.viajeService.getViaje(this.uid).subscribe(
      (response) => {
        if (response.solicitudes.uid === uid) {
          this.pasajeros= 5 -response.solicitudes.huecos
          this.viaje = response.solicitudes;
          this.usuarios = response.solicitudes.usuarios;

          let indexToRemove = -1;
          for (let i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].id === localStorage['uid']) {
              indexToRemove = i;
              break;
            }
          }

          if (indexToRemove !== -1) {
            this.usuarios.splice(indexToRemove, 1);
          }

          this.usuarios.forEach((usuario: Usuario) => {
            usuario.valoracion = {
              descripcion: '',
              valor: 3,
            };
          });
          this.cargaPagina = true;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  back(){
    this.router.navigate(['tabs/MisViajes']); 
  }

  toggleDetails(usuario: any) {
    usuario.showDetails = !usuario.showDetails;
  }

  enviarValoracion(usuario: Usuario) {
    const data: valoracionForm = {
      idUsuario: localStorage['uid'],
      idValorado: usuario.id,
      idViaje: this.viaje.uid,
      valoracion: usuario.valoracion.valor,
      comentario: usuario.valoracion.descripcion,
    };


    this.valoracionService.valorar(data).subscribe(
        (response) => {
          this.alertSucces("Usuario valorado")
        },
        (error) => {
          console.error(error); 
        }
      );
  }

  increaseValue(usuario: Usuario) {
    if (usuario.valoracion.valor < 5) {
      usuario.valoracion.valor++;
    }
  }

  decreaseValue(usuario: Usuario) {
    if (usuario.valoracion.valor > 1) {
      usuario.valoracion.valor--;
    }
  }
  

}
