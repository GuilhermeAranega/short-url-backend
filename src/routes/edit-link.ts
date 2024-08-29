import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { URL } from "url";
import { JWTPayload } from "../utils/jwt-payload";
import { verifyJWT } from "../middleware/JWT";

export async function editLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/links/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
        body: z.object({
          title: z.string().optional(),
          url: z.string().url().optional(),
          slug: z.string().optional(),
          userId: z.string().cuid(),
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
      const data = req.body;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;
      var slug;
      var shortedUrl;

      const existingLink = await prisma.links.findUnique({
        where: { id },
      });

      if (!existingLink) {
        throw new Error("Link not found");
      }

      if (tokenData.userId != data.userId) {
        throw new Error("Token not validated");
      }

      if (data.slug) {
        slug = generateSlug(data.slug);

        const baseURL = `${req.protocol}://${req.hostname}`;
        shortedUrl = new URL(`/r/${slug}`, baseURL);
      }

      data.slug = slug;
      data["shortedUrl"] = shortedUrl;

      await prisma.links.update({
        where: { id },
        data,
      });

      return res.status(201).send({
        message: "Shorted url updated",
      });
    }
  );
}
