import { Component, OnInit, ViewEncapsulation } from '@angular/core';

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

export class FooterComponent implements OnInit {
	constructor() {
	}

	ngOnInit() {

	}
}
