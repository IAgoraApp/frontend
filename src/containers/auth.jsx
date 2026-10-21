import { useState } from "react";

const ORANGE = "#C64411";
const ORANGE_BRAND = "#D54C15";
const NAVY = "#102A43";
const GREY = "#526579";
const BORDER = "#D8E1E8";
const SURFACE = "#FFFFFF";
const SOFT = "#F4F7FA";

function EyeIcon({ open }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={NAVY}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 002.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.2 3" />
          <path d="M6.2 6.2C3.8 7.7 2.5 10 2 12c1 2.5 4.5 7 10 7 1.1 0 2.1-.2 3-.5" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

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

function Illustration() {
  return (
    <svg
      width="392"
      height="392"
      viewBox="0 0 392 392"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* Balão de fala */}
      <path
        d="M168 140 L160 158 L180 150 Z"
        fill={SURFACE}
        stroke={NAVY}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <ellipse cx="190" cy="126" rx="34" ry="30" fill={SURFACE} stroke={NAVY} strokeWidth="7" />

      {/* Chave */}
      <g transform="rotate(14 150 230)">
        <circle cx="138" cy="172" r="20" fill={SURFACE} stroke={NAVY} strokeWidth="7" />
        <rect x="131" y="190" width="14" height="112" rx="3" fill={SURFACE} stroke={NAVY} strokeWidth="7" />
        <rect x="145" y="262" width="12" height="12" fill={SURFACE} stroke={NAVY} strokeWidth="6" />
        <rect x="145" y="284" width="10" height="12" fill={SURFACE} stroke={NAVY} strokeWidth="6" />
      </g>

      {/* Casinha */}
      <path
        d="M254 164 L300 204 L300 302 L210 302 L210 204 Z"
        fill={SURFACE}
        stroke={NAVY}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <rect x="252" y="264" width="16" height="22" fill={ORANGE_BRAND} stroke={NAVY} strokeWidth="5" />
    </svg>
  );
}

