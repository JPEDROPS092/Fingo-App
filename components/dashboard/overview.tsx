"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    income: 4000,
    expenses: 2400,
  },
  {
    name: "Feb",
    income: 3000,
    expenses: 1398,
  },
  {
    name: "Mar",
    income: 5000,
    expenses: 3800,
  },
  {
    name: "Apr",
    income: 4000,
    expenses: 3908,
  },
  {
    name: "May",
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
    name: "Aug",
    income: 5000,
    expenses: 4100,
  },
  {
    name: "Sep",
    income: 4000,
    expenses: 3200,
  },
  {
    name: "Oct",
    income: 3500,
    expenses: 2900,
  },
  {
    name: "Nov",
    income: 4500,
    expenses: 3100,
  },
  {
    name: "Dec",
    income: 5500,
    expenses: 4200,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          formatter={(value) => [`$${value}`, undefined]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar
          dataKey="income"
          fill="#4ade80"
          radius={[4, 4, 0, 0]}
          name="Income"
        />
        <Bar
          dataKey="expenses"
          fill="#f87171"
          radius={[4, 4, 0, 0]}
          name="Expenses"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
