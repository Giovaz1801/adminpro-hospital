import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';

import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  // hospitales: Hospital;
  totalHospitales: number;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirArchivoService
  ) {
    console.log('Servicio de hospital listo');
    // this.cargarStorage();
  }

  cargarHospitales( ) {
   const url = URL_SERVICIOS + '/hospital';
   return this.http.get(url)
                    .pipe(map((resp: any) => {
                      this.totalHospitales = resp.total;
                      return resp.hospitales;
                    }));
  }

  obtenerHospital(id: string) {
    const url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.hospital));
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
                    .pipe(map(resp => swal('Hospital borrado', 'Eliminado Correctamente', 'success')));
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre})
                    .pipe(map((resp: any) => {
                      swal('Hospital Creado', nombre, 'success');
                     return resp.hospital;
                    }));
  }

  buscarHospital(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url).pipe(map((respuesta: any) => respuesta.hospitales));
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, hospital)
                    .pipe(map((resp: any) => {
                      swal('Hsopital Actualizado', hospital.nombre, 'success');
                      return resp.hospital;
                    }));
  }
}
