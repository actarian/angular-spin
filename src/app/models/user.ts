// import { Document } from '../core/models';

/*
export class User {
	id: number | string;
	name: string;
	firstName: string;
	lastName: string;
	email: string;
	slug?: string;

	// aves
	recordCode?: string;
	birthDate?: Date | string;
	birthCity?: string;
	birthCounty?: string;
	nationality?: string;
	cityName?: string;
	countyCode?: string;
	stateCode?: string;
}
*/

export class User {
	id: number | string;
	firstName?: string;
	lastName?: string;
	email?: string;

	address?: string;
	zipCode?: string;
	countyCode?: string;
	stateCode?: string;
	cityName?: string;
	firstPhoneNumber?: string;
	mobilePhoneNumber?: string;
	birthDate?: Date | string;
	birthCity?: string;
	birthCounty?: string;
	categoryCode?: string;
	financialDetail?: UserFinancialDetail;
	fiscalCode?: string;
	recordCode?: string;
	isLogged?: boolean;

	accessToken?: string;

	constructor(user?: any) {
		if (user) {
			Object.assign(this, user);
			if (user.birthDate && String(user.birthDate).indexOf('0001-01-01') === 0) {
				this.birthDate = null;
			}
		}
	}
}

export class UserAuth extends User {
	accessToken?: string;
	facebookToken?: string;
	googleToken?: string;
	password: string;
	acceptPrivacyPolicies?: boolean;
	acceptNewsletterPolicies?: boolean;

}

export class UserSignIn extends UserAuth {
	passwordReveal?: boolean; // todo
	rememberMe?: boolean; // todo
}

export class UserSignUp extends UserAuth {
	emailConfirm?: string; // todo
	passwordReveal?: boolean = true; // todo
}

export class UserSignForgotten {
	email: string;
}

export class UserFinancialDetail {
	creditLimit: number;
	c_PaymentType: number;
	s_PaymentType: number;
	enableElectronicInvoicing: false;
}

export class UserRegister {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;

	address?: string;
	zipCode?: string;
	cityName?: string;
	countyCode?: string;
	stateCode?: string;

	gender?: string;
	birthDate?: Date | string;
	birthCity?: string;
	birthCounty?: string;
	nationality?: string;

	fiscalCode?: string;
	vatCode?: string;

	citizenshipCode?: string;
	areaCode?: string;

	verifyDiscount?: boolean;

	isLogged?: boolean;

	name?: string;
	createdDate?: Date | string;
	modifiedDate?: Date | string;
	recordType?: number;
	loginType?: number;
	recordStatus?: number;
	thirdPartRecordCode?: string;
	moniker?: string;
	searchField?: string;
	extraInfo?: string;
	languageCode?: string;
	zoneCode?: string;
	branchOfficeCode?: string;
	categoryCode?: string;
	activityCode?: string;
	promoterCode?: string;
	networkCode?: string;
	firstPhoneNumber?: string;
	secondPhoneNumber?: string;
	faxNumber?: string;
	mobilePhoneNumber?: string;
	webUrl?: string;
	encryptedPassword?: boolean;
	priceListCode?: string;
	costListCode?: string;
	discountCode?: string;
	cardNumber?: string;
	badgeNumber?: string;
	electronicInvoiceCertifiedMail?: string;
	refMasterRecords?: {
		billingRefCode?: string;
		paymentRefCode?: string;
		voucherRefCode?: string;
		supplierRefCode?: string;
	};
	idDocumentDetail?: {
		idType?: string;
		idCode?: string;
		idIssueLocation?: string;
		idIssueCounty?: string;
		idIssueDate?: Date | string;
		idExpireDate?: Date | string;
	};
	financialDetail?: {
		currencyCode?: string;
		creditLimit?: number;
		c_PaymentType?: number;
		c_SpecPaymentTypeCode?: string;
		c_BookingPayConditionCode?: string;
		c_BillingPayConditionCode?: string;
		c_CodMastro?: string;
		c_CodConto?: string;
		s_PaymentType?: number;
		s_SpecPaymentTypeCode?: string;
		s_BookingPayConditionCode?: string;
		s_BillingPayConditionCode?: string;
		s_CodMastro?: string;
		s_CodConto?: string;
		enableElectronicInvoicing?: true
	};
	bankDetail?: {
		name?: string;
		branchOffice?: string;
		location?: string;
		countyCode?: string;
		ibanCode?: string;
		swiftCode?: string;
	};
	paInfo?: {
		paOfficeCode?: string;
		paAdministrativeRefCode?: string;
		vatSplitPaymentEnabled?: boolean;
		eInvoicingEnabled?: true
	};
	carrierDetail?: {
		carrierType?: number;
		iataCode?: string;
		carrierNumber?: string;
		bspAssociated?: true
	};
	natFlightCommission?: {
		supplierRecordCode?: string;
		amount?: 0
	};
	interFlightCommission?: {
		supplierRecordCode?: string;
		amount?: 0
	};
	natRailCommission?: {
		supplierRecordCode?: string;
		amount?: 0
	};
	interRailCommission?: {
		supplierRecordCode?: string;
		amount?: 0
	};
	interNavalCommission?: {
		supplierRecordCode?: string;
		amount?: 0
	};
	associatedTravelAgents?: [
		{
			code?: string;
			name?: string;
			birthDate?: Date | string;
		}
	];
	notes?: [
		{
			nType?: number;
			title?: string;
			value?: string;
		}
	];
	accountPolicies?: {
		acceptProfilingPolicies?: boolean;
		acceptPrivacyPolicies?: boolean;
		acceptNewsletterPolicies?: true
	};
	recordCode?: string;
	insertCriteria?: string;
	placeEmissionDocument?: string;
	roomingNote?: string;
}
