"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Mail, Share2 } from "lucide-react"
import PaymentForm from "@/components/payment-form"
import PaymentSummary from "@/components/payment-summary"
import PaymentHistory from "@/components/payment-history"
import type { PaymentData, HistoryEntry } from "@/types/payment"
import { generatePDF } from "@/lib/pdf-generator"
import { formatCurrency } from "@/lib/utils"

export default function RentalPaymentSystem() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("novo")
  const [paymentData, setPaymentData] = useState<PaymentData>({
    propertyName: "",
    tenantName: "",
    month: new Date().toISOString().substring(0, 7),
    rentValue: 0,
    condoFee: 0,
    waterFee: 0,
    electricityBill: 0,
    propertyTax: 0,
    isPropertyTaxMonthly: true,
    managementFee: 0,
    otherExpenses: 0,
    otherExpensesDescription: "",
  })

  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Carregar histórico do localStorage ao iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem("paymentHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Salvar histórico no localStorage quando atualizado
  useEffect(() => {
    localStorage.setItem("paymentHistory", JSON.stringify(history))
  }, [history])

  const handleFormChange = (data: Partial<PaymentData>) => {
    setPaymentData((prev) => ({ ...prev, ...data }))
  }

  const calculateTotal = () => {
    const { rentValue, condoFee, waterFee, electricityBill, propertyTax, managementFee, otherExpenses } = paymentData

    // Garantir que todos os valores são números
    const rent = Number(rentValue || 0)
    const condo = Number(condoFee || 0)
    const water = Number(waterFee || 0)
    const electricity = Number(electricityBill || 0)
    const tax = paymentData.isPropertyTaxMonthly
      ? Number(propertyTax || 0)
      : Math.round((Number(propertyTax || 0) / 12) * 100) / 100
    const management = Number(managementFee || 0)
    const other = Number(otherExpenses || 0)

    // Calcular o total com alta precisão e depois arredondar para 2 casas decimais
    // A taxa de administração agora é SUBTRAÍDA do total
    const sum = rent + condo + water + electricity + tax - management + other
    return Math.round(sum * 100) / 100
  }

  const saveToHistory = () => {
    if (!paymentData.propertyName || !paymentData.tenantName) {
      toast({
        title: "Informações incompletas",
        description: "Preencha pelo menos o nome do imóvel e do locatário.",
        variant: "destructive",
      })
      return
    }

    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      paymentData: { ...paymentData },
      total: calculateTotal(),
    }

    setHistory((prev) => [newEntry, ...prev])

    toast({
      title: "Pagamento salvo",
      description: `Pagamento de ${formatCurrency(calculateTotal())} salvo no histórico.`,
    })
  }

  const handleExportPDF = async () => {
    await generatePDF(paymentData, calculateTotal())
    toast({
      title: "PDF gerado",
      description: "O detalhamento foi exportado como PDF.",
    })
  }

  // Modificar a função handleShareWhatsApp para incluir a descrição das outras despesas
  const handleShareWhatsApp = () => {
    const total = calculateTotal()
    const message = `
*Detalhamento de Pagamento - ${paymentData.month}*
Imóvel: ${paymentData.propertyName}
Locatário: ${paymentData.tenantName}

Aluguel: ${formatCurrency(paymentData.rentValue)}
Condomínio: ${formatCurrency(paymentData.condoFee)}
Água: ${formatCurrency(paymentData.waterFee)}
Luz: ${formatCurrency(paymentData.electricityBill)}
IPTU: ${formatCurrency(paymentData.propertyTax)}
Taxa de Administração: -${formatCurrency(paymentData.managementFee)}
${paymentData.otherExpenses > 0 ? `Outras despesas: ${formatCurrency(paymentData.otherExpenses)}${paymentData.otherExpensesDescription ? `\nDescrição: ${paymentData.otherExpensesDescription}` : ""}` : ""}

*Total a pagar: ${formatCurrency(total)}*
  `.trim()

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank")
  }

  // Modificar a função handleShareEmail para incluir a descrição das outras despesas
  const handleShareEmail = () => {
    const total = calculateTotal()
    const subject = `Detalhamento de Pagamento - ${paymentData.month}`
    const body = `
Detalhamento de Pagamento - ${paymentData.month}
Imóvel: ${paymentData.propertyName}
Locatário: ${paymentData.tenantName}

Aluguel: ${formatCurrency(paymentData.rentValue)}
Condomínio: ${formatCurrency(paymentData.condoFee)}
Água: ${formatCurrency(paymentData.waterFee)}
Luz: ${formatCurrency(paymentData.electricityBill)}
IPTU: ${formatCurrency(paymentData.propertyTax)}
Taxa de Administração: -${formatCurrency(paymentData.managementFee)}
${paymentData.otherExpenses > 0 ? `Outras despesas: ${formatCurrency(paymentData.otherExpenses)}${paymentData.otherExpensesDescription ? `\nDescrição: ${paymentData.otherExpensesDescription}` : ""}` : ""}

Total a pagar: ${formatCurrency(total)}
  `.trim()

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Tabs defaultValue="novo" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="novo">Novo Pagamento</TabsTrigger>
        <TabsTrigger value="historico">Histórico</TabsTrigger>
      </TabsList>

      <TabsContent value="novo" className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Pagamento</CardTitle>
                <CardDescription>Preencha os dados do imóvel e valores a serem pagos</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentForm data={paymentData} onChange={handleFormChange} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
                <CardDescription>Valor total a ser pago</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentSummary data={paymentData} total={calculateTotal()} />
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button onClick={saveToHistory} className="w-full">
                  Salvar no Histórico
                </Button>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <Button variant="outline" onClick={handleExportPDF} title="Exportar PDF">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={handleShareWhatsApp} title="Compartilhar via WhatsApp">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={handleShareEmail} title="Compartilhar via Email">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="historico">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>Visualize os pagamentos anteriores</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentHistory
              history={history}
              onDelete={(id) => {
                setHistory(history.filter((entry) => entry.id !== id))
                toast({
                  title: "Registro removido",
                  description: "O registro foi removido do histórico.",
                })
              }}
              onView={(entry) => {
                setPaymentData(entry.paymentData)
                setActiveTab("novo")
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
