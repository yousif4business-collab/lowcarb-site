import PageHeader from '../components/PageHeader.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Why from '../components/Why.jsx'
import { Reveal, WaButton } from '../components/ui.jsx'
import { INSTAGRAM } from '../data/config.js'
import { usePageMeta } from '../lib/meta.js'

const BLOCKS = [
  {
    t: 'شنو يعني مطبخ سحابي؟',
    d: 'مطبخ متخصص بالتحضير والتوصيل — بدون صالة جلوس. هذا يخلي كل تركيزنا (وكل التكلفة) يروح على شغلتين: جودة الأكل وطزاجته. المطبخ يشتغل يومياً على وجبات المشتركين، وكل وجبة تنطبخ وتنغلف وتوصلك بنفس اليوم.'
  },
  {
    t: 'بإشراف شيف مختص بالتغذية',
    d: 'القائمة والوصفات والمقادير كلها بإشراف شيف مختص بالتغذية — من حساب البروتين والكارب بكل وجبة، لموازنة الأسبوع كامل. النتيجة أكل عراقي بنكهته المعروفة، بس محسوب.'
  },
  {
    t: 'شنو يعني لو كارب؟',
    d: 'أسلوب أكل يعتمد تقليل الكربوهيدرات (الخبز، الرز الزايد، السكريات) مقابل بروتين أعلى وخضار أكثر. أغلب الناس يستخدمونه لتنزيل الوزن أو تثبيته، لأنه يشبع أكثر ويقلل الرغبة بالسناكات. وجباتنا مبنية على هذا المبدأ — بس بدون تطرف: أكو رز ومعكرونة بالقائمة، بمقادير مدروسة. القيم الغذائية لكل أكلة موجودة بصفحة القائمة.'
  }
]

export default function AboutPage() {
  usePageMeta(
    'من نحن',
    'Low Carb — مطبخ سحابي في بغداد بإشراف شيف مختص بالتغذية. وجبات لو كارب طازة يومياً بتوصيل مجاني.'
  )

  return (
    <>
      <PageHeader
        title="من نحن"
        sub="مطبخ سحابي بغدادي — أكل صحي محسوب، يطبخ يومياً ويوصل مجاناً."
      />

      <section className="bg-paper pt-14 md:pt-20">
        <div className="mx-auto max-w-3xl space-y-5 px-6">
          {BLOCKS.map((b, i) => (
            <Reveal
              key={b.t}
              delay={i * 90}
              className="rounded-[26px] border-2 border-grape/10 bg-white p-8 shadow-card"
            >
              <h2 className="font-display text-2xl font-extrabold text-grape">{b.t}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">{b.d}</p>
            </Reveal>
          ))}

          <Reveal delay={280} className="rounded-[26px] bg-lemon/60 p-6 text-center">
            <p className="font-display text-lg font-extrabold text-grape">
              التوصيل مجاني داخل بغداد — السبت إلى الخميس
            </p>
          </Reveal>
        </div>
      </section>

      {/* the why cards */}
      <Why />

      {/* instagram card — grid/embeds slot in when media arrives */}
      {INSTAGRAM && (
        <section className="bg-paper pb-16 md:pb-20">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal
              as="a"
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-[26px] border-2 border-grape/10 bg-white p-8 text-center shadow-card transition hover:-translate-y-1"
            >
              <p className="font-display text-2xl font-extrabold text-grape">تابعنا على انستغرام</p>
              <p className="mt-2 text-[15px] font-medium text-muted">
                @lowcar.b2 — صور الوجبات وأخبار المنيو يوم بيوم
              </p>
            </Reveal>
          </div>
        </section>
      )}

      <CtaBand title="تحب تجرب؟" sub="ابدأ بأسبوع وشوف الفرق بنفسك.">
        <WaButton msg="مرحبا، اريد ابدأ اشتراك Low Carb">ابدأ على واتساب</WaButton>
      </CtaBand>
    </>
  )
}
