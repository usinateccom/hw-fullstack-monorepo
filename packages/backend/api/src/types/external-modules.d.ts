declare module "fastify" {
  type FastifyHandler = (...args: any[]) => any;

  export type FastifyReply = {
    status(code: number): FastifyReply;
    send(payload: any): void;
  };

  export type FastifyInstance = {
    register(plugin: FastifyHandler, opts?: any): FastifyInstance;
    setErrorHandler(handler: FastifyHandler): FastifyInstance;
    get(path: string, handler: FastifyHandler): FastifyInstance;
    post(path: string, handler: FastifyHandler): FastifyInstance;
    listen(opts: { port: number; host: string }): Promise<void>;
    inject(opts: { method: string; url: string; payload?: any }): Promise<{
      statusCode: number;
      body: string;
      json(): any;
    }>;
    log: {
      info(msg: string): void;
      error(error: unknown, msg?: string): void;
    };
  };

  type FastifyFactory = (opts?: any) => FastifyInstance;
  const fastify: FastifyFactory;
  export default fastify;
}

declare module "@fastify/cors" {
  const cors: (...args: any[]) => any;
  export default cors;
}
