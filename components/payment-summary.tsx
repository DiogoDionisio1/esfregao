import type { PaymentData } from "@/types/payment"
import { formatCurrency } from "@/lib/utils"

interface PaymentSummaryProps {
  data: PaymentData
  total: number
}

export default function PaymentSummary({ data, total }: PaymentSummaryProps) {
  // Calcular o IPTU mensal se for anual com alta precisão
  const monthlyPropertyTax = data.isPropertyTaxMonthly
    ? data.propertyTax
    : Math.round((data.propertyTax / 12) * 100) / 100

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Imóvel:</span>
          <span className="font-medium">{data.propertyName || "Não especificado"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Locatário:</span>
          <span className="font-medium">{data.tenantName || "Não especificado"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Mês:</span>
          <span className="font-medium">
            {data.month
              ? new Date(data.month + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
              : "Não especificado"}
          </span>
        </div>
      </div>

      <div className="border-t pt-2 space-y-1">
        {data.rentValue > 0 && (
          <div className="flex justify-between text-sm">
            <span>Aluguel:</span>
            <span>{formatCurrency(data.rentValue)}</span>
          </div>
        )}

        {data.condoFee > 0 && (
          <div className="flex justify-between text-sm">
            <span>Condomínio:</span>
            <span>{formatCurrency(data.condoFee)}</span>
          </div>
        )}

        {data.waterFee > 0 && (
          <div className="flex justify-between text-sm">
            <span>Água:</span>
            <span>{formatCurrency(data.waterFee)}</span>
          </div>
        )}

        {data.electricityBill > 0 && (
          <div className="flex justify-between text-sm">
            <span>Luz:</span>
            <span>{formatCurrency(data.electricityBill)}</span>
          </div>
        )}

        {data.propertyTax > 0 && (
          <div className="flex justify-between text-sm">
            <span>IPTU{!data.isPropertyTaxMonthly ? " (mensal)" : ""}:</span>
            <span>{formatCurrency(data.isPropertyTaxMonthly ? data.propertyTax : monthlyPropertyTax)}</span>
          </div>
        )}

        {data.managementFee > 0 && (
          <div className="flex justify-between text-sm">
            <span>Taxa de Administração:</span>
            <span>{formatCurrency(data.managementFee)}</span>
          </div>
        )}

        {data.otherExpenses > 0 && (
          <div className="flex justify-between text-sm">
            <div>
              <span>Outras Despesas:</span>
              {data.otherExpensesDescription && (
                <p className="text-xs text-muted-foreground">{data.otherExpensesDescription}</p>
              )}
            </div>
            <span>{formatCurrency(data.otherExpenses)}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-2">
        <div className="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
