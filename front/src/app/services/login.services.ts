import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { loginForm, registerForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) {}

  login( formData: loginForm) {
    return this.http.post(`${environment.base_url}/api/login`, formData)
            .pipe(
              tap( res => {
                localStorage.setItem('token', (res as any)['token']);
                localStorage.setItem('rol', (res as any)['rol']);
              })
            );
  }

    logout() {
        this.removeSession();
        this.router.navigateByUrl('login');
    }

    register(formData: registerForm){
      const url = `${environment.base_url}/api/usuarios`;
      return this.http.post(url, formData, this.tokencutre);
    }
    

    removeSession(){
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('rol');
    }
    
    get tokencutre() {
      return {
        headers: {
          'x-token': '',
        }};
    }

}
