import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartBar from '@/components/cart/CartBar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-16">{children}</main>
      <Footer />
      <CartBar />
      {/* TODO: verwijder stylesheet link voor productie */}
      <a
        href="/stylesheet"
        className="fixed bottom-4 left-4 z-50 bg-zinc-900 text-white text-xs font-mono px-3 py-1.5 rounded-full shadow-lg hover:bg-zinc-700 transition-colors opacity-60 hover:opacity-100"
      >
        Stylesheet
      </a>
    </>
  )
}
