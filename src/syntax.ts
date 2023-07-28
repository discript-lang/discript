export const enum Syntax {
	LBrace, RBrace,
	SingleQuote, DoubleQuote,
	Semicolon, Colon,
	Identifier,
	Login
}

export type LiteralValue =
	| number
	| string
	| boolean
	| null;

export const Keywords = new Map([
	["login", Syntax.Login]
]);

export class Location {
	public constructor(
		public readonly position: number,
		public readonly line: number,
		public readonly file: string
	) {}
}

export class LocationSpan {
	public constructor(
		public readonly begin: Location,
		public readonly end: Location
	) {}
}

export class Token {
	public constructor(
		public readonly lexeme: string,
		public readonly syntax: Syntax,
		public readonly value: LiteralValue,
		public readonly locationSpan: LocationSpan
	) {}
}