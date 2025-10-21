// types/global.d.ts
export {};

declare global {
  interface BoldCheckoutOptions {
    orderId: string;
    currency: string;
    amount: string;
    apiKey: string;
    integritySignature: string;
    description?: string;
    redirectionUrl?: string;
    customerEmail?: string;
  }

  interface BoldCheckoutInstance {
    open(): void;
    // si Bold expone más métodos, agrégalos aquí (por ejemplo close, on, etc.)
  }

  interface Window {
    BoldCheckout?: new (options: BoldCheckoutOptions) => BoldCheckoutInstance;
  }
}
