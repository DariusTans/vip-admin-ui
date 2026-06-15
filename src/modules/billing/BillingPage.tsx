import { Receipt } from 'lucide-react'
import { ModulePlaceholder } from '@/components/layout/ModulePlaceholder'

export function BillingPage() {
  return <ModulePlaceholder titleKey="nav.billing" icon={<Receipt className="size-8" />} />
}
