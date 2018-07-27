import { EventEmitter, Injectable, Provider } from '@angular/core';

export enum ModalEventType {
	Complete = 0,
	Close = 1,
}

export class ModalCompleteEvent {
	modal: Modal;
	data?: any;
	type?: ModalEventType.Complete = ModalEventType.Complete;

	constructor(options?: ModalCompleteEvent) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export class ModalCloseEvent {
	modal: Modal;
	data?: any;
	type?: ModalEventType.Close = ModalEventType.Close;

	constructor(options?: ModalCloseEvent) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export type ModalEvent<T> = ModalCompleteEvent | ModalCloseEvent;

export class Modal {
	component: any;
	providers?: Provider = [];
	data?: any;
	emitter?: EventEmitter<ModalCompleteEvent | ModalCloseEvent> = new EventEmitter();

	constructor(options?: Modal) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

@Injectable({
	providedIn: 'root'
})
export class ModalData extends Object { }
