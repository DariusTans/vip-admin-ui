import { Construction } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ModulePlaceholderProps {
  titleKey: string
  icon?: React.ReactNode
}

export function ModulePlaceholder({ titleKey, icon }: ModulePlaceholderProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        {icon ?? <Construction className="size-8" />}
      </div>
      <h2 className="text-xl font-semibold text-foreground">{t(titleKey)}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{t('common.underConstruction')}</p>
      <span className="mt-4 inline-block rounded-full bg-warning-soft px-3 py-1 text-xs font-medium text-warning">
        {t('common.comingSoon')}
      </span>
    </div>
  )
}
