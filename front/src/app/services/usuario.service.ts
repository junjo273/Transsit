import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm, registerForm, cambiarDatosForm, cambiarPasswordForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router  ) { }

  login( formData: loginForm) {
    return this.http.post(`${environment.base_url}/api/login`, formData)
            .pipe(
              tap( res => {
                localStorage.setItem('token', (res as any)['token']);
                localStorage.setItem('rol', (res as any)['rol']);
                localStorage.setItem('uid', (res as any)['uid']);
                localStorage.setItem('nombre', (res as any)['nombre']);
                localStorage.setItem('email', (res as any)['email']);
                const {uid, rol} = (res as any);
                this.usuario = new Usuario(uid, rol);
              })
            );
  }

  logout() {
    this.removeSession();
    this.router.navigateByUrl('/api/login');
  }

  removeSession(){
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
  }

  register(formData: registerForm){
    const url = `${environment.base_url}/api/usuarios`;
    return this.http.post(url, formData, this.tokencutre);
  }
  CambiarDatos(formData: cambiarDatosForm){
    const uid = localStorage['uid'];
    const url = `${environment.base_url}/api/usuarios/cambiardatos/usuario`;
    return this.http.put(url, formData, this.cabeceras);
  }
  CambiarPassword(formData: cambiarPasswordForm){
    const uid = localStorage['uid'];
    const url = `${environment.base_url}/api/usuarios/cambiarpassword/usuario`;
    return this.http.put(url, formData, this.cabeceras);
  }

  subirFoto(file: File) {
    const uid = localStorage['uid'];
    const formData = new FormData();
    formData.append('archivo', file);
    const url = `${environment.base_url}/api/upload/fotoperfil/${uid}`;
    return this.http.post(url, formData, this.cabeceras);
  }

  get tokencutre() {
    return {
      headers: {
        'x-token': '',
      }};
  }

  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    if (token === '') {
      this.removeSession();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/api/login/token`, {
      headers: {
        'x-token': token
      }
      }).pipe(
        tap( res => {
          localStorage.setItem('token', (res as any)['token']);
          localStorage.setItem('rol', (res as any)['rol']);
          localStorage.setItem('uid', (res as any)['uid']);
        }),
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          this.removeSession();
          return of(incorrecto);
        })
      )
  }

  validarToken(): Observable<boolean> {
    return this.validar(true, false);
  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);
  }

  cargarUsuario( uid: string) {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/api/usuarios/?id=${uid}` , this.cabeceras);
  }

  cargarUsuariosViaje( uid: string, idviaje: string) {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/api/usuarios/usuariosviaje/${uid}/${idviaje}` , this.cabeceras);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }
  get uid(): string {
    return localStorage.getItem('uid') || '';
  }
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get imagenURL(): string{
    return this.usuario.imagenUrl;
  }

}
