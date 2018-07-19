import { Component, Input } from '@angular/core';
import { TrustPilot } from '../../models';

@Component({
	selector: '[trustPilot]',
	templateUrl: './trust-pilot.component.html',
	styleUrls: ['./trust-pilot.component.scss']
})

export class TrustPilotComponent {

	@Input()
	trustPilot: TrustPilot;

}
