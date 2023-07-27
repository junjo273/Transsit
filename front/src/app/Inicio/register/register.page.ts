import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { registerForm} from '../../interfaces/login-form.interface';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss']
})
export class registerPage implements OnInit {

  name: string;
  firstname: string;
  DNI: string;
  phone: string;
  email: string;
  password: string;
  errorMessage: string;
  
  registerForm: registerForm = {
    nombre: '',
    apellidos: '',
    dni: '',
    telefono: '',
    email: '',
    password: ''
  };
  public waiting = false;


  constructor(private router: Router, private UsuarioService: UsuarioService,) { }

  ngOnInit(): void {
    
  }

  register() {
    
    this.errorMessage = '';
    if (!this.email || !this.password || !this.name || !this.firstname || !this.DNI || !this.phone) {
      if (!this.email && !this.password) {
        this.errorMessage = 'Por favor, rellene todos los campos.';
      } else if (!this.email) {
        this.errorMessage = 'Por favor, ingresa tu correo electrónico.';
      } else if (!this.password){
        this.errorMessage = 'Por favor, ingresa tu contraseña.';
      } else if (!this.name){
        this.errorMessage = 'Por favor, ingresa tu nombre.';
      } else if (!this.firstname){
        this.errorMessage = 'Por favor, ingresa tus apellidos.';
      } else if (!this.DNI){
        this.errorMessage = 'Por favor, ingresa tu DNI.';
      } else if (!this.phone){
        this.errorMessage = 'Por favor, ingresa tu numero de telefono.';
      }
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'El formato del correo electrónico no es válido.';
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

      this.registerForm.nombre = this.name;
      this.registerForm.apellidos = this.firstname;
      this.registerForm.dni = this.DNI;
      this.registerForm.email = this.email.toLowerCase();
      this.registerForm.telefono =this.phone
      this.registerForm.password = this.password;

      this.waiting = true;
      this.UsuarioService.register( this.registerForm)
      .subscribe( res => {
        localStorage.setItem('token', (res as any)['token']);
        localStorage.setItem('rol', (res as any)['rol']);
        localStorage.setItem('uid', (res as any)['uid']);
        localStorage.setItem('nombre', (res as any)['nombre']);
        this.router.navigateByUrl('/tabs');
        this.waiting = false;
      }, (err) => {
        console.warn('Error respueta api:',err);
        this.errorMessage = err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde';
        this.waiting = false;

      });
    
  }


  back(){
    this.router.navigate(['login/']); 
  }





}
