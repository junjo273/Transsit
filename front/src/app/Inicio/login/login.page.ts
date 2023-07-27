import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { loginForm} from '../../interfaces/login-form.interface';

@Component({
  selector: 'app-Login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  errorMessage: string;
  public waiting = false;

  loginForm: loginForm = {
    email: '',
    password:'',
  }

  constructor(private router: Router, private UsuarioService: UsuarioService) { }

  ngOnInit(): void {
    
  }

  login() {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      if (!this.email && !this.password) {
        this.errorMessage = 'Por favor, ingresa tu correo electrónico y contraseña.';
      } else if (!this.email) {
        this.errorMessage = 'Por favor, ingresa tu correo electrónico.';
      } else {
        this.errorMessage = 'Por favor, ingresa tu contraseña.';
      }
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'El formato del correo electrónico no es válido.';
      return;
    }

    this.loginForm.email=this.email.toLowerCase();
    this.loginForm.password=this.password;

    this.waiting = true;

    this.UsuarioService.login(this.loginForm)
      .subscribe( res => {
        localStorage.setItem('email', this.loginForm.email);
        this.router.navigateByUrl('/tabs');
        this.waiting = false;
      }, (err) => {
        console.warn('Error respueta api:',err);
        this.errorMessage = err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde';
        this.waiting = false;

      });

  }

  redirectToRegistration() {
    this.router.navigate(['login/register']); 
  }
  
  redirectToForgotPassword() {
    this.router.navigate(['login/forgotPassword']); 
  }


}
