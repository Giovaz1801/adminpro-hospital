import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
    ) {
    console.log('Servicio de usuario listo');
    this.cargarStorage();
   }

   estaLogeado() {
     return (this.token.length > 5) ? true : false;
   }

   cargarStorage() {
     if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
     } else {
       this.token = '';
       this.usuario = null;
     }
   }

   guardarStorage(id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', (token));
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;

   }

   logout() {
     this.usuario = null;
     this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

   }

   loginGoogle(token: string) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token })
                  .pipe(map((respuesta: any) => {

                    this.guardarStorage(respuesta.id, respuesta.token, respuesta.usuario);
                    return true;
                  }));


   }

   login(usuario: Usuario, recordar: boolean = true ) {

     if (recordar) {
      localStorage.setItem('email', usuario.email);
     } else {
       localStorage.removeItem('email');
     }

     const url = URL_SERVICIOS + '/login';
     return this.http.post(url, usuario)
                      .pipe(map( (respuesta: any) => {

                        this.guardarStorage(respuesta.id, respuesta.token, respuesta.usuario);
                        return true;

                      }));

   }

   crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
                    .pipe(map((respuesta: any) => {
                      swal('Correo creado', usuario.email, 'success');
                      return respuesta.usuario;
                    }));
   }

   actualizarUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    // console.log(url);

    return this.http.put(url, usuario)
                    .pipe(map((respuesta: any) => {

                      if (usuario._id === this.usuario._id) {
                        const userDB: Usuario = respuesta.usuario;
                        this.guardarStorage(userDB._id, this.token, userDB);
                      }

                      swal('Usuario Actualizado', usuario.nombre, 'success');
                      return true;

                    }));

   }

   cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
            .then((respuesta: any) => {
              this.usuario.img = respuesta.usuario.img;
              swal('Imagen Actualizada', this.usuario.nombre, 'success');

              this.guardarStorage(id, this.token, this.usuario);

            })
            .catch(respuesta => {
              console.error(respuesta);
            });
   }

   cargarUsuarios(desde: number = 0) {

    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);

   }

   buscarUsuario(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url).pipe(map((respuesta: any) => respuesta.usuarios));
   }

   borrarUsuario (id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url)
                    .pipe(map(resp => {
                      swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
                      return true;
                    }));
   }


}
