import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { cambiarDatosForm } from '../../interfaces/login-form.interface';

@Component({
  selector: 'app-cambiar-datos',
  templateUrl: './cambiar-datos.page.html',
  styleUrls: ['./cambiar-datos.page.scss'],
})


export class CambiarDatosPage implements OnInit {

  name: string;
  firstname: string;
  DNI: string;
  phone: string;
  errorMessage: string;
  succesMessage: string;

  CambiarDatosForm: cambiarDatosForm = {
    nombre: '',
    apellidos: '',
    dni: '',
    telefono: '',
  };
  public waiting = false;

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.usuarioService.cargarUsuario( this.usuarioService.uid )
    .subscribe( res => {
      this.name = (res as any)['usuarios'].nombre;
      this.firstname = (res as any)['usuarios'].apellidos;
      this.DNI = (res as any)['usuarios'].dni;
      this.phone = (res as any)['usuarios'].telefono;
      
    },(error) => {
      console.error(error);
      
    });
  }

  CambiarDatos() {
    this.succesMessage="";
    this.errorMessage = '';
    if ( !this.name || !this.firstname || !this.DNI || !this.phone) {
      if (!this.name) {
        this.errorMessage = 'Por favor, ingresa tu nombre.';
      } else if (!this.firstname) {
        this.errorMessage = 'Por favor, ingresa tus apellidos.';
      } else if (!this.DNI) {
        this.errorMessage = 'Por favor, ingresa tu DNI.';
      } else if (!this.phone) {
        this.errorMessage = 'Por favor, ingresa tu número de teléfono.';
      }
      return;
    }

    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(this.DNI)) {
      this.errorMessage = 'El formato del número de DNI no es válido.';
      return;
    }
    const telefonoRegex = /^[0-9]{9}$/;
    if (!telefonoRegex.test(this.phone)) {
      this.errorMessage = 'El formato del número de teléfono no es válido.';
      return;
    }

    this.CambiarDatosForm.nombre = this.name;
    this.CambiarDatosForm.apellidos = this.firstname;
    this.CambiarDatosForm.dni = this.DNI;
    this.CambiarDatosForm.telefono = this.phone;

    this.waiting = true;
    this.usuarioService.CambiarDatos(this.CambiarDatosForm)
      .subscribe(res => {
        localStorage.setItem('nombre', (res as any)['nombre']);
        this.errorMessage="";
        this.succesMessage ="Datos actualizados correctamente"
        this.waiting = false;
      }, (err) => {
        console.warn('Error respuesta api:', err);
        this.succesMessage="";
        this.errorMessage = err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde';
        this.waiting = false;

      });

  }

  ionViewDidEnter() {
    this.errorMessage="";
    this.succesMessage="";
  }



  back() {
    this.errorMessage="";
    this.succesMessage="";
    this.router.navigate(['tabs/AjustesUsuario']);
  }
}