function BoxIllustration() {
  return (
    <svg width="135" height="106" viewBox="0 0 135 106" aria-hidden="true">
      <path d="M14 46 L42 26 L94 26 L120 46 Z" fill="none" stroke={NAVY} strokeWidth="6" strokeLinejoin="round" />
      <path d="M14 46 L14 92 L72 98 L72 52 Z" fill={SURFACE} stroke={NAVY} strokeWidth="6" strokeLinejoin="round" />
      <path d="M72 52 L120 46 L120 88 L72 98 Z" fill={SOFT} stroke={NAVY} strokeWidth="6" strokeLinejoin="round" />
      <path d="M52 14 L60 36" stroke={ORANGE_BRAND} strokeWidth="5" strokeLinecap="round" />
      <path d="M96 66 L104 84" stroke={ORANGE_BRAND} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export default function Auth({ onLogin, onRegister, onForgotPassword, onGoogleLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(event) {
    event?.preventDefault();
    setMessage("");

    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage("Informe um e-mail válido.");
      return;
    }
    if (!password) {
      setMessage("Informe sua senha.");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    const handler = isLogin ? onLogin : onRegister;
    if (typeof handler !== "function") {
      setMessage(
        isLogin
          ? "Configure onLogin para conectar o serviço de autenticação."
          : "Configure onRegister para conectar o serviço de cadastro."
      );
      return;
    }

    setBusy(true);
    try {
      const result = await handler(
        isLogin
          ? { email: normalizedEmail, password, rememberMe }
          : { email: normalizedEmail, password }
      );
      if (result?.error) {
        throw new Error(result.error.message || "Não foi possível concluir a operação.");
      }
      setMessage(isLogin ? "Login realizado com sucesso." : "Cadastro realizado com sucesso.");
    } catch (error) {
      setMessage(error?.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  function toggleMode() {
    setMode((current) => (current === "login" ? "register" : "login"));
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  async function handleForgotPassword() {
    setMessage("");
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setMessage("Informe seu e-mail para recuperar a senha.");
      return;
    }
    if (typeof onForgotPassword !== "function") {
      setMessage("Configure onForgotPassword para habilitar a recuperação de senha.");
      return;
    }
    try {
      await onForgotPassword({ email: normalizedEmail });
      setMessage("Se houver uma conta para este e-mail, você receberá instruções de recuperação.");
    } catch (error) {
      setMessage(error?.message || "Não foi possível solicitar a recuperação.");
    }
  }

  const inputBox =
    "w-full h-[56px] pl-[16px] pr-[8px] bg-white rounded-[8px] border border-[#D8E1E8] flex items-center gap-[8px]";
  const inputClass =
    "w-full min-w-0 bg-transparent text-[#526579] text-[16px] leading-[24px] font-normal outline-none placeholder:text-[#526579]";
  const labelClass = "text-[#102A43] text-[14px] leading-[18px] font-bold";

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;700&display=swap");
      `}</style>

      <div
        className="relative w-full min-h-screen bg-white overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="relative mx-auto w-[1440px] h-[900px] bg-white overflow-hidden">
          {/* Logo */}
          <div
            className="absolute left-[72px] top-[30px] select-none"
            style={{ color: ORANGE, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 30, fontWeight: 700, letterSpacing: "-0.5px" }}
            aria-label="Logo Iagora"
          >
            lagora
          </div>

          {/* Slogan */}
          <div
            className="absolute right-[48px] top-[50px] text-[12px] font-bold leading-[16px] tracking-[0.7px]"
            style={{ color: GREY }}
          >
            IAGORA · SEU NOVO CAPÍTULO
          </div>

          {/* Formulário */}
          <form
            onSubmit={handleSubmit}
            className="absolute left-[72px] top-[135px] w-[520px] flex flex-col items-start gap-[12px] bg-white"
          >
            {/* Cabeçalho */}
            <div className="w-full flex flex-col items-start gap-[8px]">
              <span
                className="text-[12px] font-bold leading-[16px] tracking-[0.7px]"
                style={{ color: ORANGE }}
              >
                {isLogin ? "OLHA QUEM VOLTOU!" : "SEJA BEM-VINDO AO IAGORA"}
              </span>

              <h1
                className="text-[56px] leading-[60px] font-extrabold tracking-[-1px]"
                style={{ color: NAVY, fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {isLogin ? (
                  <>
                    Que bom ter você
                    <br />
                    de volta!
                  </>
                ) : (
                  <>
                    Vamos começar
                    <br />
                    seu capítulo?
                  </>
                )}
              </h1>

              <p className="text-[16px] leading-[24px] font-normal" style={{ color: GREY }}>
                {isLogin
                  ? "Seu cantinho no Iagora está te esperando."
                  : "Crie sua conta para começar sua jornada no Iagora."}
              </p>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={onGoogleLogin}
              className="w-full h-[56px] px-[14px] bg-white rounded-[12px] border border-[#D8E1E8] flex items-center gap-[14px] cursor-pointer hover:bg-[#F4F7FA] transition-colors"
            >
              <GoogleIcon />
              <span className="text-left text-[15px] leading-[20px] font-bold" style={{ color: NAVY }}>
                Continuar com Google
              </span>
            </button>

            {/* Divisor */}
            <div className="w-full h-[20px] flex items-center gap-[10px]">
              <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
              <span className="text-[12px] leading-[16px] font-normal whitespace-nowrap" style={{ color: GREY }}>
                ou com e-mail
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
            </div>

            {/* E-mail */}
            <div className="w-full flex flex-col items-start gap-[8px]">
              <label htmlFor="auth-email" className={labelClass} style={{ color: NAVY }}>
                E-mail
              </label>
              <div className={inputBox}>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="w-full flex flex-col items-start gap-[8px]">
              <label htmlFor="auth-password" className={labelClass} style={{ color: NAVY }}>
                Senha
              </label>
              <div className={inputBox}>
                <input
                  id="auth-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder="••••••••••"
                  className={inputClass}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                  className="w-[44px] h-[44px] shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirmar senha (cadastro) */}
            {!isLogin && (
              <div className="w-full flex flex-col items-start gap-[8px]">
                <label htmlFor="auth-confirm-password" className={labelClass} style={{ color: NAVY }}>
                  Confirmar senha
                </label>
                <div className={inputBox}>
                  <input
                    id="auth-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Repita sua senha"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Ocultar confirmação da senha" : "Mostrar confirmação da senha"}
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="w-[44px] h-[44px] shrink-0 flex items-center justify-center cursor-pointer"
                  >
                    <EyeIcon open={showConfirmPassword} />
                  </button>
                </div>
              </div>
            )}

            {/* Mensagem */}
            {message && (
              <p role="status" aria-live="polite" className="w-full text-[14px] leading-[20px]" style={{ color: ORANGE }}>
                {message}
              </p>
            )}

            {/* Lembrar / Esqueci */}
            {isLogin && (
              <div className="w-full h-[44px] flex items-center justify-between">
                <label className="flex items-center gap-[10px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-[18px] h-[18px] cursor-pointer"
                    style={{ accentColor: ORANGE }}
                  />
                  <span className="text-[14px] leading-[20px] font-normal" style={{ color: NAVY }}>
                    Lembrar de mim
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[14px] leading-[18px] font-bold hover:underline cursor-pointer"
                  style={{ color: ORANGE }}
                >
                  Esqueci a senha
                </button>
              </div>
            )}

            {/* Botão principal */}
            <button
              type="submit"
              disabled={busy}
              className="w-full h-[56px] rounded-[28px] text-white text-[15px] leading-[20px] font-bold cursor-pointer hover:opacity-95 transition-opacity disabled:opacity-60"
              style={{ backgroundColor: ORANGE }}
            >
              {busy ? "Aguarde..." : isLogin ? "Entrar no meu cantinho →" : "Criar minha conta →"}
            </button>

            {/* Alternar modo */}
            <div className="w-full h-[44px] flex items-center justify-center gap-[6px]">
              <span className="text-[14px] leading-[20px] font-normal" style={{ color: GREY }}>
                {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className="text-[14px] leading-[18px] font-bold hover:underline cursor-pointer"
                style={{ color: ORANGE }}
              >
                {isLogin ? "Criar conta →" : "Fazer login →"}
              </button>
            </div>
          </form>

          {/* Badge */}
          <div
            className="absolute left-[868px] top-[200px] w-[270px] h-[36px] flex items-center justify-center rounded-[2px] shadow-sm"
            style={{ backgroundColor: ORANGE, transform: "rotate(3deg)", transformOrigin: "center" }}
          >
            <span className="text-white text-[12px] font-bold leading-[16px] tracking-[0.7px]">
              A CHAVE DO SEU NOVO CAPÍTULO
            </span>
          </div>

          {/* Círculo laranja */}
          <div
            className="absolute left-[866px] top-[246px] w-[392px] h-[392px] rounded-full"
            style={{ backgroundColor: ORANGE_BRAND }}
          />

          {/* Ilustração chave + casinha */}
          <div className="absolute left-[866px] top-[246px]">
            <Illustration />
          </div>

          {/* Caixa */}
          <div className="absolute left-[798px] top-[597px]">
            <BoxIllustration />
          </div>

          {/* Foto (substitua pela imagem real) */}
          <img
            className="absolute left-[1171px] top-[466px] w-[200px] h-[254px] rounded-[20px] object-cover shadow-lg"
            style={{ transform: "rotate(-4deg)", border: "8px solid #FFFFFF" }}
            src="https://placehold.co/200x254"
            alt="Foto ilustrativa"
          />
        </div>
      </div>
    </>
  );
}