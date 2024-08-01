import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import fCookie from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";

import { createUser } from "./routes/create-user";
import { sendEmailAuthenticateUser } from "./routes/send-email-authenticate-user";
import { authenticateUser } from "./routes/authenticate-user";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyJwt, { secret: "key", sign: { expiresIn: "3d" } });
app.register(fCookie, {
  secret: process.env.COOKIE_SECRET,
});

app.register(createUser);
app.register(sendEmailAuthenticateUser);
app.register(authenticateUser);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running on port 3333");
});
