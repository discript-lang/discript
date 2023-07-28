"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syntax_1 = require("./syntax");
class Lexer {
    constructor(source, file) {
        this.source = source;
        this.file = file;
        this.tokens = [];
        this.position = 0;
        this.row = 1;
        this.line = 1;
        this.currentLexeme = "";
    }
    get isFinished() {
        return this.position + 1 >= this.source.length;
    }
    get currentCharacter() {
        return this.at(0);
    }
    get currentLocation() {
        return new syntax_1.Location(this.position, this.line, this.file);
    }
    currentIsAlpha() {
        return /^[A-Za-z]$/.test(this.currentCharacter);
    }
    currentIsNumeric() {
        return /^[0-9]$/.test(this.currentCharacter);
    }
    at(offset) {
        return this.source[this.position + offset];
    }
    advance() {
        this.position++;
        this.row++;
        this.currentLexeme += this.currentCharacter;
    }
    resetCurrentLexeme() {
        this.currentLexeme = "";
    }
    newLine() {
        this.advance();
        this.resetCurrentLexeme();
        this.position = 0;
        this.row = 1;
        this.line++;
    }
    match(character) {
        return false;
    }
    addToken(syntax, beginLocation, value = null) {
        const token = new syntax_1.Token(this.currentLexeme, syntax, value, new syntax_1.LocationSpan(beginLocation, this.currentLocation));
        this.tokens.push(token);
    }
    readIdentifier() {
        var _a;
        const beginLocation = this.currentLocation;
        this.advance();
        while (this.currentIsAlpha() || this.currentIsNumeric())
            this.advance();
        const syntax = (_a = syntax_1.Keywords.get(this.currentLexeme)) !== null && _a !== void 0 ? _a : 6;
        this.addToken(syntax, beginLocation);
    }
    lex() {
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
    tokenize() {
        while (!this.isFinished)
            ;
        this.lex();
        return this.tokens;
    }
}
exports.default = Lexer;
