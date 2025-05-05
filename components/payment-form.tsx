"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { PaymentData } from "@/types/payment"

interface PaymentFormProps {
  data: PaymentData
  onChange: (data: Partial<PaymentData>) => void
}

export default function PaymentForm({ data, onChange }: PaymentFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "number") {
      // Converte para número com alta precisão
      if (value === "") {
        onChange({ [name]: 0 })
      } else {
        // Usar parseFloat diretamente para manter a precisão máxima
        const numValue = Number.parseFloat(value)
        onChange({ [name]: isNaN(numValue) ? 0 : numValue })
      }
    } else {
      onChange({ [name]: value })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    onChange({ isPropertyTaxMonthly: checked })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyName">Nome do Imóvel</Label>
          <Input
            id="propertyName"
            name="propertyName"
            placeholder="Ex: Apartamento Centro"
            value={data.propertyName}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenantName">Nome do Locatário</Label>
          <Input
            id="tenantName"
            name="tenantName"
            placeholder="Ex: João Silva"
            value={data.tenantName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="month">Mês de Referência</Label>
        <Input id="month" name="month" type="month" value={data.month} onChange={handleInputChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rentValue">Valor do Aluguel (R$)</Label>
          <Input
            id="rentValue"
            name="rentValue"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={data.rentValue === 0 ? "" : data.rentValue}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condoFee">Taxa de Condomínio (R$)</Label>
          <Input
            id="condoFee"
            name="condoFee"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={data.condoFee === 0 ? "" : data.condoFee}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="waterFee">Taxa de Água (R$)</Label>
          <Input
            id="waterFee"
            name="waterFee"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={data.waterFee === 0 ? "" : data.waterFee}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="electricityBill">Conta de Luz (R$)</Label>
          <Input
            id="electricityBill"
            name="electricityBill"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={data.electricityBill === 0 ? "" : data.electricityBill}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="propertyTax">IPTU (R$)</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="taxType" className="text-sm">
                Anual
              </Label>
              <Switch id="taxType" checked={data.isPropertyTaxMonthly} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="taxType" className="text-sm">
                Mensal
              </Label>
            </div>
          </div>
          <Input
            id="propertyTax"
            name="propertyTax"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={data.propertyTax === 0 ? "" : data.propertyTax}
            onChange={handleInputChange}
          />
          {!data.isPropertyTaxMonthly && (
            <p className="text-xs text-muted-foreground mt-1">
              O valor anual será dividido por 12 para cálculo mensal.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="managementFee">Taxa de Administração (R$)</Label>
          <Input
            id="managementFee"
            name="managementFee"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={data.managementFee === 0 ? "" : data.managementFee}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherExpenses">Outras Despesas (R$)</Label>
        <Input
          id="otherExpenses"
          name="otherExpenses"
          type="number"
          min="0"
          step="0.01"
          placeholder="0,00"
          value={data.otherExpenses === 0 ? "" : data.otherExpenses}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherExpensesDescription">Descrição das Outras Despesas</Label>
        <Textarea
          id="otherExpensesDescription"
          name="otherExpensesDescription"
          placeholder="Descreva as despesas adicionais..."
          value={data.otherExpensesDescription}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}
