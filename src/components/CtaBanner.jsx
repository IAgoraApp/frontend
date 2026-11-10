export default function CtaBanner() {
  return (
    <section className="w-full bg-[#E03B00] px-6 py-10 text-white sm:px-12 lg:h-[160px] lg:px-[72px] lg:py-[18px]">
      <div className="mx-auto flex h-full max-w-[1296px] flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
        <div className="flex max-w-[940px] flex-col gap-1 text-center md:text-left lg:h-[100px] lg:justify-center">
          <span className="font-['DM_Sans'] text-[14px] font-bold tracking-[1px] sm:text-base">
            SEU PRÓXIMO CAPÍTULO.
          </span>
          <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold leading-[36px] sm:text-[32px]">
            O seu agora começa aqui.
          </h2>
          <p className="font-['DM_Sans'] text-base leading-[22px] sm:text-[20px]">
            Independência é uma grande conquista. Você pode aprender um pouco por vez.
          </p>
        </div>

        <div className="shrink-0">
          <a href="#funcionalidades" className="flex h-[42px] w-[180px] items-center justify-center rounded-full bg-[#102A43] font-['DM_Sans'] text-base font-bold text-white transition-colors hover:bg-[#0c1f32] sm:text-lg">
            Começar agora
          </a>
        </div>
      </div>
    </section>
  );
}
