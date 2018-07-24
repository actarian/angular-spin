import { Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, Provider, ReflectiveInjector, ViewChild, ViewContainerRef } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
// import { SignForgottenComponent, SignInComponent, SignUpComponent } from '../../../pages/auth';
import { DisposableComponent } from '../../disposable';
import { Modal, ModalData } from './modal';
import { ModalService } from './modal.service';

@Component({
	selector: 'modal-component',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
	// entryComponents: [SignForgottenComponent, SignInComponent, SignUpComponent], // Reference to the components must be here in order to dynamically create them
})

export class ModalComponent extends DisposableComponent implements OnInit {

	modalCount: number = 0;
	component: ComponentRef<any>;

	@ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

	// component: Class for the component you want to create
	// providers: An object with key/value pairs mapped to input name/input value
	@Input() set modal(modal: Modal) {
		if (this.component) {
			this.component.destroy();
		}
		if (!modal) {
			this.component = null;
			return;
		}
		// Inputs need to be in the following format to be resolved properly
		const providers: Provider = Object.keys(modal.providers).map(key => {
			return { provide: key, useValue: modal.providers[key] };
		});
		providers.push(
			{ provide: ModalData, useValue: modal.data }
		);
		const resolvedInputs = ReflectiveInjector.resolve(providers);
		// We create an injector out of the data we want to pass down and this components injector
		const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.modalContainer.parentInjector);
		// We create a factory out of the component we want to create
		const factory = this.resolver.resolveComponentFactory(modal.component);
		// We create the component using the factory and the injector
		const component = factory.create(injector);
		// We insert the component into the dom container
		this.modalContainer.insert(component.hostView);
		// We can destroy the old component is we like by calling destroy
		this.component = component;
	}

	constructor(
		private resolver: ComponentFactoryResolver,
		private modalService: ModalService
	) {
		super();
	}

	ngOnInit() {
		this.modalService.modals$.pipe(
			takeUntil(this.unsubscribe),
			map((modals: Modal[]) => {
				const modal = modals.length ? modals[modals.length - 1] : null;
				this.modalCount = modals.length;
				return modal;
			})
		).subscribe((modal: Modal) => {
			this.modal = modal;
		});
	}

	doClose() {
		this.modalService.close();
	}

	doPrev() {
		this.modalService.prev();
	}

}
