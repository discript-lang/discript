import { readFileSync } from "fs";
import Lexer from "./lexer";

const fileName = "test.ds";
const testContents = readFileSync(fileName);
const lexer = new Lexer(testContents.toString(), fileName);
console.log(lexer.tokenize());