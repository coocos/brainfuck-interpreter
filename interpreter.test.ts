import * as _mocha from "mocha";
import { expect } from "chai";
import { load, step, execute } from "./interpreter";

describe("Interpreter", () => {
  it("should increment byte by one", async () => {
    let system = load("+");
    expect(system.cells[0]).to.equal(0);
    await step(system);
    expect(system.cells[0]).to.equal(1);
    expect(system.pointers.instruction).to.equal(1);
  });
  it("should decrement byte by one", async () => {
    let system = load("-");
    system.cells[0] = 1;
    expect(system.cells[0]).to.equal(1);
    await step(system);
    expect(system.cells[0]).to.equal(0);
    expect(system.pointers.instruction).to.equal(1);
  });
  it("should move data pointer forward by one", async () => {
    let system = load(">");
    expect(system.pointers.data).to.equal(0);
    await step(system);
    expect(system.pointers.data).to.equal(1);
    expect(system.pointers.instruction).to.equal(1);
  });
  it("should move data pointer backwards by one", async () => {
    let system = load("<");
    system.pointers.data = 1;
    expect(system.pointers.data).to.equal(1);
    await step(system);
    expect(system.pointers.data).to.equal(0);
    expect(system.pointers.instruction).to.equal(1);
  });
  it("should output byte at data pointer", async () => {
    let program =
      "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.";
    let system = load(program);
    await execute(system, false);
    expect(system.output).to.equal("A");
  });
  it("should jump forward", async () => {
    let program = "[+++]+";
    let system = load(program);
    await step(system);
    expect(system.program[system.pointers.instruction]).to.equal("+");
    expect(system.cells[0]).to.equal(0);
  });
  it("should not jump forward", async () => {
    let program = "[.]+";
    let system = load(program);
    system.cells[0] = 1;
    await step(system);
    expect(system.program[system.pointers.instruction]).to.equal(".");
  });
  it("should jump forward over the nested jumps", async () => {
    let program = "[[[+++]]]+";
    let system = load(program);
    await step(system);
    expect(system.program[system.pointers.instruction]).to.equal("+");
    expect(system.cells[0]).to.equal(0);
  });
  it("should jump backward", async () => {
    let program = "[+]";
    let system = load(program);
    system.pointers.instruction = 2;
    system.cells[0] = 1;
    await step(system);
    expect(system.program[system.pointers.instruction]).to.equal("+");
  });
  it("should not jump backward", async () => {
    let program = "[+].";
    let system = load(program);
    system.pointers.instruction = 2;
    system.cells[0] = 0;
    await step(system);
    expect(system.program[system.pointers.instruction]).to.equal(".");
  });
  it("should jump backward over the nested jumps", async () => {
    let program = "[.[[+]]]";
    let system = load(program);
    system.pointers.instruction = 7;
    system.cells[0] = 1;
    await step(system);
    expect(system.program[system.pointers.instruction]).to.equal(".");
  });
  it("should output 'hello world'", async () => {
    let program =
      "+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-.";
    let system = load(program);
    await execute(system, false);
    expect(system.output).to.equal("hello world");
  });
  it("should ignore opening comment", async () => {
    let program =
      "[this is a comment]+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-.";
    let system = load(program);
    await execute(system, false);
    expect(system.output).to.equal("hello world");
  });
});
