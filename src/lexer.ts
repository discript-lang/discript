import { LiteralValue, LocationSpan, Location, Token, Syntax, Keywords } from "./syntax";

export default class Lexer {
	private readonly tokens: Token[] = [];
	private position = 0;
	private row = 1;
	private line = 1;
	private currentLexeme = "";

	public constructor(
		private readonly source: string,
		private readonly file: string
	) {}

	private get isFinished(): boolean {
		return this.position + 1 >= this.source.length
	}

	private get currentCharacter(): string {
		return this.at(0);
	}

	private get currentLocation(): Location {
		return new Location(this.position, this.line, this.file);
	}

	private currentIsAlpha(): boolean {
		return /^[A-Za-z]$/.test(this.currentCharacter);
	}

	private currentIsNumeric(): boolean {
		return /^[0-9]$/.test(this.currentCharacter);
	}

	private at(offset: number): string {
		return this.source[this.position + offset];
	}

	private advance(): void {
		this.position++;
		this.row++;
		this.currentLexeme += this.currentCharacter;
	}

	private resetCurrentLexeme(): void {
		this.currentLexeme = "";
	}

	private newLine() {
		this.advance();
		this.resetCurrentLexeme();
		this.position = 0;
		this.row = 1;
		this.line++;
	}

	private match(character: string): boolean {
		return false;
	}

	private addToken(syntax: Syntax, beginLocation: Location, value: LiteralValue = null): void {
		const token = new Token(this.currentLexeme, syntax, value, new LocationSpan(beginLocation, this.currentLocation));
		this.tokens.push(token);
	}

	private readIdentifier(): void {
		const beginLocation = this.currentLocation;
		this.advance();
		while (this.currentIsAlpha() || this.currentIsNumeric())
			this.advance();

		const syntax = Keywords.get(this.currentLexeme) ?? Syntax.Identifier;
		this.addToken(syntax, beginLocation);
	}

	private lex(): void {
		switch (this.currentCharacter) {
			case "\n":
				this.newLine();
				break;
			default: {
				if (this.currentIsAlpha())
					return this.readIdentifier();

				throw new Error(`Unexpected character: ${this.currentCharacter}`);
			}
		}
	}

	public tokenize(): Token[] {
		while (!this.isFinished);
			this.lex();

		return this.tokens;
	}
}