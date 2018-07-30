import { AfterContentInit, ChangeDetectorRef, ContentChildren, Directive, ElementRef, Input, OnChanges, OnDestroy, QueryList, Renderer2, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router, RouterEvent, RouterLink, RouterLinkWithHref } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
	selector: '[routeActive]',
	exportAs: 'routeActive',
})
export class RouteActive implements OnChanges, OnDestroy, AfterContentInit {

	@ContentChildren(RouterLink, { descendants: true }) links: QueryList<RouterLink>;
	@ContentChildren(RouterLinkWithHref, { descendants: true })
	linksWithHrefs: QueryList<RouterLinkWithHref>;

	private classes: string[] = [];
	private subscription: Subscription;
	public readonly isActive: boolean = false;

	@Input()
	set RouteActive(data: string[] | string) {
		const classes = Array.isArray(data) ? data : data.split(' ');
		this.classes = classes.filter(x => !!x);
		console.log('RouteActive', data, this.classes);
	}

	@Input() RouteActiveOptions: { exact: boolean } = { exact: false };

	constructor(
		private router: Router,
		private element: ElementRef,
		private renderer: Renderer2,
		private cdr: ChangeDetectorRef
	) {
		this.subscription = router.events.subscribe((x: RouterEvent) => {
			if (x instanceof NavigationEnd) {
				this.update();
			}
		});
	}

	ngAfterContentInit(): void {
		this.links.changes.subscribe(x => this.update());
		this.linksWithHrefs.changes.subscribe(x => this.update());
		this.update();
	}

	ngOnChanges(changes: SimpleChanges): void { this.update(); }
	ngOnDestroy(): void { this.subscription.unsubscribe(); }

	private update(): void {
		if (!this.links || !this.linksWithHrefs || !this.router.navigated) return;
		Promise.resolve().then(() => {
			const hasActiveLinks = this.hasActiveLinks();
			if (this.isActive !== hasActiveLinks) {
				(this as any).isActive = hasActiveLinks;
				this.classes.forEach((x) => {
					if (hasActiveLinks) {
						this.renderer.addClass(this.element.nativeElement, x);
					} else {
						this.renderer.removeClass(this.element.nativeElement, x);
					}
				});
			}
		});
	}

	private isLinkActive(router: Router): (link: (RouterLink | RouterLinkWithHref)) => boolean {
		return (link: RouterLink | RouterLinkWithHref) => router.isActive(link.urlTree, this.RouteActiveOptions.exact);
	}

	private hasActiveLinks(): boolean {
		return this.links.some(this.isLinkActive(this.router)) || this.linksWithHrefs.some(this.isLinkActive(this.router));
	}

}
