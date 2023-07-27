
export interface loginForm {
    email: string;
    password: string;
} 

export interface registerForm {
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
    email: string;
    password: string;
} 

export interface cambiarDatosForm {
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
} 

export interface cambiarPasswordForm {
    antigua: string;
    nueva: string;

} 
