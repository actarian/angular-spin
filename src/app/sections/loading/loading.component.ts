import { Component, Input, ViewEncapsulation } from '@angular/core';

export enum LoadingType {
	Button = 0,
	Spinner = 1
}

@Component({
	selector: 'loading-component',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class LoadingComponent {

	@Input() title: string = 'Caricamento';
	@Input() type: LoadingType = LoadingType.Button;
	types: any = LoadingType;

}
