import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { valoracionForm } from '../interfaces/valoracion-form.interface';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {
  constructor(private http: HttpClient) {}

  valorar(formData: valoracionForm){
    const uid = localStorage['uid'];
    const url = `${environment.base_url}/api/valoraciones`;
    return this.http.post(url, formData, this.cabeceras);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get uid(): string {
    return localStorage.getItem('uid') || '';
  }
  
}
