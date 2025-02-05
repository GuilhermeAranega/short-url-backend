import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function authenticateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/auth/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            token: z.string(),
            userId: z.string().cuid(),
          }),
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;

      const token = await prisma.auth.findUnique({
        where: { id },
        select: {
          token: true,
          userId: true,
          successful: true,
        },
      });

      if (!token) {
        throw new Error("Token not found");
      }

      if (token.successful) {
        throw new Error("Link already used");
      }

      await prisma.auth.update({
        where: { id },
        data: { successful: true },
      });

      return res.status(200).send({
        message: "Login successful",
        token: token.token,
        userId: token.userId,
      });
    }
  );
}
