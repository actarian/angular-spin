import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { RouteService } from '../../core';
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
		protected routeService: RouteService,
		private userService: UserService
	) {
		super(routeService);
		this.attrClass = 'profile';
	}

	ngOnInit() {
		this.getUser();
	}

	getUser(): void {
		this.userService.getDetailById(this.getId()).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(user => this.user = user);
	}

	save(): void {
		this.userService.update(this.user).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(() => {
			console.log('saved');
		});
	}
}
