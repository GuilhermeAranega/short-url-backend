import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { link } from "fs";
import { z } from "zod";

export async function redirectLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/r/:slug",
    {
      schema: {
        params: z.object({
          slug: z.string(),
        }),
      },
    },
    async (req, res) => {
      const { slug } = req.params;

      const link = await prisma.links.findUnique({
        where: { slug },
      });

      if (!link) {
        throw new Error("Link not found");
      }

      await prisma.links.update({
        where: { slug },
        data: { clicks: { increment: 1 } },
      });

      return res.redirect(link.url, 302);
    }
  );
}
