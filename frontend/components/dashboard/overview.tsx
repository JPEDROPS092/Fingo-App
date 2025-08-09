"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { transactionsService } from "@/lib/api"

// Dados de exemplo para mostrar enquanto dados reais estão sendo carregados
const exampleData = [
  {
    name: "Jan",
    income: 4000,
    expenses: 2400,
  },
  {
    name: "Fev",
    income: 3000,
    expenses: 1398,
  },
  {
    name: "Mar",
    income: 5000,
    expenses: 3800,
  },
  {
    name: "Abr",
    income: 4000,
    expenses: 3908,
  },
  {
    name: "Mai",
    income: 3000,
    expenses: 4800,
  },
  {
    name: "Jun",
    income: 2000,
    expenses: 3800,
  },
  {
    name: "Jul",
    income: 6000,
    expenses: 4300,
  },
  {
    name: "Ago",
    income: 5000,
    expenses: 4100,
  },
  {
    name: "Set",
    income: 4000,
    expenses: 3200,
  },
  {
    name: "Out",
    income: 3500,
    expenses: 2900,
  },
  {
    name: "Nov",
    income: 4500,
    expenses: 3100,
  },
  {
    name: "Dez",
    income: 5500,
    expenses: 4200,
  },
]

interface OverviewProps {
  isLoading?: boolean;
  period?: 'month' | 'year';
}

export function Overview({ isLoading = false, period = 'year' }: OverviewProps) {
  const [chartData, setChartData] = useState(exampleData);
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para buscar dados financeiros mensais da API
    const fetchFinancialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Buscar estatísticas mensais
        const response = await transactionsService.getStats();
        
        if (response.success && response.data) {
          // Verificar se temos dados mensais na resposta
          if (response.data.monthly_stats) {
            const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            
            // Transformar dados da API no formato necessário para o gráfico
            const formattedData = response.data.monthly_stats.map((item: any) => ({
              name: monthNames[new Date(item.month).getMonth()],
              income: item.income || 0,
              expenses: item.expenses || 0
            }));
            
            setChartData(formattedData);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados financeiros:', err);
        setError('Falha ao carregar dados financeiros');
      } finally {
        setLoading(false);
      }
    };
    
    // Apenas buscar dados reais se não estiver no modo de carregamento forçado
    if (!isLoading) {
      fetchFinancialData();
    }
  }, [isLoading, period]);
  
  // Mostrar indicador de carregamento se dados estiverem sendo carregados
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px]">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Carregando dados financeiros...</p>
      </div>
    );
  }
  
  // Mostrar mensagem de erro se houver falha no carregamento
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px]">
        <p className="text-sm text-red-500">{error}</p>
        <button 
          onClick={() => setLoading(true)} 
          className="mt-2 text-sm text-blue-500 hover:text-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Tooltip 
          formatter={(value) => [`R$${value}`, undefined]}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Bar
          dataKey="income"
          fill="#4ade80"
          radius={[4, 4, 0, 0]}
          name="Receita"
        />
        <Bar
          dataKey="expenses"
          fill="#f87171"
          radius={[4, 4, 0, 0]}
          name="Despesas"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
