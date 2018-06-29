import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
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
	exportAs: 'results'
})

export class SerpMapComponent extends DisposableComponent implements AfterViewInit, OnDestroy {

	@ViewChild('map') elementRef: ElementRef;
	map: any;

	map$: Observable<mapboxgl.Map>;
	markers: mapboxgl.Marker[];

	constructor(
		private el: ElementRef,
		private renderer: Renderer2,
		public search: SearchService,
		public filterService: FilterService,
		public mapboxService: MapboxService,
	) {
		super();
	}

	ngAfterViewInit() {
		this.map$ = this.mapboxService.getMap({ elementRef: this.elementRef });
		// todo
		// map.on('move').takeUntil.debouce.distinct. -> search
		combineLatest(this.map$, this.search.resultsFiltered$).pipe(
			takeUntil(this.unsubscribe)
		).subscribe((data: any[]): void => {
			const map: mapboxgl.Map = data[0];
			const results: SearchResult[] = data[1].filter(result => result.latitude);
			if (map) {
				if (this.markers) {
					this.markers.forEach(marker => marker.remove());
				}
				const markers = results.map(result => {
					const marker = new mapboxgl.Marker().setLngLat([result.longitude, result.latitude]);
					marker.addTo(map);
					return marker;
				});
				this.markers = markers;
				const coordinates: mapboxgl.LngLat[] = results.map(result => {
					return new mapboxgl.LngLat(result.longitude, result.latitude);
				});
				const bounds = coordinates.reduce((bounds, coord) => {
					return bounds.extend(coord);
				}, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
				map.fitBounds(bounds, { linear: true, duration: 0, padding: 50, maxZoom: 13 });
				/*
				map.fitBounds(bounds, {
					speed: 5,
					curve: 1,
					padding: 30,
					linear: false,
					maxZoom: 16,
				});
				*/
				console.log('SearchResultMapComponent', bounds);
				this.map = map;
			}
		});
	}

	ngOnDestroy() {
		this.map = null;
		this.markers = null;
	}

}

/*

(function () {
    "use strict";

    var app = angular.module('app');

    app.directive('mapboxViewer', ['$http', '$timeout', '$compile', 'GoogleMaps', function ($http, $timeout, $compile, googleMaps) {
        if (!mapboxgl) {
            return;
        }
        mapboxgl.accessToken = 'pk.eyJ1IjoiZmljb3dzZGV2IiwiYSI6ImNqNXJzajVobTB5cW8yd25tejhqcjN2c3kifQ.CsUfBV2eN2ftVELq0xwlGA'; // 'pk.eyJ1IjoiYWN0YXJpYW4iLCJhIjoiY2lqNWU3MnBzMDAyZndnbTM1cjMyd2N2MiJ9.CbuEGSvOAfIYggQv854pRQ';

        var position = {
            lng: 11.411248,
            lat: 44.515702,
        };

        var defaults = {
            center: [position.lng, position.lat],
            zoom: 17.63,
            pitch: 53,
            bearing: -11.68,
            speed: 1.5,
            curve: 1,
        };

        return {
            restrict: 'A',
            scope: {
                sources: '=mapboxViewer',
            },
            link: link,
        };

        function link(scope, element, attributes, model) {
            var map, markers, marker, geocoder, bounds, canvas, dragging, overing;

            init();

            var types = {
                DOCUMENT: 1,
                EVENT: 2,
                INFO: 3,
            };

            function getOptions(options) {
                return angular.extend(angular.copy(defaults), options);
            }

            function getMarker(item) {
                var $scope = scope.$new(true);
                $scope.item = item;
                var node = document.createElement('div');
                node.id = 'point';
                node.className = 'marker ' + item.area.code;
                node.className += item.type === types.INFO ? ' info' : '';
                node.setAttribute('marker', 'item');
                var marker = new mapboxgl.Marker(node, { offset: [-10, -10] })
                    .setLngLat([item.position.lng, item.position.lat])
                    .addTo(map);
                var markerElement = angular.element(node);
                markerElement.on('click', function (e) {
                    // console.log('marker.click', item);
                    scope.$emit('onMarkerClicked', item);
                });
                $compile(markerElement)($scope); // Compiling marker
                return marker;
            }

            function addMarkers(items) {
                if (markers) {
                    angular.forEach(markers, function (item) {
                        item.remove();
                    });
                }
                markers = [];
                if (items) {
                    angular.forEach(items, function (item) {
                        marker = getMarker(item);
                        markers.push(marker);
                    });
                }
            }

            function flyTo(position) {
                var options = getOptions({
                    center: [position.lng, position.lat],
                    zoom: 20,
                });
                map.flyTo(options);
            }

            function jumpTo(position) {
                var options = getOptions({
                    center: [position.lng, position.lat],
                    zoom: 20,
                });
                map.jumpTo(options);
            }

            function flyToMarker(item) {
                // console.log(item);
                flyTo(item.position);
            }

            function jumpToMarker(item) {
                jumpTo(item.position);
            }

            function init() {
                map = getMap();
                navToCenter();
                scope.$watch('sources', function (sources) {
                    if (sources) {
                        sources.addMarkers = addMarkers;
                        sources.jumpToMarker = jumpToMarker;
                        sources.flyToMarker = flyToMarker;
                    }
                });
            }

            function getMap() {
                var map = new mapboxgl.Map({
                    container: element[0],
                    style: 'mapbox://styles/ficowsdev/cj8cztc3r8nv32sl5npfr1yip', // 'mapbox://styles/ficowsdev/cj5rsloo232ad2sq9capz9atk', // 'mapbox://styles/mapbox/light-v9', // 'mapbox://styles/actarian/cj5nwbngd1p2z2sqh74l5qwlq',
                    interactive: true,
                    logoPosition: 'bottom-right',
                    center: [position.lng, position.lat],
                    zoom: 6,
                });

                canvas = map.getCanvasContainer();

                return map;
            }

            function geocodeAddress(address) {
                geocoder.geocode({ 'address': address }, function (results, status) {
                    $timeout(function () {
                        if (status === 'OK') {
                            sources.results = googleMaps.parse(results);
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                });
            }

            function reverseGeocode(position) {
                // console.log('reverseGeocode', position);
                geocoder.geocode({ 'location': position }, function (results, status) {
                    $timeout(function () {
                        if (status === 'OK') {
                            sources.results = googleMaps.parse(results);
                        } else {
                            console.log('Geocoder failed due to: ' + status);
                        }
                    });
                });
            }

            function geolocalize() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (p) {
                        $timeout(function () {
                            position = { lat: p.coords.latitude, lng: p.coords.longitude };
                            flyTo(position);
                            reverseGeocode(position);
                        });
                    }, function (e) {
                        console.log('error', e);
                    });
                } else {
                    console.log('error', 'Browser doesn\'t support Geolocation');
                }
            }

            function flyToFico() {
                var position = {
                    lng: 11.411248,
                    lat: 44.515702,
                };
                map.flyTo({
                    center: [
                        parseFloat(position.lng),
                        parseFloat(position.lat)
                    ],
                    zoom: 17.63,
                    pitch: 53,
                    bearing: -11.68,
                    speed: 1.5,
                    curve: 1,

                });
            }

            function navToCenter() {
                var position = {
                    lng: 11.411248,
                    lat: 44.515702,
                };
                map.jumpTo({
                    center: [
                            parseFloat(position.lng),
                            parseFloat(position.lat)
                    ],
                    zoom: 17.63,
                    pitch: 53,
                    bearing: -11.68,
                });
            }

            function fitBounds(bounds) {
                map.fitBounds(bounds, {
                    speed: 1.5,
                    curve: 1,
                    padding: 30,
                    linear: false,
                    maxZoom: 8,
                });
            }
        }
    }]);

    app.directive('marker', ['$http', '$timeout', function ($http, $timeout) {
        return {
            restrict: 'A',
            scope: {
                item: '=marker',
            },
            template:   '<div class="inner">' +
                        '   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">' +
                        '       <path d="M12 0c-5.522 0-10 4.395-10 9.815 0 5.505 4.375 9.268 10 14.185 5.625-4.917 10-8.68 10-14.185 0-5.42-4.478-9.815-10-9.815zm0 18c-4.419 0-8-3.582-8-8s3.581-8 8-8 8 3.582 8 8-3.581 8-8 8z"/>' +
                        '   </svg>' +
                        '   <span ng-bind="item.code"></span>' +
                        '</div>',
            link: link,
        };
        function link(scope, element, attributes, model) {
            // console.log('marker', scope.item);
        }

    }]);

    app.service('GoogleMaps', ['$q', '$http', function ($q, $http) {

        var _key = 'AIzaSyAYuhIEO-41YT_GdYU6c1N7DyylT_OcMSY';
        var _init = false;

        this.maps = maps;
        this.geocoder = geocoder;
        this.parse = parse;

        function maps() {
            var deferred = $q.defer();
            if (_init) {
                deferred.resolve(window.google.maps);
            } else {
                window.googleMapsInit = function () {
                    deferred.resolve(window.google.maps);
                    window.googleMapsInit = null;
                    _init = true;
                };
                var script = document.createElement('script');
                script.setAttribute('async', null);
                script.setAttribute('defer', null);
                script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=' + _key + '&callback=googleMapsInit');
                document.body.appendChild(script);
            }
            return deferred.promise;
        }

        function geocoder() {
            var service = this;
            var deferred = $q.defer();
            maps().then(function (maps) {
                var _geocoder = new maps.Geocoder();
                deferred.resolve(_geocoder);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getType(type, item) {
            var types = {
                street: 'route',
                number: 'street_number',
                locality: 'locality',
                postalCode: 'postal_code',
                city: 'administrative_area_level_3',
                province: 'administrative_area_level_2',
                region: 'administrative_area_level_1',
                country: 'country',
            };
            var label = null;
            angular.forEach(item.address_components, function (c) {
                angular.forEach(c.types, function (t) {
                    if (t === types[type]) {
                        label = c.long_name;
                    }
                });
            });
            return label;
        }

        function parse(results) {
            var items = null;
            if (results.length) {
                items = results.filter(function (item) {
                    return true;
                }).map(function (item) {
                    return {
                        name: item.formatted_address,
                        street: getType('street', item),
                        number: getType('number', item),
                        locality: getType('locality', item),
                        postalCode: getType('postalCode', item),
                        city: getType('city', item),
                        province: getType('province', item),
                        region: getType('region', item),
                        country: getType('country', item),
                        position: {
                            lng: item.geometry.location.lng(),
                            lat: item.geometry.location.lat(),
                        }
                    };
                });
            }
            console.log('googleMaps.parse', results, items);
            return items;
        }

    }]);

    app.directive('mapisoViewer', ['$http', '$timeout', 'GoogleMaps', function ($http, $timeout, googleMaps) {
        return {
            restrict: 'A',
            link: link,
        };
        function link(scope, element, attributes, model) {
            scope.$watch('map.items', function (items) {
                console.log('mapisoViewer', items);
            });
        }
    }]);

    app.directive('mapisoMarker', ['$http', '$timeout', function ($http, $timeout) {

        var tileSize = 256.0;
        var DegreesToRadiansRatio = 180 / Math.PI;
        var RadiansToDegreesRatio = Math.PI / 180;
        var center = { x: 0, y: 0 };
        var XPixelsToDegreesRatio;
        var YPixelsToRadiansRatio;

        return {
            restrict: 'A',
            scope: {
                item: '=mapisoMarker',
            },
            link: link,
        };

        function link(scope, element, attributes, model) {
            scope.$watch('item', function (item) {
                console.log('mapisoMarker', item);

                var topleft = {
                    lat: 44.519142,
                    lng: 11.407176,
                }

                var scale = 16;
                gmapProjection(scale);
                var p = coordinatesToPixel({
                    x: item.latitude - topleft.lat,
                    y: item.longitude - topleft.lng
                });
                console.log('p', p);

                p.x -= 8388400;
                p.y -= 8388400;

                p.x *= 5.5;
                p.y *= 5.5;

                element[0].style = 'left:' + p.x + 'px; top:' + p.y + 'px;';

            });
        }

        function gmapProjection(scale) { // double
            var pixelGlobeSize = tileSize * Math.pow(2, scale);
            XPixelsToDegreesRatio = pixelGlobeSize / 360.0;
            YPixelsToRadiansRatio = pixelGlobeSize / (2.0 * Math.PI);
            var halfPixelGlobeSize = pixelGlobeSize / 2.0;
            center.x = halfPixelGlobeSize;
            center.y = halfPixelGlobeSize;
            console.log('gmapProjection', halfPixelGlobeSize);
        }

        function coordinatesToPixel(point) {
            var x = Math.round(center.x + (point.x * XPixelsToDegreesRatio));
            var f = Math.min(Math.max(Math.sin(point.y * RadiansToDegreesRatio), -0.9999), 0.9999);
            var y = Math.round(center.y + 0.5 * Math.log((1.0 + f) / (1.0 - f)) * -YPixelsToRadiansRatio);
            return { x: x, y: y };
        }

    }]);

}());
*/


/*
(function () {
    "use strict";

    var app = angular.module('app');

    app.controller('MapCtrl', ['$scope', '$q', '$sce', '$timeout', 'State', 'Utils', 'api', 'CONFIG', function ($scope, $q, $sce, $timeout, State, Utils, api, CONFIG) {

        var state = new State();
        var loc = CONFIG.app.locale;

        var colors = {
            'green': '#006435',
            'purple': '#52459b',
            'farms': '#46a648',
            'factories': '#f0d3a4',
            'restaurants': '#f4d552',
            'shops': '#da9441',
            'education': '#6a459e',
            'events': '#36c8e9',
            'places': '#006435',
        };

        var types = {
            PLACE: 1,
            EVENT: 2,
            INFO: 3,
        };

        var modes = {
            PLACES: 1,
            EVENTS: 2,
        };

        var sources = {
            colors: colors,
            types: types,
            modes: modes,
            mode: modes.PLACES,
            pools: {
                tags: {},
                places: {},
                events: {},
            },
        };

        state.ready();

        $q.all([
            api.data.tag().then(onParseTags),
            api.map.all().then(onParsePois),
            api.areas.all().then(onParsePlaces),
            api.booking.search.in({
                adults: 1,
                flexibleDate: true,
            }).then(onParseEvents)

        ]).then(function success(response) {
            state.success();
            Init();

        }, function error(response) {
            console.log('MapCtrl.$q.error', response);
            state.error(response);
        });

        function getArea(item) {
            var area = null;
            if (item.tags) {
                angular.forEach(item.tags, function (tag) {
                    if (tag.category === 2) {
                        area = tag;
                    }
                });
            }
            return area;
        }

        function getEventPoi(item) {
            var poi = null;
            if (item.tags) {
                angular.forEach(item.tags, function (tag) {
                    if (tag.category === 3) {
                        poi = tag;
                    }
                });
            }
            return poi;
        }

        function onParseTags(response) {
            try {
                var all = response.data;
                angular.forEach(all, function (item) {
                    if (item.category < 3) {
                        sources.pools.tags[item.id] = item;
                    }
                });
                sources.tags = {
                    all: all,
                };
                console.log('MapCtrl.onParseTags', sources.pools.tags);
            } catch (e) {
                console.log('MapCtrl.onParseTags.error', e);
            }
        }

        function onParsePois(response) {
            sources.pois = response.data;
            angular.forEach(sources.pois, function (item) {
                item.nameTrusted = $sce.trustAsHtml(item.name);
            });
        }

        function onParsePlaces(response) {
            sources.places = response.data;
        }

        function onParseEvents(response) {
            sources.events = response.data;
            var pool = {};
            angular.forEach(sources.events, function (item) {
                var poi = getEventPoi(item);
                if (poi) {
                    // console.log('onParseEvents', item);
                    item.frontEndNameTrusted = $sce.trustAsHtml(item.frontEndName);
                    item.abstractTrusted = $sce.trustAsHtml(item.abstract);
                    item.textTrusted = $sce.trustAsHtml(item.text);
                    pool[poi.id] = item;
                }
            });
            sources.pools.events = pool;
        }

        function doFillPlaces() {
            try {
                var pool = {};
                function filldocs(list, tags) {
                    angular.forEach(list, function (item) {
                        tags = tags || [];
                        var tag = sources.pools.tags[item.id];
                        if (tag && tag.code) {
                            tags.push(tag);
                        }
                        item.tags = tags;
                        var poi = item.pointOfInterest;
                        if (poi) {
                            item.type = types.PLACE;
                            item.nameTrusted = $sce.trustAsHtml(item.name);
                            item.abstractTrusted = $sce.trustAsHtml(item.abstract);
                            item.textTrusted = $sce.trustAsHtml(item.text);
                            pool[poi.id] = item;
                        }
                        if (item.categories) {
                            filldocs(item.categories, tags);
                        }
                        if (item.documents) {
                            filldocs(item.documents, tags);
                        }
                    });
                }
                filldocs(sources.places);
                sources.pools.places = pool;
                console.log('Map.doFillPlaces', pool);
            } catch (e) {
                console.log('Map.doFillPlaces.error', e);
            }
        }

        function doFilterPois() {
            var pois = [];
            switch (sources.mode) {
                case sources.modes.PLACES:
                    pois = sources.pois.filter(function (item) {
                        var defaultArea = { id: 0, name: 'Places', code: 'places' };
                        var place = sources.pools.places[item.id];
                        if (place) {
                            item.type = types.PLACE;
                            item.tags = place.tags;
                            item.area = getArea(place) || defaultArea;
                            item.related = place;
                            return true;
                        } else if (!sources.pools.events[item.id]) {
                            item.type = types.INFO;
                            item.tags = [];
                            item.area = defaultArea;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    break;
                case sources.modes.EVENTS:
                    pois = sources.pois.filter(function (item) {
                        var defaultArea = { id: 0, name: 'Events', code: 'events' };
                        var event = sources.pools.events[item.id];
                        if (event) {
                            item.type = types.EVENT;
                            item.tags = event.tags;
                            item.area = getArea(event) || defaultArea;
                            item.related = event;
                            return true;
                        } else if (!sources.pools.places[item.id]) {
                            item.type = types.INFO;
                            item.tags = [];
                            item.area = defaultArea;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    break;
            }
            pois = pois.map(function (item) {
                item = {
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    area: item.area,
                    type: item.type,
                    tags: item.tags,
                    related: item.related,
                    position: {
                        lng: item.longitude,
                        lat: item.latitude,
                    }
                };
                return item;
            });
            // console.log('MapCtrl.doFilterPois', pois.length);
            sources.addMarkers(pois);
            return pois;
        }

        function Init() {
            try {
                doFillPlaces();
                var query = Utils.getQuerystring();
                if (query.poiId) {
                    if (sources.pools.events[query.poiId]) {
                        sources.mode = modes.EVENTS;
                    } else {
                        sources.mode = modes.PLACES;
                    }
                }
                var pois = doFilterPois();
                if (query.poiId) {
                    angular.forEach(pois, function (item) {
                        if (item.id === parseInt(query.poiId)) {
                            sources.poi = item;
                        }
                    });
                    if (sources.poi) {
                        sources.flyToMarker(sources.poi);
                    }
                }
                console.log('Map.Init', query);
            } catch (e) {
                console.log('Map.Init.error', e);
            }
        }

        function onSelectItem(item) {
            // console.log('MapCtrl.onSelectItem', item);
            item.opened = !item.opened;
        }

        function onSetMode(mode) {
            if (sources.mode !== mode) {
                sources.mode = mode;
                doFilterPois();
            }
        }

        $scope.$on('onMarkerClicked', function (scope, poi) {
            $timeout(function () {
                sources.poi = poi;
                sources.flyToMarker(sources.poi);
                // sources.item = sources.pools.places[poi.id]; // dettaglio scheda o evento
                // console.log('MapCtrl.onMarkerClicked', sources.poi, sources.item);
            });
        });

        $scope.state = state;
        $scope.loc = loc;
        $scope.sources = sources;
        $scope.onSelectItem = onSelectItem;
        $scope.onSetMode = onSetMode;
    }]);

}());
*/
