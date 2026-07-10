import PageHeader from '../components/PageHeader.jsx'
import CtaBand from '../components/CtaBand.jsx'
import FaqList from '../components/Faq.jsx'
import { RateUs } from '../components/Chrome.jsx'
import { WaButton } from '../components/ui.jsx'
import { usePageMeta } from '../lib/meta.js'

export default function FaqPage() {
  usePageMeta(
    'الأسئلة الشائعة',
    'كل الأسئلة الشائعة عن اشتراكات Low Carb — الأيام، المناطق، الدفع بكي كارد، السعرات والتطبيق.'
  )

  return (
    <>
      <PageHeader title="أسئلة تخطر ببالك" sub="جمعنالك أكثر الأسئلة اللي توصلنا — مع أجوبتها." />

      <section className="bg-paper py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <FaqList />
        </div>
      </section>

      <CtaBand title="ما لقيت جوابك؟" sub="اسألنا مباشرة — نرد بسرعة على واتساب.">
        <WaButton msg="مرحبا، عندي سؤال عن Low Carb">اسألنا على واتساب</WaButton>
        <RateUs className="inline-flex items-center rounded-full border-[2.5px] border-grape px-7 py-3.5 font-display font-bold text-lg text-grape transition hover:bg-grape hover:text-lemon" />
      </CtaBand>
    </>
  )
}
