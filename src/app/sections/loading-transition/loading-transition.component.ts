import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, NgZone, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core';

@Component({
	selector: 'loading-transition',
	templateUrl: './loading-transition.component.html',
	styleUrls: ['./loading-transition.component.scss']
})
export class LoadingTransitionComponent extends DisposableComponent implements AfterViewInit {

	@ViewChild('element', { read: ElementRef }) element: ElementRef;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private zone: NgZone,
		private renderer: Renderer2,
		private router: Router,
	) {
		super();
	}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			this.router.events.pipe(
				takeUntil(this.unsubscribe),
			).subscribe((e: RouterEvent) => {
				if (e instanceof NavigationStart) {
					this.zone.runOutsideAngular(() => {
						this.renderer.setAttribute(this.element.nativeElement, 'class', 'loading-transition active');
					});
				}
				if (e instanceof NavigationEnd) {
					this.zone.runOutsideAngular(() => {
						this.renderer.setAttribute(this.element.nativeElement, 'class', 'loading-transition finish');
						setTimeout(() => {
							this.renderer.setAttribute(this.element.nativeElement, 'class', 'loading-transition');
						}, 600);
					});
				}
			});
		}
	}

}
