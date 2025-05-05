import type { PaymentData } from "@/types/payment"
import { formatCurrency } from "@/lib/utils"

export async function generatePDF(data: PaymentData, total: number) {
  // Importar dinamicamente a biblioteca html2pdf
  const html2pdf = (await import("html2pdf.js")).default

  // Calcular o IPTU mensal se for anual com precisão de 2 casas decimais
  const monthlyPropertyTax = data.isPropertyTaxMonthly
    ? data.propertyTax
    : Number.parseFloat((data.propertyTax / 12).toFixed(2))

  // Criar um elemento temporário para o PDF
  const element = document.createElement("div")
  element.style.padding = "20px"
  element.style.fontFamily = "Arial, sans-serif"

  // Formatar a data
  const monthDate = data.month ? new Date(data.month + "-01") : new Date()
  const formattedMonth = monthDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  // Construir o conteúdo HTML
  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="margin-bottom: 5px;">Detalhamento de Pagamento</h1>
      <p style="color: #666;">${formattedMonth}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <p><strong>Imóvel:</strong> ${data.propertyName || "Não especificado"}</p>
      <p><strong>Locatário:</strong> ${data.tenantName || "Não especificado"}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background-color: #f2f2f2;">
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Descrição</th>
        <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Valor</th>
      </tr>
      ${
        data.rentValue > 0
          ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">Aluguel</td>
          <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${formatCurrency(data.rentValue)}</td>
        </tr>
      `
          : ""
      }
      ${
        data.condoFee > 0
          ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">Condomínio</td>
          <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${formatCurrency(data.condoFee)}</td>
        </tr>
      `
          : ""
      }
      ${
        data.waterFee > 0
          ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">Água</td>
          <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${formatCurrency(data.waterFee)}</td>
        </tr>
      `
          : ""
      }
      ${
        data.electricityBill > 0
          ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">Luz</td>
          <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${formatCurrency(data.electricityBill)}</td>
        </tr>
      `
          : ""
      }
      ${
        data.propertyTax > 0
          ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">IPTU${!data.isPropertyTaxMonthly ? " (mensal)" : ""}</td>
          <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${formatCurrency(data.isPropertyTaxMonthly ? data.propertyTax : monthlyPropertyTax)}</td>
        </tr>
      `
          : ""
      }
      ${
        data.managementFee > 0
          ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">Taxa de Administração</td>
          <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd; color: #e53e3e;">- ${formatCurrency(data.managementFee)}</td>
        </tr>
      `
          : ""
      }
      ${
        data.otherExpenses > 0
          ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">
            Outras Despesas
            ${
              data.otherExpensesDescription
                ? `<br><span style="font-size: 0.9em; color: #555; font-style: italic;">${data.otherExpensesDescription}</span>`
                : ""
            }
          </td>
          <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${formatCurrency(data.otherExpenses)}</td>
        </tr>
      `
          : ""
      }
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <td style="padding: 8px;">TOTAL</td>
        <td style="text-align: right; padding: 8px;">${formatCurrency(total)}</td>
      </tr>
    </table>
  `

  // Configurações do PDF
  const options = {
    margin: 10,
    filename: `pagamento_${data.propertyName ? data.propertyName.replace(/\s+/g, "_") : "imovel"}_${data.month || "atual"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  }

  // Gerar o PDF
  return html2pdf().from(element).set(options).save()
}
