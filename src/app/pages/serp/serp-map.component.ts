import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { MapboxService } from '../../core/plugins';
import { FilterService, SearchResult, SearchService } from '../../models';


@Component({
	selector: 'section-serp-map',
	templateUrl: './serp-map.component.html',
	styleUrls: ['./serp-map.component.scss'],
	exportAs: 'results',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class SerpMapComponent extends DisposableComponent implements AfterViewInit, OnDestroy {

	@ViewChild('map') element: ElementRef;
	map: any;
	map$: Observable<mapboxgl.Map>;
	markers: mapboxgl.Marker[];
	ready: boolean = false;
	hotel: SearchResult;

	constructor(
		private zone: NgZone,
		private changeDetection: ChangeDetectorRef,
		private el: ElementRef,
		private renderer: Renderer2,
		public search: SearchService,
		public filterService: FilterService,
		public mapboxService: MapboxService,
	) {
		super();
	}

	ngAfterViewInit() {
		this.map$ = this.mapboxService.getMap({
			element: this.element
		});
		// todo
		// map.on('move').takeUntil.debouce.distinct. -> search
		combineLatest(this.map$, this.search.resultsFiltered$).pipe(
			takeUntil(this.unsubscribe)
		).subscribe((data: any[]): void => {
			this.zone.runOutsideAngular(() => {
				const map: mapboxgl.Map = data[0];
				const results: SearchResult[] = data[1].filter(result => result.latitude);
				this.onUpdateMapResults(map, results);
				this.zone.run(() => {
					this.map = map;
					this.ready = true;
					this.changeDetection.markForCheck();
				});
			});
		});
	}

	onUpdateMapResults(map: mapboxgl.Map, results: SearchResult[]) {
		const geoJsonResults = this.getGeoJson(results);
		if (map) {
			if (map.getSource('results')) {
				map.getSource('results').setData(geoJsonResults);

			} else {
				map.addSource('results', {
					type: 'geojson',
					data: geoJsonResults,
					cluster: true,
					clusterMaxZoom: 14, // Max zoom to cluster points on
					clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
				});

				map.on('click', (e) => {
					if (!e.features) {
						this.zone.run(() => {
							this.hotel = null;
							this.changeDetection.markForCheck();
							// console.log('SerpMapComponent.onClick', this.hotel);
						});
					}
				});

				map.on('click', 'unclustered-point', (e) => {
					const hotel = e.features[0].properties;
					this.zone.run(() => {
						this.hotel = hotel;
						this.changeDetection.markForCheck();
						// console.log('SerpMapComponent.onClick', this.hotel);
					});
				});
			}

			if (!map.getLayer('clusters')) {
				map.addLayer({
					id: 'clusters',
					type: 'circle',
					source: 'results',
					filter: ['has', 'point_count'],
					paint: {
						'circle-color': [
							'step',
							['get', 'point_count'],
							'#ffffff', 100,
							'#f47c22', 750,
							'#f47c22'
						],
						'circle-radius': [
							'step',
							['get', 'point_count'],
							20, 100,
							30, 750,
							40
						]
					}
				});
			}

			if (!map.getLayer('cluster-count')) {
				map.addLayer({
					id: 'cluster-count',
					type: 'symbol',
					source: 'results',
					filter: ['has', 'point_count'],
					layout: {
						'text-field': '{point_count_abbreviated}',
						'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
						'text-size': 12
					}
				});
			}

			if (!map.getLayer('unclustered-point')) {
				map.loadImage('https://i.imgur.com/MK4NUzI.png', (error, image) => {
					if (error) {
						return;
					}
					map.addImage('custom-marker', image);
					const unclustered = map.addLayer({
						id: 'unclustered-point',
						type: 'symbol',
						source: 'results',
						filter: ['!has', 'point_count'],
						/*
						paint: {
							'circle-color': '#1676c1',
							'circle-radius': 15,
							'circle-stroke-width': 1,
							'circle-stroke-color': '#fff'
						},
						*/
						layout: {
							'icon-image': 'custom-marker',
						}
					});
				});
			}

			this.onBoundresults(map, results);
		}
	}

	onBoundresults(map: mapboxgl.Map, results: SearchResult[]) {
		const coordinates: mapboxgl.LngLat[] = results.map(result => {
			return new mapboxgl.LngLat(result.longitude, result.latitude);
		});
		const bounds = coordinates.reduce((bounds, coord) => {
			return bounds.extend(coord);
		}, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
		// map.fitBounds(bounds, { linear: true, duration: 0, padding: 50, maxZoom: 13 });
		map.fitBounds(bounds, { linear: false, speed: 5, curve: 1, padding: 30, maxZoom: 16, });
	}

	getGeoJson(results: SearchResult[]) {

		const features = results.map(result => {
			return {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [result.longitude, result.latitude, 0.0]
				},
				properties: result,
			};
		});

		const geoJsonResults = {
			type: 'FeatureCollection',
			crs: {
				type: 'name',
				properties: {
					name: 'ResultsFeatures'
				}
			},
			features: features
		};

		return geoJsonResults;
	}

	ngOnDestroy() {
		this.map = null;
		this.markers = null;
	}

}
