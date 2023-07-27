import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { cambiarPasswordForm } from '../../interfaces/login-form.interface';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
})
export class CambiarPasswordPage implements OnInit {


  errorMessage: string;
  succesMessage: string;

  CambiarPassForm: cambiarPasswordForm = {
    antigua: '',
    nueva: '',
  };
  public waiting = false;

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {

  }

  CambiarPass() {
    
    if (this.CambiarPassForm.nueva==""){
      this.succesMessage="";
      this.errorMessage = 'Introduce una nueva contraseña';
      return;
    }

    this.waiting = true;
    this.usuarioService.CambiarPassword(this.CambiarPassForm)
      .subscribe(res => {
        localStorage.setItem('nombre', (res as any)['nombre']);
        this.errorMessage="";
        this.succesMessage ="Datos actualizados correctamente"
        this.CambiarPassForm.antigua= '';
        this.CambiarPassForm.nueva= '';
        //this.router.navigateByUrl('/tabs');
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
    this.CambiarPassForm.antigua= '';
    this.CambiarPassForm.nueva= '';
  }



  back() {
    this.errorMessage="";
    this.succesMessage="";
    this.router.navigate(['tabs/AjustesUsuario']);
  }

}
