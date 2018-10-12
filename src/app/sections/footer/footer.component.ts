import { Component, ViewEncapsulation } from '@angular/core';
import { of, timer } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { DisposableComponent } from '../../core';

@Component({
	selector: 'section-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

/*----------------------------------------
TODOLIST FOOTER
----------------------------------------*/
/*
- Collegare newsletter
- Verificare se il modulo newsletter deve essere visibile anche se l'utente è loggato
*/

export class FooterComponent extends DisposableComponent {

	model: any = {};
	busy: boolean = false;

	onNewsletter() {
		this.busy = true;
		timer(3000).pipe(
			switchMap(() => {
				return of(null);
			}),
			finalize(() => this.busy = false),
		).subscribe(
			success => console.log('success', this.model),
			error => console.log('error', error)
		);
	}

}
