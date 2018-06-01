import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, fromEvent, of } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map } from 'rxjs/operators';

export class OnceEvent extends Event { }

@Injectable()
export class OnceService {

	private uid: number = 0;
	private paths: string[] = [];

	constructor(
		@Inject(PLATFORM_ID) private platformId: string
	) { }

	script(url: string, callback?: string | boolean): Observable<OnceEvent> {
		if (isPlatformBrowser(this.platformId)) {
			if (this.paths.indexOf(url) === -1) {
				this.paths.push(url);
				let callbackName: string;
				if (callback === true) {
					callbackName = 'OnceCallback' + (++this.uid);
					url = url.split('{{callback}}').join(callbackName);
				} else {
					callbackName = callback as string;
				}
				const html: string = `<script type="text/javascript" src="${url}"></script>`;
				const fragment = document.createRange().createContextualFragment(html);
				const scripts = document.getElementsByTagName('script');
				if (scripts.length) {
					const script = scripts[scripts.length - 1];
					script.parentNode.insertBefore(fragment, script.nextSibling);
				}
				if (callback) {
					return fromPromise(
						new Promise((resolve, reject) => {
							window[callbackName] = function (data) {
								resolve(data);
							};
						})
					);
				} else {
					return fromEvent(fragment, 'load').pipe(
						map(x => x as OnceEvent)
					);
				}
			} else {
				return of(new OnceEvent('loaded!'));
			}
		} else {
			return of(null);
		}
	}
}

/*
var id = (paths[path] = paths[path] || ++uid);
                    id = 'OnceScript' + id;
                    if (document.getElementById(id)) {
                        promise.reject();
                    } else {
                        var scripts = document.getElementsByTagName('script');
                        var script = scripts[scripts.length - 1];
                        var node = document.createElement('script');
                        node.id = id;
                        if (callback) {
                            if (callback === true) {
                                callback = id;
                                path = path.split('{{callback}}').join(callback);
                            }
                            window[callback] = function(data) {
                                promise.resolve(data);
                            };
                        } else {
                            node.addEventListener('load', promise.resolve);
                        }
                        node.addEventListener('error', promise.reject);
                        node.src = path;
                        script.parentNode.insertBefore(node, script.nextSibling);
                    }
*/
