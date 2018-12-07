import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Tag, TagId, TagType } from '../../models/tag';

const TagIds: any[] = [
	TagId.News,
	// TagId.LastSecond,
	// TagId.LastMinute,
	// TagId.EarlyBooking,
	TagId.Pets,
	TagId.FreeChild,
	TagId.IncludedFlight,
	TagId.IncludedFerry,
	TagId.BeachService,
	TagId.CardClub,
	TagId.Skipass,
	TagId.Wellness,
	TagId.Pool,
	TagId.MiniClub,
	TagId.Animation,
	TagId.NewYearsEveDinner,
	TagId.ChristmasDinner,
	TagId.ChristmasLunch,
	TagId.EasterLunch,
	TagId.Voucher,
	TagId.FreePets
];

@Pipe({
	name: 'hotelTag'
})

@Injectable({
	providedIn: 'root'
})

export class HotelTagPipe implements PipeTransform {
	transform(items: Tag[]): Tag[] {
		return items ? items.filter((x: Tag) => (
			x.category === TagType.Plus ||
			TagIds.indexOf(x.id) !== -1
		)).sort((a: Tag, b: Tag) => a.category - b.category) : null;
	}
}
