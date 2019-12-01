import _ from 'lodash';
import Token from './Token'
import {
  TOKEN_TYPE
} from './utils/constants'

export default class Tokenizer {
  constructor(string) {
    this.regex = string;
    this.currentIndex = 0;
  }

  nextToken() {
    while (this.hasNextToken()) {
      switch (this.regex[this.currentIndex]) {
        case "\\":
          this._read();
          if (this.hasNextToken()) {
            switch (this.regex[this.currentIndex]) {
              case "\\":
                ++this.currentIndex;
                return new Token(TOKEN_TYPE.REGCHAR, "\\");
              case "d":
                ++this.currentIndex;
                return new Token(TOKEN_TYPE.EXTEND, "d");
              case "w":
                ++this.currentIndex;
                return new Token(TOKEN_TYPE.EXTEND, "w");
            }
          }
          throw new Error('Caractere obrigatório após "\\".');
        case "(":
          this._read();
          return new Token(TOKEN_TYPE.LPARENTHESIS, "(");
        case ")":
          this._read();
          return new Token(TOKEN_TYPE.RPARENTHESIS, ")");
        case "{":
          this._read();
          return new Token(TOKEN_TYPE.LBRACE, "{");
        case "}":
          this._read();
          return new Token(TOKEN_TYPE.RBRACE, "}");
        case "[":
          this._read();
          return new Token(TOKEN_TYPE.LBRACKET, "[");
        case "]":
          this._read();
          return new Token(TOKEN_TYPE.RBRACKET, "]");
        case "-":
          this._read();
          return new Token(TOKEN_TYPE.HYPHEN, "-");
        case "+":
          this._read();
          return new Token(TOKEN_TYPE.PLUS, "+");
        case "*":
          this._read();
          return new Token(TOKEN_TYPE.STAR, "*");
        case "?":
          this._read();
          return new Token(TOKEN_TYPE.ALTER, "?");
        case "|":
          this._read();
          return new Token(TOKEN_TYPE.OR, "|");
        case ",":
          this._read();
          return new Token(TOKEN_TYPE.COMMA, ",");
        default:
          if (isValidCharacter(this.regex[this.currentIndex]))
            return new Token(TOKEN_TYPE.REGCHAR, this.regex[this.currentIndex++]);
          throw new Error("Tipo desconhecido " + this.regex[this.currentIndex]);
      }
    }
    return new Token(TOKEN_TYPE.END, "EOF");
  }

  hasNextToken() {
    if (this.regex) return this.currentIndex < this.regex.length;
    return false;
  }

  _read() {
    return ++this.currentIndex;
  }
}

function isValidCharacter(character) {
  return (character >= 'a' && character <= 'z') ||
    (character >= 'A' && character <= 'Z') ||
    (character >= '0' && character <= '9') ||
    character === ' ' || character === '_';
}