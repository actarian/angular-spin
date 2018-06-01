


import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Label } from './label';
import { LabelService } from './label.service';

@Pipe({
	name: 'label',
	pure: false,
})
export class LabelPipe implements PipeTransform {

	constructor(
		private ref: ChangeDetectorRef,
		protected labelService: LabelService<Label>
	) {
		this.labelService.events.subscribe(
			x => this.ref.markForCheck()
		);
	}

	public transform(key: string, params?: any): string {
		// return WrappedValue.wrap(this.val);
		const label = this.labelService.getLabel(key, params);
		// console.log('label', label, this.labelService.cache);
		return label;
	}

}
