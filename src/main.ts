import { readFileSync } from "fs";
import Lexer from "./lexer";

const testContents = readFileSync("../test.ds");
const lexer = new Lexer(testContents);
console.log(lexer.tokenize());