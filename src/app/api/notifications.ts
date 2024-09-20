// pages/api/notifications.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Ensure this imports your Prisma client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { recipientId, issuerId } = req.body;

    if (!recipientId || !issuerId) {
      return res.status(400).json({ error: "Missing recipientId or issuerId" });
    }

    try {
      const notification = await prisma.notification.create({
        data: {
          recipientId,
          issuerId,
          type: "MENTION",
        },
      });
      return res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
