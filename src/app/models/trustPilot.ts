

export const TrustPilotMinimumReviews: number = 1;

export class TrustPilot {
	averageStars: number;
	totalReviews: number;

	constructor(options?: TrustPilot) {
		if (options) {
			Object.assign(this, options);
		}
	}
}
