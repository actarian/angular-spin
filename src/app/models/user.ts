import { Document } from '../core/models';

export class User implements Document {
	id: number;
	name: string;
	firstName: string;
	lastName: string;
	email: string;
	slug?: string;
}

export class UserAuth extends User {
	accessToken?: string;
	facebookToken?: string;
	googleToken?: string;
	password: string;
	privacyAccepted?: boolean;
}

export class UserSignIn extends UserAuth {
	passwordReveal?: boolean; // todo
	rememberMe?: boolean; // todo
}

export class UserSignUp extends UserAuth {
	emailConfirm?: string; // todo
	passwordReveal?: boolean; // todo
}

export class UserSignForgotten {
	email: string;
}
