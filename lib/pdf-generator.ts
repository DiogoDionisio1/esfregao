import type { PaymentData } from "@/types/payment"
import { formatCurrency } from "@/lib/utils"

export async function generatePDF(data: PaymentData, total: number) {
  // Importar dinamicamente a biblioteca html2pdf
  const html2pdf = (await import("html2pdf.js")).default

  // Calcular o IPTU mensal se for anual com precisão de 2 casas decimais
  const monthlyPropertyTax = data.isPropertyTaxMonthly
    ? data.propertyTax
    : Number.parseFloat((data.propertyTax / 12).toFixed(2))

  // Calcular o total das deduções (todos os valores exceto o aluguel e taxa de administração)
  const deductions =
    Math.round(
      (data.condoFee +
        data.waterFee +
        data.electricityBill +
        (data.isPropertyTaxMonthly ? data.propertyTax : monthlyPropertyTax) +
        data.otherExpenses) *
        100,
    ) / 100

  // Calcular o valor líquido do aluguel após deduções e taxa de administração
  const netRent = Math.max(0, Math.round((data.rentValue - deductions - data.managementFee) * 100) / 100)

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

    ${
      data.rentValue > 0 && (deductions > 0 || data.managementFee > 0)
        ? `
    <div style="margin-top: 20px; border: 1px solid #ddd; border-radius: 5px; padding: 10px; background-color: #f9f9f9;">
      <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 14px;">Deduções do Aluguel</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0;">Valor do Aluguel:</td>
          <td style="text-align: right; padding: 4px 0;">${formatCurrency(data.rentValue)}</td>
        </tr>
        ${
          deductions > 0
            ? `
        <tr>
          <td style="padding: 4px 0;">Despesas:</td>
          <td style="text-align: right; padding: 4px 0; color: #e53e3e;">- ${formatCurrency(deductions)}</td>
        </tr>
        `
            : ""
        }
        ${
          data.managementFee > 0
            ? `
        <tr>
          <td style="padding: 4px 0;">Taxa de Administração:</td>
          <td style="text-align: right; padding: 4px 0; color: #e53e3e;">- ${formatCurrency(data.managementFee)}</td>
        </tr>
        `
            : ""
        }
        <tr style="border-top: 1px solid #ddd;">
          <td style="padding: 4px 0; font-weight: bold;">Valor Líquido:</td>
          <td style="text-align: right; padding: 4px 0; font-weight: bold; color: ${
            netRent > 0 ? "#2f855a" : "#e53e3e"
          };">${formatCurrency(netRent)}</td>
        </tr>
      </table>
    </div>
    `
        : ""
    }
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
