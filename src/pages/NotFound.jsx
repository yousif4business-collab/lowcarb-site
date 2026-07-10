import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { usePageMeta } from '../lib/meta.js'

export default function NotFound() {
  usePageMeta('صفحة غير موجودة', 'الصفحة المطلوبة غير موجودة — ارجع للرئيسية.')

  return (
    <>
      <PageHeader title="صفحة غير موجودة" sub="يمكن الرابط تغيّر أو انكتب غلط — ولا يهمك." />
      <section className="bg-paper py-16 text-center md:py-24">
        <Link
          to="/"
          className="inline-block rounded-full bg-grape px-9 py-4 font-display text-lg font-extrabold text-lemon shadow-pop transition hover:-translate-y-0.5"
        >
          ارجع للرئيسية
        </Link>
      </section>
    </>
  )
}
