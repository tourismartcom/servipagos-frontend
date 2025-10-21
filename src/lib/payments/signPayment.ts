// frontend/src/lib/payments/signPayment.ts
export interface SignPaymentResponse {
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

export async function signPayment(
  input: SignPaymentInput
): Promise<SignPaymentResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/payments/sign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );

  if (!res.ok) {
    throw new Error(`Error ${res.status} al generar firma`);
  }

  const data = (await res.json()) as SignPaymentResponse;
  return data;
}
