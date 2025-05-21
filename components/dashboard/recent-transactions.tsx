"use client"

import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  CreditCard, 
  ShoppingCart, 
  Wallet 
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  title: string
  amount: string | number
  type: "incoming" | "outgoing" | "transfer"
  category_name?: string
  account_name?: string
  timestamp?: string
  transaction_date?: string
  status: "completed" | "pending" | "failed"
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions = [] }: RecentTransactionsProps) {
  // Get icon based on category name
  const getCategoryIcon = (transaction: Transaction) => {
    const categoryName = transaction.category_name?.toLowerCase() || ""
    
    if (transaction.type === "incoming") {
      return Wallet
    } else if (categoryName.includes("food") || categoryName.includes("grocery")) {
      return ShoppingCart
    } else {
      return CreditCard
    }
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-1">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent transactions found
          </div>
        ) : (
          transactions.map((transaction) => {
            const Icon = getCategoryIcon(transaction)
            return (
              <div
                key={transaction.id}
                className={cn(
                  "group flex items-center gap-3",
                  "p-2 rounded-lg",
                  "hover:bg-muted/50",
                  "transition-all duration-200",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    "bg-muted",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 flex items-center justify-between min-w-0">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">{transaction.title}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.transaction_date || transaction.timestamp)}
                      </p>
                      {transaction.status !== "completed" && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] px-1 py-0 h-4",
                            transaction.status === "pending" 
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" 
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          )}
                        >
                          {transaction.status}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pl-3">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        transaction.type === "incoming"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400",
                      )}
                    >
                      {transaction.type === "incoming" ? "+" : "-"}
                      {typeof transaction.amount === 'number' 
                        ? formatCurrency(transaction.amount)
                        : transaction.amount}
                    </span>
                    {transaction.type === "incoming" ? (
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </ScrollArea>
  )
}
