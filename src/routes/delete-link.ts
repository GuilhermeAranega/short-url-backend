import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { JWTPayload } from "../utils/jwt-payload";
import { verifyJWT } from "../middleware/JWT";

export async function deleteLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/links/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const existingLink = await prisma.links.findUnique({
        where: { id },
      });

      if (!existingLink) {
        throw new Error("Link not found");
      }

      if (tokenData.userId != existingLink.userId) {
        throw new Error("Token not validated");
      }

      await prisma.links.delete({
        where: { id },
      });

      return res.status(204).send();
    }
  );
}
