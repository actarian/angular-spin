import { Component, OnInit } from '@angular/core';
import { Logger } from './logger';

@Component({
	selector: 'app-logger',
	templateUrl: './logger.component.html',
	styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {
	constructor(public logger: Logger) { }

	ngOnInit() {
	}
}
