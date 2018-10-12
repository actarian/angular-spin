/*
	GiftCard Test
	code 0120967
	secret 7410
*/

export enum GiftCardState {
	Active = 0,
	NotActive = 1,
	Freezed = 2,
	Expired = 3,
	Disabled = 4,
	NotFound = 5,
	Unknown = 6
}

export class GiftCardError {
	internalCode?: string;
	message?: string;
}

export class GiftCard {
	activation?: Date | string;
	bookingFileCode?: string;
	code?: string;
	credits?: 0;
	customerRecordCode?: string;
	error?: GiftCardError;
	expire?: Date | string;
	freezeToken?: string;
	freezedCredits?: 0;
	id?: string;
	scheduledJobConsume?: string;
	scheduledJobUnfreeze?: string;
	state?: GiftCardState;

	get codeShort(): string {
		return this.code.substr(this.code.length - 11, 7);
	}

	get stateShort(): string {
		let status = 'Sconosciuto';
		switch (this.state) {
			case GiftCardState.Active:
				status = 'Attiva';
				break;
			case GiftCardState.NotActive:
				status = 'Disattiva';
				break;
			case GiftCardState.Freezed:
				status = 'Bloccata';
				break;
			case GiftCardState.Expired:
				status = 'Scaduta';
				break;
			case GiftCardState.Disabled:
				status = 'Disabilitata';
				break;
			case GiftCardState.NotFound:
				status = 'Sconosciuta';
				break;
		}
		return status;
	}

	get stateLong(): string {
		let status = 'Sconosciuto';
		switch (this.state) {
			case GiftCardState.Active:
				status = 'Attiva';
				break;
			case GiftCardState.NotActive:
				status = 'La carta non è attiva';
				break;
			case GiftCardState.Freezed:
				status = 'La carta è già stata utilizzata';
				break;
			case GiftCardState.Expired:
				status = 'La carta è scaduta';
				break;
			case GiftCardState.Disabled:
				status = 'La carta non è attiva';
				break;
			case GiftCardState.NotFound:
				status = 'codice non valido';
				break;
		}
		return status;
	}

	constructor(options?: any) {
		if (options) {
			Object.assign(this, options);
		}
	}
}
