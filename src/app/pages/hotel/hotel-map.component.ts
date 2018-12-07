import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
// import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { takeUntil } from 'rxjs/operators';
import { Modal, ModalService } from '../../core';
import { DisposableComponent } from '../../core/disposable';
import { MapboxService } from '../../core/plugins';
import { FilterService, Hotel, SearchResult, SearchService } from '../../models';


@Component({
	selector: 'hotel-map-component',
	templateUrl: './hotel-map.component.html',
	styleUrls: ['./hotel-map.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class HotelMapComponent extends DisposableComponent implements AfterViewInit, OnDestroy {

	@ViewChild('map') element: ElementRef;
	map: any;
	map$: Observable<mapboxgl.Map>;
	markers: mapboxgl.Marker[];
	ready: boolean = false;

	hotel: Hotel;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private zone: NgZone,
		private changeDetector: ChangeDetectorRef,
		public search: SearchService,
		public filterService: FilterService,
		public mapboxService: MapboxService,
		private modalService: ModalService,
		private modal: Modal,
	) {
		super();
		this.hotel = this.modal.data as Hotel;
	}

	ngAfterViewInit() {
		this.map$ = this.mapboxService.getMap({
			element: this.element
		});
		if (isPlatformBrowser(this.platformId)) {
			combineLatest(this.map$, this.search.getResults()).pipe(
				takeUntil(this.unsubscribe)
			).subscribe((data: any[]): void => {
				this.zone.runOutsideAngular(() => {
					const map: mapboxgl.Map = data[0];
					const results: SearchResult[] = data[1].filter(result => result.latitude);
					this.onUpdateMapResults(map, results);
					this.zone.run(() => {
						this.map = map;
						this.ready = true;
						this.changeDetector.markForCheck();
					});
				});
			});
		}
	}

	onUpdateMapResults(map: mapboxgl.Map, results: SearchResult[]) {
		const geoJsonResults = this.getGeoJson(results) as GeoJSON.FeatureCollection<mapboxgl.GeoJSONGeometry>;
		if (map) {
			if (map.getSource('results')) {
				const source = map.getSource('results') as mapboxgl.GeoJSONSource;
				source.setData(geoJsonResults);

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
						this.setResult(map, null);
					}
				});
				map.on('click', 'point-interactive', (e) => {
					this.setResult(map, e.features[0].properties);
				});
				// Create a popup, but don't add it to the map yet.
				const popup = new mapboxgl.Popup({
					closeButton: false,
					closeOnClick: false
				});
				map.on('mouseenter', 'point-interactive', function (e) {
					map.getCanvas().style.cursor = 'pointer';
					const coordinates = e.features[0].geometry.coordinates.slice();
					const description = e.features[0].properties.name;
					while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
						coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
					}
					popup.setLngLat(coordinates).setHTML(description).addTo(map);
				});
				map.on('mouseleave', 'point-interactive', function () {
					map.getCanvas().style.cursor = '';
					popup.remove();
				});
				/*
				map.on('mousemove', (e) => {
					const features = map.queryRenderedFeatures(e.point, { layers: ['point-interactive'] });
					map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
				});
				*/
			}

			this.addClusterBackground(map);
			this.addClusterCount(map);
			// this.addPointMarker(map);
			this.addPointPrice(map);
			this.addPointSelected(map);
			this.onBoundHotel(map);
			// this.onBoundResults(map, results);
		}
	}

	private addClusterBackground(map) {
		if (!map.getLayer('cluster-interactive')) {
			map.addLayer({
				id: 'cluster-interactive',
				type: 'circle',
				source: 'results',
				filter: ['has', 'point_count'],
				paint: {
					'circle-color': ['step', ['get', 'point_count'], '#ffffff', 100, '#ffffff', 750, '#ffffff'],
					'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
				}
			});
		}
	}

	private addClusterCount(map) {
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
	}

	private addPointMarker(map) {
		if (!map.getLayer('point-interactive')) {
			map.loadImage('assets/img/map-pin.png', (error, image) => {
				if (error) {
					return;
				}
				map.addImage('map-pin', image);
				map.addLayer({
					id: 'point-interactive',
					type: 'symbol',
					source: 'results',
					// filter: ['!=', ['id'], 1],
					filter: ['!has', 'point_count'],
					paint: {
						'icon-opacity': ['case', ['feature-state', 'selected'], ['number', 0], ['number', 1]],
					},
					/*
					paint: {
						'circle-color': '#1676c1',
						'circle-radius': 15,
						'circle-stroke-width': 1,
						'circle-stroke-color': '#fff'
					},
					*/
					layout: {
						'icon-image': 'map-pin',
					}
				});
			});
		}
	}

	private addPointPrice(map) {
		if (!map.getLayer('point-interactive')) {
			map.loadImage('assets/img/map-text.png', (error, image) => {
				if (error) {
					return;
				}
				map.addImage('map-text', image);
				map.addLayer({
					id: 'point-interactive',
					type: 'symbol',
					source: 'results',
					layout: {
						'text-field': 'da {price} €',
						'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
						'text-offset': [0, 0.6],
						'text-anchor': 'top',
						'text-size': 12,
						'text-letter-spacing': 0.05,
						'text-allow-overlap': true,
						'text-ignore-placement': true,
						'icon-allow-overlap': true,
						'icon-ignore-placement': true,
						'icon-image': 'map-text',
						'icon-text-fit': 'both',
						'icon-text-fit-padding': [
							5,
							10,
							13,
							10
						]
					},
					// filter: ['!=', ['id'], 1],
					filter: ['!has', 'point_count'],
					paint: {
						'icon-opacity': 1,
						'text-color': '#FFFFFF',
						'text-opacity': 1,
					},
					/*
					paint: {
						'circle-color': '#1676c1',
						'circle-radius': 15,
						'circle-stroke-width': 1,
						'circle-stroke-color': '#fff'
					},
					*/
				});
			});
		}
	}

	private addPointSelected(map) {
		if (!map.getLayer('selected-point')) {
			map.loadImage('assets/img/map-selected-pin.png', (error, image) => {
				if (error) {
					return;
				}
				map.addImage('map-selected-pin', image);
				const selectedLayer = map.addLayer({
					id: 'selected-point',
					type: 'symbol',
					source: 'results',
					filter: ['==', 'selected', true],
					layout: {
						'icon-image': 'map-selected-pin',
					}
				});
			});
		}
	}

	setResult(map: mapboxgl.Map, hotel: SearchResult) {
		if (hotel) {
			console.log('HotelMapComponent.onClick', hotel);
			this.zone.run(() => {
				this.modalService.complete(this.modal, hotel);
			});
		}
		/*
		const segments = this.routeService.toRoute([hotel.slug]);
		this.router.navigate(segments);
		*/
		/*
		this.zone.run(() => {
			this.changeDetector.markForCheck();
		});
		*/
	}

	onBoundHotel(map: mapboxgl.Map) {
		console.log('onBoundHotel', this.hotel);
		if (this.hotel) {
			const location: mapboxgl.LngLat = new mapboxgl.LngLat(this.hotel.location.longitude, this.hotel.location.latitude);
			const bounds = new mapboxgl.LngLatBounds(location, location);
			if (bounds) {
				map.fitBounds(bounds, { linear: true, speed: 0, curve: 0, padding: 30, maxZoom: 16, });
			}
		}
	}

	onBoundResults(map: mapboxgl.Map, results: SearchResult[]) {
		const coordinates: mapboxgl.LngLat[] = results.filter(result => result.longitude && result.latitude).map(result => {
			return new mapboxgl.LngLat(result.longitude, result.latitude);
		});
		if (coordinates.length) {
			const bounds = coordinates.reduce((bounds, coord) => {
				return bounds.extend(coord);
			}, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
			if (bounds) {
				// map.fitBounds(bounds, { linear: true, duration: 0, padding: 50, maxZoom: 13 });
				map.fitBounds(bounds, { linear: false, speed: 5, curve: 1, padding: 30, maxZoom: 16, });
			}
		}
	}

	getGeoJson(results: SearchResult[]) {

		const features = results.map(result => {
			return {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [result.longitude, result.latitude, 0.0]
				},
				selected: true,
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
