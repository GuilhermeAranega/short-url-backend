import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { sendEmail } from "../utils/send-email";
import { error } from "console";

export async function sendEmailAuthenticateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/auth/user",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { email } = req.body;

      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const token = await res.jwtSign({
        userId: user.id,
        email: user.email,
      });

      const existingToken = await prisma.auth.findUnique({
        where: { userId: user.id },
      });

      if (existingToken) {
        await prisma.auth.delete({
          where: { userId: user.id },
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

      if (process.env.MODE === "dev") {
        console.log(`http://localhost:3333/auth/${dbToken.id}`);
      } else {
        sendEmail(email, dbToken.id);
      }

      return res.status(201).send({
        message: "Email sent",
      });
    }
  );
}
