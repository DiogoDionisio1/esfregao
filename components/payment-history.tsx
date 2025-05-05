"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Trash2 } from "lucide-react"
import type { HistoryEntry } from "@/types/payment"
import { formatCurrency } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PaymentHistoryProps {
  history: HistoryEntry[]
  onDelete: (id: string) => void
  onView: (entry: HistoryEntry) => void
}

export default function PaymentHistory({ history, onDelete, onView }: PaymentHistoryProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  if (history.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Nenhum pagamento registrado no histórico.</div>
  }

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <Card key={entry.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="p-4 md:col-span-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="font-medium">{entry.paymentData.propertyName || "Imóvel não especificado"}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString("pt-BR")}</p>
                </div>
                <p className="text-sm">Locatário: {entry.paymentData.tenantName || "Não especificado"}</p>
                <p className="text-sm">
                  Mês:{" "}
                  {entry.paymentData.month
                    ? new Date(entry.paymentData.month + "-01").toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Não especificado"}
                </p>
              </div>
              <div className="bg-muted p-4 flex flex-row md:flex-col justify-between items-center md:items-end">
                <div className="text-right">
                  <p className="text-sm font-medium">Total</p>
                  <p className="font-bold">{formatCurrency(entry.total)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(entry)} title="Visualizar">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <AlertDialog open={deleteId === entry.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(entry.id)} title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este registro do histórico? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
