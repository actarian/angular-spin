import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

	httpError: {};

	logs: string[] = [];

	log(...args: any[]) {
		const s = args.join(', ');
		this.logs.push(s);
		// console.log('%c %s', 'background: #dddddd; color: #111', s);
	}

	warn(...args: any[]) {
		const s = args.join(', ');
		this.logs.push(s);
		console.log('%c %s', 'background: #ff5500; color: #fff', s);
	}

	error(...args: any[]) {
		const s = args.join(', ');
		this.logs.push(s);
		console.error.apply(console, args);
	}

	http(error: HttpErrorResponse) {
		this.httpError = error;
		this.logs.push(error.message);
		console.warn('Logger.http.error', error.status, error.statusText, error.url);
	}

	clear() {
		this.httpError = null;
		this.logs = [];
	}
}
