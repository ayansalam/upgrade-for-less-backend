import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const rawBody = await buffer(req);
  const signature = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const crypto = await import("crypto");
  const hash = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if (hash === signature) {
    console.log("🔔 Webhook verified:", JSON.parse(rawBody.toString()));
    res.status(200).json({ status: "Webhook verified" });
  } else {
    res.status(400).json({ error: "Invalid signature" });
  }
} 