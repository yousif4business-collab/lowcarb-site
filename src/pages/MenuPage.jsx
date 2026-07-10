import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import CtaBand from '../components/CtaBand.jsx'
import TodayMeals from '../components/TodayMeals.jsx'
import MenuCard from '../components/MenuCard.jsx'
import { WaButton } from '../components/ui.jsx'
import { usePageMeta } from '../lib/meta.js'

export default function MenuPage() {
  usePageMeta(
    'القائمة',
    'قائمة الأربع أسابيع كاملة — كل أكلة بسعراتها وبروتينها وكاربها، مع تصفية حسب النوع وأكلات اليوم.'
  )

  return (
    <>
      <PageHeader
        title="قائمة الأربع أسابيع"
        sub="نفس المنيو المطبوع مالتنا — بس تفاعلي. كل أسبوع أكلات مختلفة، بدون تكرار."
      />
      <TodayMeals />
      <MenuCard noHeader />
      <CtaBand title="عجبتك القائمة؟" sub="ثبت اشتراكك وخل وجباتك توصلك يومياً.">
        <Link
          to="/subscribe"
          className="inline-flex items-center rounded-full bg-grape px-8 py-4 font-display font-bold text-lg text-lemon transition hover:-translate-y-0.5"
        >
          شوف خطط الاشتراك
        </Link>
        <WaButton msg="مرحبا، شفت القائمة واريد ابدأ اشتراك">اطلب على واتساب</WaButton>
      </CtaBand>
    </>
  )
}
