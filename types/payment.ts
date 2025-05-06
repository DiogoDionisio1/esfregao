export interface PaymentData {
  propertyName: string
  tenantName: string
  month: string
  rentValue: number
  condoFee: number
  waterFee: number
  electricityBill: number
  propertyTax: number
  isPropertyTaxMonthly: boolean
  managementFee: number
  otherExpenses: number
  otherExpensesDescription: string
}

export interface HistoryEntry {
  id: string
  date: number
  total: number
  paymentData: PaymentData
}
