declare module "node:crypto" {
  export function createDecipheriv(algorithm: string, key: any, iv: any): any;
  export function createCipheriv(algorithm: string, key: any, iv: any): any;
}

declare class Buffer extends Uint8Array {
  static from(value: string | ArrayLike<number>, encoding?: string): Buffer;
  static concat(list: readonly Uint8Array[]): Buffer;
  length: number;
  toString(encoding?: string): string;
}

declare const process: {
  exit(code?: number): never;
};

declare const Bun: {
  env: Record<string, string | undefined>;
};

declare module "bun:test" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void): void;
  export function expect(value: any): {
    toEqual(other: any): void;
    toBeInstanceOf(ctor: any): void;
    toBe(value: any): void;
  };
}
