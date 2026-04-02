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
    </>
  )
}
