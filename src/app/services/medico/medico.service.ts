import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioSerive: UsuarioService
  ) { }

  cargarMedicos(desde: number = 0) {
    const url = URL_SERVICIOS + '/medico?desde=' + desde;
    // const url = URL_SERVICIOS + '/medico';
    return this.http.get(url);
                      // .pipe(map((resp: any) => {
                      //   console.log(resp);
                      //   this.totalMedicos = resp.total;
                      //   return resp.medicos;
                      // }));
   }

  cargarMedico(id: string) {
    const url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.medico));
  }

  buscarMedicos(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url).pipe(map((respuesta: any) => respuesta.medicos));
   }

   borrarMedico(id: string) {
     let url = URL_SERVICIOS + '/medico/' + id;
     url += '?token=' + this._usuarioSerive.token;

     return this.http.delete(url)
                        .pipe(map((resp: any) => {
                          swal('Médico borrado', 'Médico borrado correctamente', 'success');
                          return resp;
                        }));
   }

   guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if (medico._id) {
      // Actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioSerive.token;
      return this.http.put(url, medico)
                        .pipe(map((resp: any) => {
                          swal('Médico actualizado', medico.nombre, 'success');
                          return resp.medico;
                        }));
    } else {
      // Creando
      url += '?token=' + this._usuarioSerive.token;
      // console.log(url);
      return this.http.post(url, medico)
                    .pipe(map((resp: any) => {
                      swal('Médico registrado', medico.nombre, 'success');
                      return resp.medico;
                    }));
    }

   }
}
