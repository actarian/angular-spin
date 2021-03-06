


import { isPlatformBrowser } from '@angular/common';
import { ElementRef, Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
// import * as mapboxgl from 'mapbox-gl';
import { fromEvent, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../../storage';

export class MapboxConfig {
	public accessToken?: string;
	public style?: string;
}

export class MapboxMapOptions {
	public element: ElementRef;
	public style?: string;
}

@Injectable({
	providedIn: 'root'
})
export class MapboxService {

	private options: MapboxConfig;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private zone: NgZone,
		private storageService: LocalStorageService
	) {
		this.init();
	}

	init(): void {
		if (!environment['plugins'] && !environment['plugins']['mapbox']) {
			throw new Error('MapboxService.error missing config object in environment.plugins.mapbox');
		}
		this.options = Object.assign(new MapboxConfig(), environment['plugins']['mapbox'] as MapboxConfig);
	}

	getMap(options: MapboxMapOptions): Observable<mapboxgl.Map> {
		return this.zone.runOutsideAngular(() => {
			if (isPlatformBrowser(this.platformId)) {
				mapboxgl.accessToken = this.options.accessToken;
				options.style = options.style || this.options.style || 'mapbox://styles/mapbox/streets-v10';
				const map = new mapboxgl.Map({
					container: options.element.nativeElement,
					style: options.style
				});
				const source = fromEvent(map, 'load').pipe(
					concatMap(() => {
						map.resize();
						return of(map);
					})
				);
				return source;
			} else {
				return of(null);
			}
		});
	}

}
