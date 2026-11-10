import logoImg from '../assets/images/iagora-logo.png';

export default function Footer() {
  return (
    <footer id="contato" className="w-full border-t border-[#D8E1E8] bg-white px-6 pb-8 pt-12 sm:px-12 lg:h-[333px] lg:px-[80px] lg:pb-8 lg:pt-16">
      <div className="mx-auto flex h-full max-w-[1280px] flex-col gap-10 lg:gap-12">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:gap-16">
          <div className="flex max-w-[360px] flex-col gap-4">
            <a href="#" aria-label="Iagora — início">
              <img src={logoImg} alt="Iagora" className="h-auto w-[126px]" />
            </a>
            <p className="font-['DM_Sans'] text-base leading-[26px] text-[#526579]">
              Um guia para conquistar e cuidar da sua independência.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12 lg:w-auto">
            <div className="flex flex-col gap-2">
              <h4 className="font-['DM_Sans'] text-[15px] font-bold text-[#102A43]">
                Conheça o Iagora
              </h4>
              <ul className="flex flex-col gap-0">
                <li>
                  <a href="#funcionalidades" className="font-['DM_Sans'] text-sm leading-8 text-[#526579] transition-colors hover:text-[#E03B00]">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="font-['DM_Sans'] text-sm leading-8 text-[#526579] transition-colors hover:text-[#E03B00]">
                    Como funciona
                  </a>
                </li>
                <li>
                  <a href="#sobre-nos" className="font-['DM_Sans'] text-sm leading-8 text-[#526579] transition-colors hover:text-[#E03B00]">
                    Sobre nós
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-2">
              <h4 className="font-['DM_Sans'] text-[15px] font-bold text-[#102A43]">
                Sua conta
              </h4>
              <ul className="flex flex-col gap-0">
                <li>
                  <a href="#" className="font-['DM_Sans'] text-sm leading-8 text-[#526579] transition-colors hover:text-[#E03B00]">
                    Meu perfil
                  </a>
                </li>
                <li>
                  <a href="#" className="font-['DM_Sans'] text-sm leading-8 text-[#526579] transition-colors hover:text-[#E03B00]">
                    Suporte
                  </a>
                </li>
                <li>
                  <a href="#" className="font-['DM_Sans'] text-sm leading-8 text-[#526579] transition-colors hover:text-[#E03B00]">
                    Perguntas frequentes
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-2">
              <h4 className="font-['DM_Sans'] text-[15px] font-bold text-[#102A43]">
                Vamos conversar
              </h4>
              <ul className="flex flex-col gap-0">
                <li>
                  <a href="mailto:Iagora@hotmail.com" className="font-['DM_Sans'] text-sm leading-8 text-[#526579] transition-colors hover:text-[#E03B00]">
                    Iagora@hotmail.com
                  </a>
                </li>
                <li className="font-['DM_Sans'] text-sm leading-8 text-[#526579]">
                  Instagram · GitHub · LinkedIn
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-[#D8E1E8] pt-6">
          <p className="font-['DM_Sans'] text-sm text-[#526579]">
            © Iagora · Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
