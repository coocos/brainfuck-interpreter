interface System {
  cells: Uint8Array;
  pointers: {
    instruction: number;
    data: number;
  };
  program: string;
  output: string;
  done: boolean;
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
    },
    output: "",
    done: false
  };
}

export function step(system: System): void {
  if (system.pointers.instruction >= system.program.length) {
    system.done = true;
    return;
  }
  if (system.pointers.data < 0) {
    throw new Error("Data pointer is negative");
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
  } else if (instruction === ".") {
    system.output += String.fromCharCode(system.cells[system.pointers.data]);
    system.pointers.instruction++;
  } else if (instruction === "[") {
    if (system.cells[system.pointers.data] === 0) {
      let brackets = 0;
      let instruction = system.program[system.pointers.instruction];
      while (brackets > 0 || instruction !== "]") {
        instruction = system.program[system.pointers.instruction];
        if (instruction === "[") {
          brackets++;
        } else if (instruction === "]") {
          brackets--;
        }
        system.pointers.instruction++;
      }
    } else {
      system.pointers.instruction++;
    }
  } else if (instruction === "]") {
    if (system.cells[system.pointers.data] !== 0) {
      let brackets = 0;
      let instruction = system.program[system.pointers.instruction];
      while (brackets > 0 || instruction !== "[") {
        instruction = system.program[system.pointers.instruction];
        if (instruction === "]") {
          brackets++;
        } else if (instruction === "[") {
          brackets--;
        }
        system.pointers.instruction--;
      }
      system.pointers.instruction += 2;
    } else {
      system.pointers.instruction++;
    }
  }
}

export function execute(system: System): void {
  while (!system.done) {
    step(system);
  }
}
