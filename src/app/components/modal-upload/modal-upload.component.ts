import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenASubir: File;
  imagenTemp: string;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenASubir = null;
    this._modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenASubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo no es una imagen', 'error');
      this.imagenASubir = null;
      return;
    }

    this.imagenASubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp =  reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result.toString();

  }

  subirImagen() {

    this._subirArchivoService.subirArchivo(this.imagenASubir, this._modalUploadService.tipo, this._modalUploadService.id)
          .then(resp => {
            // console.log(resp);
            this._modalUploadService.notificacion.emit(resp);
            this.cerrarModal();
          })
          .catch(err => {
            console.error('Error en la carga...');
          });

  }

}
