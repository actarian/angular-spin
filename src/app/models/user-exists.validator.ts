import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

@Directive({
	selector: '[user-exists][formControlName],[user-exists][formControl],[user-exists][ngModel]',
	providers: [
		{ provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => UserExistsValidator), multi: true }
	]
})
export class UserExistsValidator implements AsyncValidator {

	constructor(
		private userService: UserService
	) { }

	validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
		// self value
		const value = control.value;
		if (!value || value.trim() === '') {
			return of(null);
		}
		// console.log('UserExistsValidator.validate', value);
		return this.userService.exists(value).pipe(
			catchError(() => of(null)),
			switchMap(exists => {
				if (exists) {
					return of({
						exists: true,
					});
				} else {
					return of(null);
				}
			}),
		);
	}

}
