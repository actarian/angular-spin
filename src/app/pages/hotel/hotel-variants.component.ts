import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DisposableComponent } from '../../core';
import { SearchResult } from '../../models';

@Component({
	selector: 'hotel-variants-component',
	templateUrl: './hotel-variants.component.html',
	styleUrls: ['./hotel-variants.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HotelVariantsComponent extends DisposableComponent {

	@Input() items: SearchResult[];
	visibleItems: number = 4;

}
