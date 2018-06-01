import { Component, Renderer2, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'control-editable',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => ControlEditableComponent),
		multi: true,
	}],
	templateUrl: './control-editable.component.html',
	styleUrls: ['./control-editable.component.scss']
})
export class ControlEditableComponent implements ControlValueAccessor {

	@ViewChild('textarea') textarea;

	private onChange = (value: any) => { };

	private onTouched = () => { };

	writeValue(value: any): void {
		const node = this.textarea.nativeElement;
		this.renderer.setProperty(node, 'textContent', value);
		console.log('ControlEditableComponent.writeValue', value);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
		console.log('ControlEditableComponent.registerOnChange');
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
		console.log('ControlEditableComponent.registerOnTouched');
	}

	setDisabledState(isDisabled: boolean): void {
		const node = this.textarea.nativeElement;
		if (isDisabled) {
			this.renderer.addClass(node, 'disabled');
		} else {
			this.renderer.removeClass(node, 'disabled');
		}
		console.log('ControlEditableComponent.setDisabledState', isDisabled);
	}

	constructor(private renderer: Renderer2) {
	}

	change($event) {
		const value = $event.target.textContent;
		console.log('ControlEditableComponent.change', value);
		this.onChange(value);
		this.onTouched();
	}

}
