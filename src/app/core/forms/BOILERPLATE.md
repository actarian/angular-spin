import { AfterViewInit, Directive, ElementRef, forwardRef, Input, Renderer2 } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, fromEvent, Observable, of } from 'rxjs';
import { catchError, concatMap, debounceTime, take } from 'rxjs/operators';

@Directive({
	selector: '[exists][formControlName],[exists][formControl],[exists][ngModel]',
	providers: [
		{ provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => ExistsValidator), multi: true },
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ExistsValidator), multi: true },
	]
})
export class ExistsValidator implements AsyncValidator, AfterViewInit {

	private values = new BehaviorSubject<string>(null);
	set value(value: string) {
		if (value && value.trim() !== '') {
			this.values.next(value);
		}
	}
	private debounced$: Observable<ValidationErrors | null> = this.values.pipe(
		debounceTime(500),
		concatMap((value: string) => {
			console.log('ExistsValidator.debounced$', value);
			return this.exists$(value);
		}),
		catchError(() => of(null)),
		take(1),
	);

	@Input() exists: Function;

	onChange = (event?: any) => { };
	onTouched = (event?: any) => { };

	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2,
	) { }

	ngAfterViewInit() {
		fromEvent(this.elementRef.nativeElement, 'keyup').pipe(
			debounceTime(500)
		).subscribe((event: MouseEvent) => {
			const target: HTMLInputElement = event.target as HTMLInputElement;
			this.onChange(target.value);
		});
	}

	registerOnChange(fn: () => any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => any): void {
		this.onTouched = fn;
	}

	writeValue(value: any): void {
		this.renderer.setProperty(this.elementRef.nativeElement, 'value', value || '');
	}

	exists$(value: string): Observable<ValidationErrors | null> {
		if (typeof this.exists === 'function') {
			console.log('ExistsValidator.exists$', value);
			return this.exists(value).pipe(
				concatMap(exists => {
					if (exists) {
						return of({
							exists: true,
						});
					} else {
						return of(null);
					}
				}),
			);
		} else {
			return of(null);
		}
	}

	validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
		this.value = control.value;
		return this.debounced$;
	}

}
