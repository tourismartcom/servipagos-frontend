import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const {
      orderId,
      amount,
      currency = "COP",
      description = "",
    } = await req.json();

    // Clave privada que viene del .env
    const privateKey = process.env.BOLD_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("BOLD_PRIVATE_KEY no está definida");
    }

    // Construimos la cadena a firmar (según formato Bold)
    const stringToSign = `${orderId}|${amount}|${currency}|${description}`;

    // Generamos la firma (HMAC-SHA256)
    const signature = crypto
      .createHmac("sha256", privateKey)
      .update(stringToSign)
      .digest("hex");

    return NextResponse.json({
      ok: true,
      signature,
      stringToSign,
    });
  } catch (error) {
    console.error("Error generando firma:", error);
    return NextResponse.json(
      { error: "Error generando firma" },
      { status: 500 }
    );
  }
}
