A barebones TypeScript interpreter for the esoteric [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck) programming language.

## Example use

To execute a program which prints "hello world":

```typescript
const system = load("+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-.");
execute(system);
```

Or alternatively you can use it from the command line via [ts-node](https://github.com/TypeStrong/ts-node):

```shell
ts-node index.ts examples/hello.bf
```

## Tests

To execute tests run `npm run test`.
