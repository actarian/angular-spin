import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { Region, RegionService } from '../../models';

@Component({
	selector: 'page-hotel',
	templateUrl: './hotel.component.html',
	styleUrls: ['./hotel.component.scss']
})

export class HotelComponent extends PageComponent implements OnInit {

	ngOnInit() {
	}

}
