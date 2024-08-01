import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        body: z.object({
          name: z.string().min(3),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            userId: z.string().cuid(),
            token: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { name, email } = req.body;

      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("Email já cadastrado");
      }

      const user = await prisma.users.create({
        data: {
          name,
          email,
        },
      });

      const token = await res.jwtSign({
        userId: user.id,
        email,
      });

      res.setCookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: true,
      });

      await prisma.auth.create({
        data: {
          token,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return res.status(201).send({
        message: "User created",
        userId: user.id,
        token,
      });
    }
  );
}
