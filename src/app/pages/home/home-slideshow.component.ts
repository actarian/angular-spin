import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { DisposableComponent, Page, PageIndex } from '../../core';
import { Category, LandingService } from '../../models';

const SWIPER_CONFIG = {
	direction: 'horizontal',
	slidesPerView: 1,
	spaceBetween: 0,
	simulateTouch: false,
	loop: true,
	speed: 600,
	effect: 'fade',
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
		renderBullet: function (index, className) {
			const bullet = this.slides[index + 1].querySelector('.title').textContent;
			return '<span class="' + className + '">' + bullet + '</span>';
		}
	}
};

@Component({
	selector: 'home-slideshow',
	templateUrl: './home-slideshow.component.html',
	styleUrls: ['./home-slideshow.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class HomeSlideshowComponent extends DisposableComponent implements OnInit {

	@Input() type: number;
	limit: number = 4;
	item: Page;
	items: PageIndex[]; // type, destination, time
	categories: Category[] = [];
	config: any = SWIPER_CONFIG;

	constructor(
		private landingService: LandingService,
	) {
		super();
	}

	ngOnInit() {
		this.landingService.getLandings().pipe(
			takeUntil(this.unsubscribe),
			map(x => x.find((p: Page) => p.type === this.type)),
		).subscribe(item => {
			this.item = item;
			this.items = item ? item.related : [];
		});
	}

	onSwiperLoaded(swiper) {
		// console.log(swiper);
		const nodes = Array.prototype.slice.call(document.querySelectorAll('.swiper-pagination-bullet'));
		nodes.forEach((item, i) => {
			item.addEventListener('mouseenter', () => {
				swiper.slideTo(i + 1, 600);
			});
		});
	}
}
