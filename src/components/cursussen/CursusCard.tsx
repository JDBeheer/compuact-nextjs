import Link from 'next/link'
import { ArrowRight, MapPin, Monitor, FileSpreadsheet, FileText, Mail, Presentation, BarChart3, FolderKanban, Bot, PenTool, Users, Laptop, BookOpen, Building2 } from 'lucide-react'
import Card, { CardBody } from '@/components/ui/Card'
import { Cursus } from '@/types'
import { formatPrice, niveauLabel } from '@/lib/utils'

const categorieConfig: Record<string, { icon: typeof Monitor; gradient: string }> = {
  excel: { icon: FileSpreadsheet, gradient: 'from-emerald-500 to-emerald-700' },
  word: { icon: FileText, gradient: 'from-blue-500 to-blue-700' },
  'office-365': { icon: Monitor, gradient: 'from-orange-500 to-red-600' },
  outlook: { icon: Mail, gradient: 'from-sky-500 to-sky-700' },
  powerpoint: { icon: Presentation, gradient: 'from-rose-500 to-rose-700' },
  'power-bi': { icon: BarChart3, gradient: 'from-yellow-500 to-amber-600' },
  project: { icon: FolderKanban, gradient: 'from-teal-500 to-teal-700' },
  ai: { icon: Bot, gradient: 'from-violet-500 to-purple-700' },
  visio: { icon: PenTool, gradient: 'from-indigo-500 to-indigo-700' },
}

const niveauConfig: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  gevorderd: 'bg-amber-100 text-amber-700',
  expert: 'bg-red-100 text-red-700',
}

export default function CursusCard({ cursus }: { cursus: Cursus }) {
  const catSlug = cursus.categorie?.slug || 'excel'
  const config = categorieConfig[catSlug] || categorieConfig.excel
  const Icon = config.icon

  return (
    <Link href={`/cursussen/${cursus.slug}`} className="group">
      <Card className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-zinc-200/60 group-hover:-translate-y-1 group-hover:border-primary-200">
        {/* Header met categorie gradient */}
        <div className={`h-36 bg-gradient-to-br ${config.gradient} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <Icon size={52} className="text-white/90 relative z-10" strokeWidth={1.5} />
          <div className="absolute top-3 left-3">
            <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {cursus.categorie?.naam || 'Cursus'}
            </span>
          </div>
        </div>

        <CardBody className="flex flex-col">
          <div className="flex items-center gap-2 mb-2.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${niveauConfig[cursus.niveau] || niveauConfig.beginner}`}>
              {niveauLabel(cursus.niveau)}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">{cursus.duur}</span>
          </div>

          <h3 className="font-bold text-[17px] leading-snug mb-1.5 group-hover:text-primary-500 transition-colors">
            {cursus.titel}
          </h3>

          <p className="text-sm text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
            {cursus.korte_beschrijving || 'Praktijkgerichte training met ervaren docenten.'}
          </p>

          <div className="flex items-center gap-3 text-[12px] text-zinc-400 mb-4">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> 17 locaties
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> Klassikaal
            </span>
            <span className="flex items-center gap-1">
              <Laptop size={12} /> Online
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100">
            <div>
              <span className="text-xs text-zinc-400">vanaf</span>
              <span className="text-lg font-bold text-zinc-900 ml-1">
                {formatPrice(cursus.prijs_vanaf)}
              </span>
            </div>
            <span className="text-sm text-primary-500 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              Bekijk <ArrowRight size={14} />
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
