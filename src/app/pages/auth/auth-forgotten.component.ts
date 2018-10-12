import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core';
import { ModalService } from '../../core/ui/modal';
import { UserSignForgotten } from '../../models/user';
import { UserService } from '../../models/user.service';

@Component({
	selector: 'auth-forgotten-component',
	templateUrl: './auth-forgotten.component.html',
	styleUrls: ['./auth-forgotten.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class AuthForgottenComponent extends DisposableComponent implements OnInit {

	model: UserSignForgotten = new UserSignForgotten();
	busy: boolean = false;
	submitted: boolean = false;
	sent: boolean = false;
	error: any;

	constructor(
		private modalService: ModalService,
		private userService: UserService
	) {
		super();
	}

	ngOnInit() {

	}

	onSubmit(): void {
		this.error = null;
		this.submitted = true;
		this.busy = true;
		this.userService.signForgotten(this.model).pipe(
			takeUntil(this.unsubscribe),
			finalize(() => this.busy = false),
		).subscribe(
			success => this.sent = true,
			error => this.error = error
		);
	}
}
