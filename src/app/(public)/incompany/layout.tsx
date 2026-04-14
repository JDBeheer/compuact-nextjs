import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'InCompany Training op Maat',
  description: 'InCompany trainingen van Compu Act, afgestemd op jouw organisatie. Microsoft Office cursussen op locatie of online. Vraag een vrijblijvende offerte aan.',
  openGraph: {
    title: 'InCompany Training op Maat | Compu Act Opleidingen',
    description: 'InCompany trainingen van Compu Act, afgestemd op jouw organisatie. Microsoft Office cursussen op locatie of online. Vraag een vrijblijvende offerte aan.',
    type: 'website',
  },
}

export default function IncompanyLayout({ children }: { children: React.ReactNode }) {
  return children
}
