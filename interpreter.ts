interface System {
  cells: Uint8Array;
  pointers: {
    instruction: number;
    data: number;
  };
  program: string;
}

export function strip(program: string): string {
  // TODO: Strip comments
  return program;
}

export function load(program: string): System {
  const strippedProgram = strip(program);
  return {
    cells: new Uint8Array(30_000),
    program: strippedProgram,
    pointers: {
      data: 0,
      instruction: 0
    }
  };
}

export function dump(system: System): void {
  console.log(system);
}

export function execute(system: System): void {
  if (system.pointers.instruction >= system.program.length) {
    throw new Error("Exceeded program bounds");
  }

  const instruction = system.program[system.pointers.instruction];
  if (instruction === "+") {
    system.cells[system.pointers.data]++;
    system.pointers.instruction++;
  } else if (instruction === "-") {
    system.cells[system.pointers.data]--;
    system.pointers.instruction++;
  } else if (instruction === ">") {
    system.pointers.data++;
    system.pointers.instruction++;
  } else if (instruction === "<") {
    system.pointers.data--;
    system.pointers.instruction++;
  }
}
