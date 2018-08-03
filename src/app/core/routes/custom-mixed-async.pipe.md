import { ChangeDetectorRef, EventEmitter, OnDestroy, Pipe, PipeTransform, WrappedValue, ɵisObservable, ɵisPromise } from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';
// import { invalidPipeArgumentError } from './invalid_pipe_argument_error';

interface SubscriptionStrategy {
	createSubscription(subject: Observable<any> | Promise<any>, updateLatestValue: any): SubscriptionLike | Promise<any>;
	dispose(subscription: SubscriptionLike | Promise<any>): void;
	onDestroy(subscription: SubscriptionLike | Promise<any>): void;
}

class ObservableStrategy implements SubscriptionStrategy {
	createSubscription(subject: Observable<any>, updateLatestValue: any): SubscriptionLike {
		return subject.subscribe({ next: updateLatestValue, error: (e: any) => { throw e; } });
	}
	dispose(subscription: SubscriptionLike): void {
		subscription.unsubscribe();
	}
	onDestroy(subscription: SubscriptionLike): void {
		subscription.unsubscribe();
	}
}

class PromiseStrategy implements SubscriptionStrategy {
	createSubscription(subject: Promise<any>, updateLatestValue: (v: any) => any): Promise<any> {
		return subject.then(updateLatestValue, e => { throw e; });
	}
	dispose(subscription: Promise<any>): void { }
	onDestroy(subscription: Promise<any>): void { }
}

const promiseStrategy = new PromiseStrategy();
const observableStrategy = new ObservableStrategy();

@Pipe({ name: 'customMixedAsync', pure: false })
export class CustomMixedAsyncPipe implements OnDestroy, PipeTransform {

	private value: any = null;
	private lastValue: any = null;
	private subscription: SubscriptionLike | Promise<any> | null = null;
	private subject: Observable<any> | Promise<any> | EventEmitter<any> | null = null;
	private strategy: SubscriptionStrategy = null;

	constructor(
		private changeDetector: ChangeDetectorRef
	) { }

	ngOnDestroy(): void {
		if (this.subscription) {
			this.dispose();
		}
	}

	transform(subject: Observable<any> | Promise<any> | null | undefined): any {
		if (!this.subject) {
			if (subject) {
				this.subscribe(subject);
			}
			this.lastValue = this.value;
			return this.value;
		}
		if (subject !== this.subject) {
			this.dispose();
			return this.transform(subject as any);
		}
		if (this.value === this.lastValue) {
			return this.lastValue;
		}
		this.lastValue = this.value;
		return WrappedValue.wrap(this.value);
	}

	private subscribe(subject: Observable<any> | Promise<any> | EventEmitter<any>): void {
		this.subject = subject;
		this.strategy = this.selectStrategy(subject);
		this.subscription = this.strategy.createSubscription(subject, (value: Object) => this.updateLatestValue(subject, value));
	}

	private selectStrategy(subject: Observable<any> | Promise<any> | EventEmitter<any>): any {
		if (ɵisPromise(subject)) {
			return promiseStrategy;
		}
		if (ɵisObservable(subject)) {
			return observableStrategy;
		}
		// throw invalidPipeArgumentError(AsyncPipe, subject);
	}

	private dispose(): void {
		if (this.subscription) {
			this.strategy.dispose(this.subscription);
		}
		this.value = null;
		this.lastValue = null;
		this.subscription = null;
		this.subject = null;
	}

	private updateLatestValue(subject: any, value: Object): void {
		if (subject === this.subject) {
			this.value = value;
			this.changeDetector.markForCheck();
		}
	}
}
