export const enum Syntax {
	LBrace, RBrace,
	SingleQuote, DoubleQuote,
	Login
}

export type LiteralValue =
	| number
	| string
	| boolean;

export const Keywords = {
	"login": Syntax.Login
};

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