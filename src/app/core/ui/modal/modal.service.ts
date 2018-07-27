import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Modal, ModalCloseEvent, ModalCompleteEvent } from './modal';

@Injectable({
	providedIn: 'root'
})
export class ModalService {

	modals$ = new BehaviorSubject<Modal[]>([]);

	getInfos(): Observable<Modal> {
		return this.modals$.pipe(
			map((modals: Modal[]) => {
				return modals.length ? modals[modals.length - 1] : null;
			})
		);
	}

	open(modal: Modal): EventEmitter<ModalCompleteEvent | ModalCloseEvent> {
		modal = new Modal(modal);
		const modals = this.modals$.getValue();
		modals.push(modal);
		this.modals$.next(modals);
		return modal.emitter;
		// event emitter bound to modals$
	}

	complete(modal?: Modal, data?: any): void {
		modal = modal ? this.remove(modal) : this.pop();
		if (modal) {
			modal.emitter.emit(new ModalCompleteEvent({ modal, data }));
		}
	}

	close(modal?: Modal, data?: any): void {
		modal = this.removeAll();
		if (modal) {
			modal.emitter.emit(new ModalCloseEvent({ modal, data }));
		}
	}

	prev(modal?: Modal, data?: any): void {
		modal = modal ? this.remove(modal) : this.pop();
		if (modal) {
			modal.emitter.emit(new ModalCloseEvent({ modal, data }));
		}
	}

	private pop(): Modal {
		const modals = this.modals$.getValue();
		if (modals.length) {
			const modal = modals.pop();
			this.modals$.next(modals);
			return modal;
		} else {
			return null;
		}
	}

	private remove(modal: Modal): Modal {
		const modals = this.modals$.getValue();
		if (modals.length && modals[modals.length - 1] === modal) {
			modals.pop();
			this.modals$.next(modals);
			return modal;
		} else {
			return null;
		}
	}

	private removeAll(): Modal {
		const modals = this.modals$.getValue();
		if (modals.length) {
			const modal = modals.pop();
			this.modals$.next([]);
			return modal;
		} else {
			return null;
		}
	}

	/*
	init(component: any, providers: object, outputs: object) {
		const config = { inputs: providers, outputs };
		this.domService.appendComponentTo(this.modalElementId, component, config);
		document.getElementById(this.modalElementId).className = 'show';
		document.getElementById(this.overlayElementId).className = 'show';
	}

	destroy() {
		this.domService.removeComponent();
		document.getElementById(this.modalElementId).className = 'hidden';
		document.getElementById(this.overlayElementId).className = 'hidden';
	}
	*/

}
