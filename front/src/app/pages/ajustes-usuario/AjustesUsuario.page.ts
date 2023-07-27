import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';



@Component({
  selector: 'app-AjustesUsuario',
  templateUrl: 'AjustesUsuario.page.html',
  styleUrls: ['AjustesUsuario.page.scss']
})
export class AjustesUsuarioPage implements OnInit {

  selectedImage: File | null;
  imageUrl: string;
  usuario: any

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


  constructor(private usuarioService: UsuarioService, private router: Router){}

  ngOnInit(): void {
    this.cargarimagen()
  }

  cargarimagen(){
    this.usuarioService.cargarUsuario( this.usuarioService.uid )
      .subscribe( res => {
        // const pathUrl= `${environment.base_url}/api/upload/fotoperfil/`
        // const image = (res as any)['usuarios'].imagen || 'no-imagen.png'
        // this.imageUrl = pathUrl + image;
        this.usuario = (res as any)['usuarios'];



        
      },(error) => {
        console.error(error);
        const pathUrl= `${environment.base_url}/api/upload/fotoperfil/no-imagen.png`
        this.imageUrl = pathUrl;
        
      });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = file;
      this.previewImage();
    } else {
      console.log('El archivo seleccionado no es una imagen.');
      this.alertError('El archivo seleccionado no es una imagen.');
    }
  }

  previewImage() {
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }
  
  
  ionViewDidEnter() {
    //this.cargarimagen();
  }

  onSubmit() {
    if(this.selectedImage){
      this.usuarioService.subirFoto(this.selectedImage!).subscribe(
        (response) => {
          this.alertSucces('Imagen guardada correctamente')
        },
        (error) => {
          this.alertError(error.error.msg);
        }
      );
    }else{
      this.alertError('No se ha introducido una nueva foto');
    }
    
  }


  cambiarContrasena() {

    this.router.navigate(['tabs/AjustesUsuario/cambiar-password']); 
  }

  cambiarDatos() {
    this.router.navigate(['tabs/AjustesUsuario/cambiar-datos']); 
  }

  cerrarSesion() {

    this.usuarioService.logout();
  }

}
