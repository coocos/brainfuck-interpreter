import * as _mocha from "mocha";
import { expect } from "chai";
import { load, execute } from "./interpreter";

describe("Interpreter", () => {
  it("should increment byte by one", () => {
    let system = load("+");
    expect(system.cells[0]).to.equal(0);
    execute(system);
    expect(system.cells[0]).to.equal(1);
    expect(system.pointers.instruction).to.equal(1);
  });
  it("should decrement byte by one", () => {
    let system = load("-");
    system.cells[0] = 1;
    expect(system.cells[0]).to.equal(1);
    execute(system);
    expect(system.cells[0]).to.equal(0);
    expect(system.pointers.instruction).to.equal(1);
  });
  it("should move data pointer forward by one", () => {
    let system = load(">");
    expect(system.pointers.data).to.equal(0);
    execute(system);
    expect(system.pointers.data).to.equal(1);
    expect(system.pointers.instruction).to.equal(1);
  });
  it("should move data pointer backwards by one", () => {
    let system = load("<");
    system.pointers.data = 1;
    expect(system.pointers.data).to.equal(1);
    execute(system);
    expect(system.pointers.data).to.equal(0);
    expect(system.pointers.instruction).to.equal(1);
  });
});
