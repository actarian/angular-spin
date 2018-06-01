import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../core/pages';
import { User, UserService } from '../../models';

@Component({
	selector: 'page-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})

export class ProfileComponent extends PageComponent implements OnInit {
	@Input() user: User;

	constructor(
		route: ActivatedRoute,
		private userService: UserService
	) {
		super(route);
		this.attrClass = 'profile';
	}

	ngOnInit() {
		this.getUser();
	}

	getUser(): void {
		this.userService.getDetailById(this.getId())
			.takeUntil(this.unsubscribe)
			.subscribe(user => this.user = user);
	}

	save(): void {
		this.userService.update(this.user)
			.takeUntil(this.unsubscribe)
			.subscribe(() => {
				console.log('saved');
			});
	}
}
