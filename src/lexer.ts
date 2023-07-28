import { Token } from "./syntax";

export default class Lexer {
	private readonly tokens: Token[] = [];
	private position = 0;
	private row = 1;
	private line = 1;

	public constructor(
		private readonly source: string
	) {}

	private get isFinished(): boolean {
		return this.position + 1 >= this.source.length
	}

	private at(position: number): string {
		return this.source[position];
	}

	private lex(): void {

	}

	public tokenize(): Token[] {
		while (!this.isFinished);
			this.lex();

		return this.tokens;
	}
}