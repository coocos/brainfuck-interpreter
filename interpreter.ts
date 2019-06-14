import * as readline from "readline";

type Instruction = "+" | "-" | ">" | "<" | "[" | "]" | "." | ",";

interface System {
  cells: Uint8Array;
  pointers: {
    instruction: number;
    data: number;
  };
  program: Instruction[];
  jumps: Jumps;
  output: string;
  done: boolean;
}

interface Jumps {
  [jump: number]: number;
}

const instructions = {
  "+": (system: System) => {
    system.cells[system.pointers.data]++;
    system.pointers.instruction++;
  },
  "-": (system: System) => {
    system.cells[system.pointers.data]--;
    system.pointers.instruction++;
  },
  ">": (system: System) => {
    system.pointers.data++;
    system.pointers.instruction++;
  },
  "<": (system: System) => {
    system.pointers.data--;
    system.pointers.instruction++;
  },
  ".": (system: System) => {
    system.output += String.fromCharCode(system.cells[system.pointers.data]);
    system.pointers.instruction++;
  },
  "[": (system: System) => {
    if (system.cells[system.pointers.data] === 0) {
      system.pointers.instruction = system.jumps[system.pointers.instruction];
      system.pointers.instruction++;
    } else {
      system.pointers.instruction++;
    }
  },
  "]": (system: System) => {
    if (system.cells[system.pointers.data] !== 0) {
      system.pointers.instruction = system.jumps[system.pointers.instruction];
      system.pointers.instruction++;
    } else {
      system.pointers.instruction++;
    }
  },
  ",": (system: System) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise(resolve => {
      rl.question("> ", input => {
        system.cells[system.pointers.data] = input.charCodeAt(0);
        system.pointers.instruction++;
        rl.close();
        resolve();
      });
    });
  }
};

function mapJumps(program: Instruction[]): Jumps {
  const jumps: Jumps = {};
  const brackets: number[] = [];

  for (let [address, instruction] of program.entries()) {
    if (instruction === "[") {
      brackets.push(address);
    } else if (instruction === "]") {
      const start = brackets.pop();
      if (start !== undefined) {
        jumps[start] = address;
        jumps[address] = start;
      }
    }
  }

  return jumps;
}

function parse(program: string): Instruction[] {
  return program
    .split("")
    .filter(token => /[\[\].,<>+-]/.test(token)) as Instruction[];
}

export function load(source: string): System {
  const program = parse(source);
  const jumps = mapJumps(program);
  return {
    cells: new Uint8Array(30_000),
    program,
    pointers: {
      data: 0,
      instruction: 0
    },
    jumps,
    output: "",
    done: false
  };
}

export async function step(system: System): Promise<void> {
  if (system.pointers.instruction >= system.program.length) {
    system.done = true;
    return;
  }
  const instruction = system.program[system.pointers.instruction];
  await instructions[instruction](system);
}

export async function execute(
  system: System,
  output: boolean = true
): Promise<void> {
  while (!system.done) {
    await step(system);
  }
  if (output) {
    console.log(system.output);
  }
}
