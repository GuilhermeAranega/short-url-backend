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
          }),
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;

      const token = await prisma.auth.findUnique({
        where: { id },
      });

      if (!token) {
        throw new Error("Token not found");
      }

      if (token.successful) {
        throw new Error("Link already used");
      }

      res.setCookie("token", token.token, {
        path: "/",
        httpOnly: true,
        secure: true,
      });

      await prisma.auth.update({
        where: { id },
        data: { successful: true },
      });

      return res.status(200).send({
        message: "Login successful",
      });
    }
  );
}
