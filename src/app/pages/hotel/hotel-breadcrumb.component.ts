import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DisposableComponent, MenuItem, TaxonomyType } from '../../core';
import { Hotel } from '../../models';

@Component({
	selector: 'hotel-breadcrumb',
	templateUrl: './hotel-breadcrumb.component.html',
	styleUrls: ['./hotel-breadcrumb.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HotelBreadcrumbComponent extends DisposableComponent implements OnInit {

	@Input() hotel: Hotel;
	public items: MenuItem[] = [];

	constructor(
	) {
		super();
	}

	ngOnInit() {
		const tags = this.hotel.tagList;
		if (tags) {
			// this.items.push(new MenuItem({ name: 'Destinazioni', slug: '/destinazioni' }));
			const country = tags.find(t => t.category === TaxonomyType.Country);
			if (country) {
				this.items.push(new MenuItem({ name: this.toTitleCase(country.name), slug: country.slug }));
			} else {
				const region = tags.find(t => t.category === TaxonomyType.Region);
				if (region) {
					this.items.push(new MenuItem({ name: 'Italia', slug: '/destinazioni/italia' }));
					this.items.push(new MenuItem({ name: this.toTitleCase(region.name), slug: region.slug }));
					const province = tags.find(t => t.category === TaxonomyType.Province);
					if (province) {
						this.items.push(new MenuItem({ name: this.toTitleCase(province.name), slug: province.slug }));
					}
				}
			}
		}
	}

	get destinationDescription() {
		const items = this.items;
		const lastItem = this.toTitleCase(items[items.length - 1].name);
		const description = this.toTitleCase(this.hotel.destinationDescription);
		return description !== lastItem ? description : null;
	}

	toTitleCase(name: string): string {
		name = name.replace(/_|-/g, ' ');
		return name.split(' ').map((w: string) => {
			return w.replace(/\w\S*/g, (s: string) => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase());
		}).join(' ');
	}

}
