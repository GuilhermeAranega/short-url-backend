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
import { createLink } from "./routes/create-link";
import { redirectLink } from "./routes/redirect-link";
import { getAllLinks } from "./routes/get-all-links";
import { getLink } from "./routes/get-link";
import { editLink } from "./routes/edit-link";
import fastifyCors from "@fastify/cors";
import { deleteLink } from "./routes/delete-link";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "http://localhost:3000",
  credentials: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyJwt, { secret: "key", sign: { expiresIn: "3d" } });
app.register(fCookie, {
  secret: process.env.COOKIE_SECRET,
});

app.register(createUser);
app.register(sendEmailAuthenticateUser);
app.register(authenticateUser);

app.register(createLink);
app.register(redirectLink);
app.register(getAllLinks);
app.register(getLink);
app.register(editLink);
app.register(deleteLink);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running on port 3333");
});
