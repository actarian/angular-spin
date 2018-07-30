import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlBase, ControlBaseOptions, ControlCheckbox, ControlEmail, ControlNumber, ControlPassword, ControlRadio, ControlSelect, ControlService, ControlText } from './controls';

@Injectable({
	providedIn: 'root'
})
export class FormService {

	constructor(
		private controlService: ControlService
	) { }

	getControlsFromOptions(options: ControlBaseOptions<any>[]): ControlBase<any>[] {
		const controls: ControlBase<any>[] = options.map(o => {
			switch (o.schema) {
				case 'checkbox':
					return new ControlCheckbox(o);
				case 'email':
					return new ControlEmail(o);
				case 'number':
					return new ControlNumber(o);
				case 'password':
					return new ControlPassword(o);
				case 'radio':
					return new ControlRadio(o);
				case 'select':
					return new ControlSelect(o);
				case 'text':
					return new ControlText(o);
				default:
					return new ControlText(o);
			}
		});
		controls.sort((a, b) => a.order - b.order);
		return controls;
	}

	getGroupFromOptions(options: ControlBaseOptions<any>[]): FormGroup {
		const controls: ControlBase<any>[] = this.getControlsFromOptions(options);
		const group = this.controlService.toFormGroup(controls);
		return group;
	}

	getGroupFromControls(controls: ControlBase<any>[]): FormGroup {
		const group = this.controlService.toFormGroup(controls);
		return group;
	}

}
