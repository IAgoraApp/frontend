import { useNavigate } from "react-router-dom";
import Chave from "../assets/images/Group 7.png";

const ORANGE = "#C64411";
const NAVY = "#102A43";
const GREY = "#526579";
const BORDER = "#D8E1E8";

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6C12.3 13.5 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.4 28.8c-.5-1.4-.8-2.9-.8-4.8s.3-3.4.8-4.8l-7.8-6C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.8-6z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.7-4.2-13.6-9.9l-7.8 6C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const goToOnboarding = (event) => {
    event?.preventDefault();
    navigate("/onboarding");
  };
  const labelClass = "text-[14px] font-bold leading-[20px]";
  const inputBox = "flex h-[56px] w-full items-center rounded-[12px] border border-[#D8E1E8] bg-white px-[14px]";
  const inputClass = "h-full w-full bg-transparent text-[15px] outline-none placeholder:text-[#8A9AAA]";

  return (
    <>
      <style>{`@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;700&display=swap"); * { box-sizing: border-box; }`}</style>
      <div className="min-h-screen w-full overflow-x-hidden bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 md:px-12 lg:px-[72px]">
          <header className="flex w-full items-center justify-between gap-4 py-7">
            <div className="select-none text-[30px] font-bold tracking-[-0.5px]" style={{ color: ORANGE, fontFamily: "'Bricolage Grotesque', sans-serif" }} aria-label="Logo Iagora">Iagora</div>
            <div className="text-right text-[10px] font-bold leading-[16px] tracking-[0.7px] sm:text-[12px]" style={{ color: GREY }}>IAGORA · SEU NOVO CAPÍTULO</div>
          </header>
          <main className="flex flex-1 flex-col items-center justify-center gap-10 py-8 md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-12">
            <form onSubmit={goToOnboarding} className="flex w-full max-w-[520px] flex-col items-start gap-[12px] bg-white md:w-[46%] md:shrink-0 lg:w-[44%]">
              <div className="flex w-full flex-col items-start gap-[8px]">
                <span className="text-[12px] font-bold leading-[16px] tracking-[0.7px]" style={{ color: ORANGE }}>OLHA QUEM VOLTOU!</span>
                <h1 className="text-[42px] font-extrabold leading-[1.08] tracking-[-1px] sm:text-[50px] lg:text-[56px]" style={{ color: NAVY, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Que bom ter você<br />de volta!</h1>
                <p className="text-[16px] font-normal leading-[24px]" style={{ color: GREY }}>Seu cantinho no Iagora está te esperando.</p>
              </div>
              <button type="button" className="flex h-[56px] w-full cursor-pointer items-center gap-[14px] rounded-[12px] border border-[#D8E1E8] bg-white px-[14px] transition-colors hover:bg-[#F4F7FA]"><GoogleIcon /><span className="text-left text-[15px] font-bold leading-[20px]" style={{ color: NAVY }}>Continuar com Google</span></button>
              <div className="flex h-[20px] w-full items-center gap-[10px]"><div className="h-px flex-1" style={{ backgroundColor: BORDER }} /><span className="whitespace-nowrap text-[12px] font-normal leading-[16px]" style={{ color: GREY }}>ou com e-mail</span><div className="h-px flex-1" style={{ backgroundColor: BORDER }} /></div>
              <div className="flex w-full flex-col items-start gap-[8px]"><label htmlFor="auth-email" className={labelClass}>E-mail</label><div className={inputBox}><input id="auth-email" name="email" type="email" autoComplete="email" placeholder="seu@email.com" className={inputClass} /></div></div>
              <div className="flex w-full flex-col items-start gap-[8px]"><label htmlFor="auth-password" className={labelClass}>Senha</label><div className={inputBox}><input id="auth-password" name="password" type="password" autoComplete="current-password" placeholder="••••••••••" className={inputClass} /></div></div>
              <div className="flex min-h-[44px] w-full items-center justify-between gap-3"><label className="flex cursor-pointer items-center gap-[10px]"><input type="checkbox" className="h-[18px] w-[18px] cursor-pointer" style={{ accentColor: ORANGE }} /><span className="text-[14px] font-normal leading-[20px]" style={{ color: NAVY }}>Lembrar de mim</span></label><span className="text-[14px] font-bold leading-[18px]" style={{ color: ORANGE }}>Esqueci a senha</span></div>
              <button type="submit" className="h-[56px] w-full cursor-pointer rounded-[28px] text-[15px] font-bold leading-[20px] text-white transition-opacity hover:opacity-95" style={{ backgroundColor: ORANGE }}>Entrar no meu cantinho →</button>
              <div className="flex min-h-[44px] w-full flex-wrap items-center justify-center gap-[6px]"><span className="text-[14px] font-normal leading-[20px]" style={{ color: GREY }}>Ainda não tem conta?</span><span className="text-[14px] font-bold leading-[18px]" style={{ color: ORANGE }}>Criar conta →</span></div>
            </form>
            <aside className="hidden items-center justify-center md:flex md:w-[54%] md:flex-none"><div className="relative flex w-full items-center justify-center"><img src={Chave} alt="Ilustração da chave do Iagora" className="h-auto w-full max-w-[720px] object-contain" /></div></aside>
          </main>
          <footer className="h-6 shrink-0" />
        </div>
      </div>
    </>
  );
}
