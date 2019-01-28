import { Component, OnInit, OnDestroy } from '@angular/core';

// tslint:disable-next-line:import-blacklist
import { Observable, Subscribable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subcripcion: Subscription;

  constructor() {


    this.subcripcion = this.regresaObservable()
      .subscribe(
        numero => console.log('Sub', numero),
        error => console.error('Error en el Obs', error),
        () => console.log('Ya termino')
    );

  }

  ngOnInit() {
  }


  ngOnDestroy() {
   console.log('La página se va a cerrar');
   this.subcripcion.unsubscribe();
  }

  regresaObservable(): Observable<any> {

    return new Observable( (observer: Subscriber<any>) => {
      let contador = 0;

      const intervalo = setInterval(() => {

        contador += 1;

        const salida =  {
          valor: contador
        };

        observer.next( salida );

        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // if (contador === 2) {
        //   // clearInterval(intervalo);
        //   observer.error('Auxilio');
        // }

      }, 1000);

    }).pipe(
      map( respuesta => respuesta.valor),
      filter( (valor, index) => {
        if ( (valor % 2) === 1 ) {
          // N impar
          return true;
        } else {
          // N par
          return false;
        }

      })
    );

  }

}
