import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DisposableComponent, MenuItem } from '../../core';

@Component({
	selector: 'landing-breadcrumb-component',
	templateUrl: './landing-breadcrumb.component.html',
	styleUrls: ['./landing-breadcrumb.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class LandingBreadcrumbComponent extends DisposableComponent implements OnInit {

	readmore: Boolean;
	segments: MenuItem[];

	constructor(
		protected router: Router,
		private route: ActivatedRoute,
	) {
		super();
	}

	ngOnInit() {
		// console.log(this.router, this.route);
		const segments = this.route.snapshot.url.map(x => x.path);
		this.segments = segments.map((x: string, i: number) => new MenuItem({
			name: this.toTitleCase(x),
			slug: '/' + segments.slice(0, i + 1).join('/')
		}));
	}

	toTitleCase(name: string): string {
		name = name.replace(/_|-/g, ' ');
		return name.split(' ').map((w: string) => {
			return w.replace(/\w\S*/g, (s: string) => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase());
		}).join(' ');
	}

}
