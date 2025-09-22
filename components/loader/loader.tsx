'use client'

import React from 'react'
import { Card, CardContent } from '../ui/card'
import Spinner from '../spinner'
import { useI18n } from '@/lib/i18n-context'

type Props = {}
function Loader({ }: Props) {
  const { t } = useI18n()
  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardContent className="flex items-center text-center py-12 flex-col">
          <Spinner />
          <h3 className="text-lg font-semibold mb-2">{t('loading')}</h3>
        </CardContent>
      </Card>
    </div>
  )
}

export default Loader;