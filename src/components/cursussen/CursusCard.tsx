import Link from 'next/link'
import { Monitor, ArrowRight } from 'lucide-react'
import Card, { CardBody } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Cursus } from '@/types'
import { formatPrice, niveauLabel } from '@/lib/utils'

export default function CursusCard({ cursus }: { cursus: Cursus }) {
  return (
    <Link href={`/cursussen/${cursus.slug}`}>
      <Card hover className="h-full">
        <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center relative overflow-hidden">
          {cursus.afbeelding ? (
            <img
              src={cursus.afbeelding}
              alt={cursus.titel}
              className="w-full h-full object-cover"
            />
          ) : (
            <Monitor size={48} className="text-white/80" />
          )}
        </div>
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">{niveauLabel(cursus.niveau)}</Badge>
            <span className="text-xs text-zinc-500">{cursus.duur}</span>
          </div>
          <h3 className="font-semibold text-lg mb-1">{cursus.titel}</h3>
          <p className="text-sm text-zinc-600 line-clamp-2 mb-4">{cursus.korte_beschrijving}</p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100">
            <span className="text-primary-600 font-bold">
              vanaf {formatPrice(cursus.prijs_vanaf)}
            </span>
            <span className="text-sm text-primary-600 font-medium flex items-center gap-1">
              Bekijk <ArrowRight size={14} />
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
