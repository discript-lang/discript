"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.LocationSpan = exports.Location = exports.Keywords = void 0;
exports.Keywords = new Map([
    ["login", 7]
]);
class Location {
    constructor(position, line, file) {
        this.position = position;
        this.line = line;
        this.file = file;
    }
}
exports.Location = Location;
class LocationSpan {
    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
    }
}
exports.LocationSpan = LocationSpan;
class Token {
    constructor(lexeme, syntax, value, locationSpan) {
        this.lexeme = lexeme;
        this.syntax = syntax;
        this.value = value;
        this.locationSpan = locationSpan;
    }
}
exports.Token = Token;
