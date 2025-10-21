"use client";

import { useState } from "react";

interface SignPaymentResponse {
  ok: boolean;
  orderId: string;
  signature: string;
  stringToSign: string;
  timestamp: number;
}

interface SignPaymentInput {
  orderId: string;
  amount: string;
  currency?: string;
  description?: string;
}

interface BoldPaymentButtonProps {
  orderId: string;
  amount: number;
  description: string;
  currency?: string;
  customerEmail?: string;
  redirectionUrl?: string;
}

async function fetchSignature(
  input: SignPaymentInput
): Promise<SignPaymentResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const res = await fetch(`${base}/api/payments/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} generando firma: ${text}`);
  }

  const data = (await res.json()) as SignPaymentResponse;
  return data;
}

async function loadBoldScript(
  scriptSrc = "https://checkout.bold.co/library/boldPaymentButton.js"
): Promise<void> {
  if (typeof window === "undefined") return;

  if (window.BoldCheckout) return;

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existing) {
      // el script existe pero la propiedad puede no estar inicializada aún
      const check = () => {
        if (window.BoldCheckout) return resolve();
        setTimeout(() => {
          if (window.BoldCheckout) return resolve();
          check();
        }, 50);
      };
      return check();
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar script Bold"));
    document.head.appendChild(script);
  });
}

export function BoldPaymentButton({
  orderId,
  amount,
  description,
  currency = "COP",
  customerEmail,
  redirectionUrl = `${
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"
  }/success`,
}: BoldPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // 1) pedir firma al backend
      const sign = await fetchSignature({
        orderId,
        amount: amount.toString(),
        currency,
        description,
      });

      if (!sign.ok) throw new Error("No se pudo generar la firma");

      // 2) cargar script Bold si es necesario
      await loadBoldScript();

      if (!window.BoldCheckout) {
        throw new Error(
          "BoldCheckout no está disponible tras cargar el script"
        );
      }

      // 3) crear instancia con las propiedades que definimos en types/global.d.ts
      const options = {
        orderId: sign.orderId,
        currency,
        amount: amount.toString(),
        apiKey: process.env.NEXT_PUBLIC_BOLD_PUBLIC_KEY ?? "",
        integritySignature: sign.signature,
        description,
        redirectionUrl,
        customerEmail,
      };

      const checkout = new window.BoldCheckout(options);

      // 4) abrir el checkout
      checkout.open();
    } catch (err) {
      console.error("Error iniciando pago Bold:", err);
      setMessage("Error iniciando el pago. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {loading ? "Procesando..." : "Pagar con Bold"}
      {message && <div className="mt-2 text-sm text-red-500">{message}</div>}
    </button>
  );
}
