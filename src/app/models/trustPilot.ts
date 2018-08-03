
export class TrustPilot {
	averageStars: number;
	totalReviews: number;

	constructor(options?: TrustPilot) {
		if (options) {
			Object.assign(this, options);
		}
	}
}
