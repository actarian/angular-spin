import { BirthPlace } from './birth-place';

export const MONTH_CODES = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'H',
	'L',
	'M',
	'P',
	'R',
	'S',
	'T'
];

export const CHECK_CODE_ODD = {
	0: 1,
	1: 0,
	2: 5,
	3: 7,
	4: 9,
	5: 13,
	6: 15,
	7: 17,
	8: 19,
	9: 21,
	A: 1,
	B: 0,
	C: 5,
	D: 7,
	E: 9,
	F: 13,
	G: 15,
	H: 17,
	I: 19,
	J: 21,
	K: 2,
	L: 4,
	M: 18,
	N: 20,
	O: 11,
	P: 3,
	Q: 6,
	R: 8,
	S: 12,
	T: 14,
	U: 16,
	V: 10,
	W: 22,
	X: 25,
	Y: 24,
	Z: 23
};

export const CHECK_CODE_EVEN = {
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	A: 0,
	B: 1,
	C: 2,
	D: 3,
	E: 4,
	F: 5,
	G: 6,
	H: 7,
	I: 8,
	J: 9,
	K: 10,
	L: 11,
	M: 12,
	N: 13,
	O: 14,
	P: 15,
	Q: 16,
	R: 17,
	S: 18,
	T: 19,
	U: 20,
	V: 21,
	W: 22,
	X: 23,
	Y: 24,
	Z: 25
};

export const OMOCODE_TABLE = {
	0: 'L',
	1: 'M',
	2: 'N',
	3: 'P',
	4: 'Q',
	5: 'R',
	6: 'S',
	7: 'T',
	8: 'U',
	9: 'V'
};

export const CHECK_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export class FiscalCode {

	code: string;
	name: string;
	surname: string;
	gender: string;
	birthDate: Date;
	birthPlace: BirthPlace;

	get day() {
		return this.birthDate.getDate();
	}

	set day(d) {
		this.birthDate.setDate(d);
	}

	get month() {
		return this.birthDate.getMonth() + 1;
	}

	set month(m) {
		this.birthDate.setMonth(m - 1);
	}

	get year() {
		return this.birthDate.getFullYear();
	}

	set year(y) {
		this.birthDate.setFullYear(y);
	}

	get nameCode() {
		return this.code.substr(3, 3);
	}

	get surnameCode() {
		return this.code.substr(0, 3);
	}

	get checkCode() {
		return this.code.substr(15, 1);
	}

	static daysInMonth(m, y) {
		switch (m) {
			case 1:
				return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0) ? 29 : 28;
			case 8:
			case 3:
			case 5:
			case 10:
				return 30;
			default:
				return 31;
		}
	}

	static isValidDate(d, m, y) {
		const month = m - 1;
		return month >= 0 && month < 12 && d > 0 && d <= FiscalCode.daysInMonth(month, y);
	}

	static extractConsonants(text) {
		return text.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '');
	}

	static extractVowels(text) {
		return text.replace(/[^AEIOU]/gi, '');
	}

	static getValidDate(d, m = null, y = null) {
		if (typeof d === 'string' && m === null && y === null) {
			return new Date(d);
		} else if (FiscalCode.isValidDate(d, m, y)) {
			return new Date(y, m - 1, d, 0, 0, 0, 0);
		} else {
			throw new Error(`The date ${y}/${m}/${d} is not a valid date`);
		}
	}

	static getCheckCode(codiceFiscale) {
		let val = 0;
		for (let i = 0; i < 15; i = i + 1) {
			const c = codiceFiscale[i];
			val += i % 2 !== 0 ? CHECK_CODE_EVEN[c] : CHECK_CODE_ODD[c];
		}
		val = val % 26;
		return CHECK_CODE_CHARS.charAt(val);
	}

	static check(codiceFiscale) {
		if (typeof codiceFiscale !== 'string') {
			return false;
		}
		let fiscalCode = codiceFiscale.toUpperCase();
		if (fiscalCode.length !== 16) {
			return false;
		}
		const expectedCheckCode = codiceFiscale.charAt(15);
		fiscalCode = codiceFiscale.slice(0, 15);
		return FiscalCode.getCheckCode(fiscalCode) === expectedCheckCode;
	}

	static getGender(gender) {
		if (typeof gender !== 'string') {
			throw new Error('Gender must be a string');
		}
		gender = gender.toUpperCase();
		if (gender !== 'M' && gender !== 'F') {
			throw new Error('Gender must be either \'M\' or \'F\'');
		}
		return gender;
	}

	static compute(fiscalCode): string {
		let code = fiscalCode.getSurnameCode();
		code += fiscalCode.getNameCode();
		code += fiscalCode.getDateCode();
		code += fiscalCode.birthPlace.code;
		code += FiscalCode.getCheckCode(code);
		fiscalCode.code = code;
		return code;
	}

	constructor(
		options?: any
	) {
		if (options) {
			Object.assign(this, options);
		}
	}

	isValid() {
		let code = this.code;
		if (typeof code !== 'string') {
			return false;
		}
		code = code.toUpperCase();
		if (code.length !== 16) {
			return false;
		}
		const checkCode = code.charAt(15);
		code = code.slice(0, 15);
		return FiscalCode.getCheckCode(code) === checkCode;
	}

	getOmocodes() {
		const results = [];
		let code = this.code;
		let lastOmocode = (code = code.slice(0, 15));
		for (let i = code.length - 1; i >= 0; i = i - 1) {
			const char = code[i];
			if (char.match(/\d/) !== null) {
				lastOmocode = `${lastOmocode.substr(0, i)}${OMOCODE_TABLE[char]}${lastOmocode.substr(i + 1)}`;
				results.push(lastOmocode + FiscalCode.getCheckCode(lastOmocode));
			}
		}
		return results;
	}

	getNameCode() {
		let codNome = FiscalCode.extractConsonants(this.name);
		if (codNome.length >= 4) {
			codNome = codNome.charAt(0) + codNome.charAt(2) + codNome.charAt(3);
		} else {
			codNome += `${FiscalCode.extractVowels(this.name)}XXX`;
			codNome = codNome.substr(0, 3);
		}
		return codNome.toUpperCase();
	}

	getSurnameCode() {
		const surnameCode = `${FiscalCode.extractConsonants(this.surname)}${FiscalCode.extractVowels(this.surname)}XXX`;
		return surnameCode.substr(0, 3).toUpperCase();
	}

	getDateCode() {
		let year = `0${this.birthDate.getFullYear()}`;
		year = year.substr(year.length - 2, 2);
		const month = MONTH_CODES[this.birthDate.getMonth()];
		let day = this.birthDate.getDate();
		if (this.gender.toUpperCase() === 'F') {
			day += 40;
		}
		let dayStr = `0${day}`;
		dayStr = dayStr.substr(dayStr.length - 2, 2);
		return String(year + month + dayStr);
	}

	toObject() {
		return {
			name: this.name,
			surname: this.surname,
			gender: this.gender,
			birthDate: this.birthDate.toISOString().slice(0, 10),
			birthPlace: this.birthPlace.name,
			province: this.birthPlace.province,
			code: this.code,
		};
	}

	toString() {
		return this.code;
	}

}
