import { BoldPaymentButton } from "../../components/BoldCheckoutButton";

export default function CheckoutPage() {
  return (
    <main>
      <h1>Checkout ServiPagos</h1>

      <div>
        <BoldPaymentButton
          orderId="SP-20251017-0001"
          amount={15000}
          description="Publicación TOP 7 días"
        />
      </div>
    </main>
  );
}
