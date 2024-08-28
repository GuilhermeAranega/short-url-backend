import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { JWTPayload } from "../utils/jwt-payload";
import { verifyJWT } from "../middleware/JWT";

export async function getAllLinks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/links",
    {
      schema: {
        querystring: z.object({
          pageIndex: z.string().nullish().default("0").transform(Number),
        }),
        response: {
          201: z.object({
            message: z.string(),
            links: z
              .object({
                id: z.string().cuid(),
                title: z.string(),
                url: z.string().url(),
                shortedUrl: z.string().url(),
              })
              .array(),
            total: z.number().int(),
          }),
        },
      },
    },
    async (req, res) => {
      const { pageIndex } = req.query;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const user = await prisma.users.findUnique({
        where: { id: tokenData.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const [links, total] = await Promise.all([
        prisma.links.findMany({
          where: { userId: tokenData.userId },
          select: {
            id: true,
            title: true,
            url: true,
            shortedUrl: true,
          },
          take: 10,
          skip: pageIndex * 10,
        }),
        prisma.links.count({
          where: { userId: tokenData.userId },
        }),
      ]);

      return res.status(201).send({
        message: "Shorted URLs found",
        links,
        total,
      });
    }
  );
}
