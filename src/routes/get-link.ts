import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/JWT";

export async function getLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/links/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            link: z.object({
              id: z.string().cuid(),
              title: z.string(),
              url: z.string().url(),
              shortedUrl: z.string().url(),
              clicks: z.number().int(),
              slug: z.string(),
              userId: z.string().cuid(),
            }),
          }),
        },
      },
      onRequest: [verifyJWT],
    },
    async (req, res) => {
      const { id } = req.params;

      const link = await prisma.links.findUnique({
        where: { id },
      });

      if (!link) {
        throw new Error("Link not found");
      }

      return res.status(201).send({
        message: "Shorted url created",
        link,
      });
    }
  );
}
