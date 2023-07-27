import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-Home',
  templateUrl: 'Home.page.html',
  styleUrls: ['Home.page.scss']
})
export class HomePage {

  constructor(private router: Router) {}

  redirigirPagina1(){
    this.router.navigate(['tabs/createviaje']);
  }
  redirigirPagina2(){
    this.router.navigate(['tabs/MisViajes']);
  }
  redirigirPagina3(){
    this.router.navigate(['tabs/AjustesUsuario']);
  }
}
