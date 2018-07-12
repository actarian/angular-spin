import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, ViewChild } from '@angular/core';
// import JSONFormatter from 'json-formatter-js';
import { isArray } from 'rxjs/util/isArray';
import { isObject } from 'rxjs/util/isObject';

@Component({
	selector: 'json-formatter',
	template: `<div #jsonFormatter></div>`,
	styleUrls: ['./json-formatter.component.scss']
})
export class JsonFormatterComponent implements OnChanges {
	@ViewChild(`jsonFormatter`) input: ElementRef;

	@Input() json: Array<any> | Object | any;

	render: ElementRef;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
	) { }

	ngOnChanges() {
		if (isPlatformBrowser(this.platformId)) {
			if (!isObject(this.json) && !isArray(this.json)) {
				return;
			}
			if (this.render) {
				this.input.nativeElement.removeChild(this.render.nativeElement);
			}
			const JSONFormatter = require('json-formatter-js').default;
			const formatter = new JSONFormatter(this.json);
			const render = formatter.render();
			this.input.nativeElement.appendChild(render);
			this.render = new ElementRef(render);
		}
	}
}
