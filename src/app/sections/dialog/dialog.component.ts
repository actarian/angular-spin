import { Component, ViewEncapsulation } from '@angular/core';
import { DisposableComponent } from '../../core';
import { Modal, ModalService } from '../../core/ui/modal';

export class Dialog {
	title: string = `Title`;
	description: string = `Description`;
}

@Component({
	selector: 'dialog-component',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class DialogComponent extends DisposableComponent {

	data: Dialog = new Dialog();

	constructor(
		private modalService: ModalService,
		private modal: Modal,
	) {
		super();
		this.data = this.modal.data as Dialog;
	}

}
