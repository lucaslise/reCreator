import Parser from '../services/Parser';

describe("parseToDFA and match", () => {
  // | operator
  describe('expression (aba)|(abb)', () => {
    const parser = new Parser("(aba)|(abb)");
    const dfa = parser.parseToDFA();
    const match = input => dfa.match(input).status;

    it("should work", () => expect(match('aba')).toBe(true));
    it("should work", () => expect(match('abb')).toBe(true));
    it("should work", () => expect(match('abc')).toBe(false));
    it("should work", () => expect(match('abaabb')).toBe(false));
    it("should work", () => expect(match("a")).toBe(false));
    it("should work", () => expect(match('')).toBe(false));
  })

  // * operator
  describe("expression (aba)|(abb)*", () => {
    const parser = new Parser("((aba)|(abb))*");
    const dfa = parser.parseToDFA();
    const match = input => dfa.match(input).status;

    it("should work", () => expect(match("")).toBe(true));
    it("should work", () => expect(match("aba")).toBe(true));
    it("should work", () => expect(match("abb")).toBe(true));
    it("should work", () => expect(match("abaaba")).toBe(true));
    it("should work", () => expect(match("abaabb")).toBe(true));
    it("should work", () => expect(match("abbabb")).toBe(true));
    it("should work", () => expect(match("abc")).toBe(false));
    it("should work", () => expect(match("abaabc")).toBe(false));
  });

  // + operator
  describe("expression (aba)|(abb)+", () => {
    const parser = new Parser("((aba)|(abb))+");
    const dfa = parser.parseToDFA();
    const match = input => dfa.match(input).status;

    it("should work", () => expect(match("aba")).toBe(true));
    it("should work", () => expect(match("abb")).toBe(true));
    it("should work", () => expect(match("abaaba")).toBe(true));
    it("should work", () => expect(match("abaabb")).toBe(true));
    it("should work", () => expect(match("abbabb")).toBe(true));
    it("should work", () => expect(match("")).toBe(false));
    it("should work", () => expect(match("abc")).toBe(false));
    it("should work", () => expect(match("abaabc")).toBe(false));
  });

  // ? operator
  describe("expression (aba)|(abb)?", () => {
    const parser = new Parser("((aba)|(abb))?");
    const dfa = parser.parseToDFA();
    const match = input => dfa.match(input).status;

    it("should work", () => expect(match("aba")).toBe(true));
    it("should work", () => expect(match("abb")).toBe(true));
    it("should work", () => expect(match("")).toBe(true));
    it("should work", () => expect(match("abaaba")).toBe(false));
    it("should work", () => expect(match("abaabb")).toBe(false));
    it("should work", () => expect(match("abbabb")).toBe(false));
    it("should work", () => expect(match("abc")).toBe(false));
    it("should work", () => expect(match("abaabc")).toBe(false));
  });

  // \d operator
  describe("expression \d", () => {
    const parser = new Parser("\\d");
    const dfa = parser.parseToDFA();
    const match = input => dfa.match(input).status;

    it("should work", () => expect(match("0")).toBe(true));
    it("should work", () => expect(match("1")).toBe(true));
    it("should work", () => expect(match("2")).toBe(true));
    it("should work", () => expect(match("3")).toBe(true));
    it("should work", () => expect(match("4")).toBe(true));
    it("should work", () => expect(match("5")).toBe(true));
    it("should work", () => expect(match("6")).toBe(true));
    it("should work", () => expect(match("7")).toBe(true));
    it("should work", () => expect(match("8")).toBe(true));
    it("should work", () => expect(match("9")).toBe(true));
    it("should work", () => expect(match("10")).toBe(false));
    it("should work", () => expect(match("a")).toBe(false));
    it("should work", () => expect(match("1a")).toBe(false));
    it("should work", () => expect(match("")).toBe(false));
  });

  // \w operator
  describe("expression \w", () => {
    const parser = new Parser("\\w");
    const dfa = parser.parseToDFA();
    const match = input => dfa.match(input).status;

    it("should work", () => expect(match("0")).toBe(true));
    it("should work", () => expect(match("1")).toBe(true));
    it("should work", () => expect(match("2")).toBe(true));
    it("should work", () => expect(match("3")).toBe(true));
    it("should work", () => expect(match("4")).toBe(true));
    it("should work", () => expect(match("5")).toBe(true));
    it("should work", () => expect(match("6")).toBe(true));
    it("should work", () => expect(match("7")).toBe(true));
    it("should work", () => expect(match("8")).toBe(true));
    it("should work", () => expect(match("9")).toBe(true));
    it("should work", () => expect(match("a")).toBe(true));
    it("should work", () => expect(match("b")).toBe(true));
    it("should work", () => expect(match("c")).toBe(true));
    it("should work", () => expect(match("d")).toBe(true));
    it("should work", () => expect(match("e")).toBe(true));
    it("should work", () => expect(match("f")).toBe(true));
    it("should work", () => expect(match("w")).toBe(true));
    it("should work", () => expect(match("x")).toBe(true));
    it("should work", () => expect(match("y")).toBe(true));
    it("should work", () => expect(match("z")).toBe(true));
    it("should work", () => expect(match("_")).toBe(true));
    it("should work", () => expect(match("10")).toBe(false));
    it("should work", () => expect(match("ab")).toBe(false));
    it("should work", () => expect(match("1a")).toBe(false));
    it("should work", () => expect(match("")).toBe(false));
  });

  describe("currentState", () => {
    const parser = new Parser("(aba)|(abb)");
    const dfa = parser.parseToDFA();
    const state = input => dfa.match(input).currentState;

    it("should work", () => expect(state("a")).toBe("1"));
    it("should work", () => expect(state("ab")).toBe("2"));
    it("should work", () => expect(state("aba")).toBe('3'));
    it("should work", () => expect(state("a")).toBe("1"));
    it("should work", () => expect(state("ab")).toBe("2"));
    it("should work", () => expect(state("abb")).toBe("4"));
    it("should work", () => expect(state("")).toBe('0'));
    it("should work", () => expect(state("abbb")).toBe(null));
    it("should work", () => expect(state("abaa")).toBe(null));
    it("should work", () => expect(state("1")).toBe(null));
  });

  describe("currentState", () => {
    const parser = new Parser("((aba)|(abb))*");
    const dfa = parser.parseToDFA();
    const state = input => dfa.match(input).currentState;

    it("should work", () => expect(state("")).toBe("0"));
    it("should work", () => expect(state("a")).toBe("1"));
    it("should work", () => expect(state("ab")).toBe("2"));
    it("should work", () => expect(state("aba")).toBe("3"));
    it("should work", () => expect(state("a")).toBe("1"));
    it("should work", () => expect(state("ab")).toBe("2"));
    it("should work", () => expect(state("abb")).toBe("4"));
    it("should work", () => expect(state("abb")).toBe("4"));
    it("should work", () => expect(state("abaa")).toBe("1"));
    it("should work", () => expect(state("abaab")).toBe('2'));
    it("should work", () => expect(state("abaaba")).toBe("3"));
    it("should work", () => expect(state("abaabaa")).toBe("1"));
    it("should work", () => expect(state("abaabaab")).toBe("2"));
    it("should work", () => expect(state("abaabaabb")).toBe("4"));
    it("should work", () => expect(state("abaabaabbabaabaabbabaabaabb")).toBe("4"));
    it("should work", () => expect(state("abb")).toBe('4'));
    it("should work", () => expect(state("abaabaabbc")).toBe(null));
    it("should work", () => expect(state("c")).toBe(null));
    it("should work", () => expect(state("1")).toBe(null));
    it("should work", () => expect(state("_")).toBe(null));
  });


  describe("brackets", () => {
    const parser = new Parser("[a-d]");
    const dfa = parser.parseToDFA();
    const state = input => dfa.match(input).status;

    it("should work", () => expect(state("a")).toBe(true));
    it("should work", () => expect(state("b")).toBe(true));
    it("should work", () => expect(state("c")).toBe(true));
    it("should work", () => expect(state("d")).toBe(true));
    it("should work", () => expect(state("0")).toBe(false));
    it("should work", () => expect(state("")).toBe(false));
  });
});