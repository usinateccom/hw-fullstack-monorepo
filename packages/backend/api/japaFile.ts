import { assert } from "@japa/assert";
import { configure, run } from "@japa/runner";

configure({
  files: ["tests/japa/**/*.japa.ts"],
  plugins: [assert()]
});

run();
