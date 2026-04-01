'use client'

import { useEffect } from 'react'
import { trackViewItem } from '@/lib/analytics'

interface Props {
  id: string
  titel: string
  categorie?: string
  prijs: number
}

export default function TrackViewItem({ id, titel, categorie, prijs }: Props) {
  useEffect(() => {
    trackViewItem({ id, titel, categorie, prijs })
  }, [id, titel, categorie, prijs])

  return null
}
