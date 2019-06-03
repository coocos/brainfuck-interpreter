import * as _mocha from "mocha";
import { expect } from "chai";
import { load } from "./interpreter";

describe("Interpreter", () => {
  it("should do stuff", () => {
    const program = "[]";
    expect(program).to.equal(load(program));
  });
});
