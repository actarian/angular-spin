import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
	selector: '[clickOutside]'
})
export class ClickOutsideDirective {

	constructor(
		private element: ElementRef
	) { }

	@Output()
	public clickOutside = new EventEmitter();

	@HostListener('document:click', ['$event.target'])
	public onClick(targetElement) {
		const clickedInside = this.element.nativeElement.contains(targetElement);
		if (!clickedInside) {
			this.clickOutside.emit(null);
		}
	}
}
