import { Suspense } from "react"
import RentalPaymentSystem from "@/components/rental-payment-system"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sistema de Detalhamento de Pagamentos de Aluguel</h1>
        <Suspense fallback={<div>Carregando...</div>}>
          <RentalPaymentSystem />
        </Suspense>
      </div>
      <Toaster />
    </main>
  )
}
