import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  subtitle?: string
  trend?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export function StatsCard({ 
  title, 
  subtitle, 
  trend, 
  icon: Icon, 
  iconColor = "text-primary", 
  iconBg = "bg-primary/10" 
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md dark:hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`rounded-lg p-2 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</div>
          {subtitle && (
            <div className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</div>
          )}
          {trend && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{trend}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
