import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {

    this.constarTres().then(
      mensaje => console.log('Termino', mensaje)
      ).catch( error => console.error('Error en la promesa', error) );

    }

    ngOnInit() {
    }

    constarTres(): Promise<boolean> {
      return new Promise( (resolve, reject) => {
        let contador = 0;

        const intervalo = setInterval( () => {

          contador += 1;
          console.log(contador);

          if ( contador === 3) {
            resolve(true);
            // reject('Algun error');
            clearInterval(intervalo);
          }
        }, 1000 );

      });

  }

}
