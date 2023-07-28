"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const lexer_1 = tslib_1.__importDefault(require("./lexer"));
const fileName = "../test.ds";
const testContents = (0, fs_1.readFileSync)(fileName);
const lexer = new lexer_1.default(testContents.toString(), fileName);
console.log(lexer.tokenize());
