import msgpack from "@msgpack/msgpack";
import type { RequestHandler } from "express";

function apolloExpressMsgpackPlugin(): RequestHandler {
  return (req, res, next) => {
    if (req.headers["content-type"] === "application/msgpack") {
      const send = res.send.bind(res);
      res.send = (data) => {
        if (res.getHeader("content-type") === "application/json") {
          // Patch response to send msgpack-encoded data
          res.removeHeader("content-type");
          res.removeHeader("content-length");
          res.setHeader("Content-Type", "application/msgpack");
          const response = JSON.parse(data);
          return send(msgpack.encode(response));
        }
        return send(data);
      };
    }
    next();
  };
}

export default apolloExpressMsgpackPlugin;
