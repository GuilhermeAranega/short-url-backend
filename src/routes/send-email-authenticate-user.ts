import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function sendEmailAuthenticateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/auth/user/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            tokenId: z.string().cuid(),
          }),
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;

      const user = await prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const token = await res.jwtSign({
        userId: user.id,
        email: user.email,
      });

      const existingToken = await prisma.auth.findUnique({
        where: { usersId: id },
      });

      if (existingToken) {
        await prisma.auth.delete({
          where: { usersId: id },
        });
      }

      const dbToken = await prisma.auth.create({
        data: {
          token,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      // ? send the email with the auth link
      // ? http://localhost:3333/auth/tokenDB.id
      console.log(`http://localhost:3333/auth/${dbToken.id}`);

      return res.status(201).send({
        message: "Email sended",
        tokenId: dbToken.id,
      });
    }
  );
}
