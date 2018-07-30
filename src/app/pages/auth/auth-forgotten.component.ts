import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core';
import { ModalService } from '../../core/ui/modal';
import { User } from '../../models/user';
import { UserService } from '../../models/user.service';

@Component({
	selector: 'auth-forgotten-component',
	templateUrl: './auth-forgotten.component.html',
	styleUrls: ['./auth-forgotten.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class AuthForgottenComponent extends DisposableComponent implements OnInit {

	model: User = new User();
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
		this.submitted = true;
		this.userService.signForgotten(this.model).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(
			ok => {
				this.sent = true;
			}, error => {
				this.error = error;
			}
		);
	}
}
