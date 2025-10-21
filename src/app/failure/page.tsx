import Link from "next/link";
import React from "react";

export default function FailurePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-red-600">
        Transacción fallida
      </h1>
      <p className="text-gray-700 mb-6">
        Ocurrió un error con el pago o fue cancelado. Por favor, inténtalo
        nuevamente.
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
