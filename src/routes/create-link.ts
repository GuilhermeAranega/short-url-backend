import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { URL } from "url";
import { JWTPayload } from "../utils/jwt-payload";
import { verifyJWT } from "../middleware/JWT";

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/links",
    {
      schema: {
        body: z.object({
          title: z.string(),
          url: z.string().url(),
          slug: z.string(),
          userId: z.string().cuid(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            shortedUrl: z.string().url(),
            linkId: z.string().cuid(),
          }),
        },
      },
    },
    async (req, res) => {
      const data = req.body;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const user = await prisma.users.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const slug = generateSlug(data.slug);

      const baseURL = `${req.protocol}://${req.hostname}`;
      const shortedUrl = new URL(`/r/${slug}`, baseURL);

      const linkDB = await prisma.links.create({
        data: {
          title: data.title,
          url: data.url,
          slug,
          shortedUrl: shortedUrl.toString(),
          user: {
            connect: {
              id: data.userId,
            },
          },
        },
      });

      return res.status(201).send({
        message: "Shorted url created",
        shortedUrl: shortedUrl.toString(),
        linkId: linkDB.id,
      });
    }
  );
}
