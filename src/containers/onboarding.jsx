import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logoLaranja.png";
import Chaves from "../assets/images/chaves.png";
import Mulher from "../assets/images/img esquerda.png";
import Homem from "../assets/images/img2.png";
export default function SeuMomento() {
  const navigate = useNavigate();

  const opcoes = [
    {    id: "planejando",    titulo: "Quero morar sozinho",    descricao:      "Planejar os gastos, encontrar uma casa e se preparar para a mudança.",    imagem: Mulher,    fundo: "#FCE8DC",  },  {    id: "morando",    titulo: "Já moro sozinho",    descricao:      "Manter a casa, organizar a rotina e resolver problemas do dia a dia.",    imagem: Homem,    fundo: "#FFFFFF",  },
  ];

  return (
    <main
      className="w-full"
      style={{
        backgroundColor: "#102A43",
        color: "#FFFFFF",
        fontFamily: "'DM Sans', sans-serif",
        height: "auto",
        width: "100%",
        margin: 0,
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-9 md:px-12 lg:px-[72px]">

        {/* Cabeçalho */}
        <header className="flex w-full items-center justify-between gap-4">
          <div className="ml-auto flex shrink-0 items-center justify-end gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#D54C15]" />

            <span className="whitespace-nowrap text-xs font-bold tracking-[0.7px] text-white">
              SEU MOMENTO · 01 / 01
            </span>
          </div>
        </header>

        {/* Título, logo e ilustração */}
        <section className="flex items-center justify-between gap-6">
          <div className="flex min-w-0 flex-col items-start gap-3">

            {/* Logo */}
            <img
              src={Logo}
              alt="IAGORA"
              className="mb-2 h-[47px] w-[126px] object-contain object-left"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <p className="text-[15px] font-bold tracking-[0.7px] text-[#D54C15]">
              EI, QUE BOM TER VOCÊ AQUI!
            </p>

            <h1
              className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-[88px] lg:leading-[92px]"
              style={{
                color: "#FFFFFF",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              Seu agora
              <br />
              começa onde?
            </h1>

            <p className="text-lg leading-[27px] text-white">
              Cada começo é diferente. Conta pra gente qual é o seu.
            </p>
          </div>

          {/* Chave e casa na lateral direita */}
          <img
            src={Chaves}
           
            className="hidden h-40 w-[154px] shrink-0 object-contain md:block lg:h-[190px] lg:w-[190px]"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
        </section>

        {/* Cards de seleção */}
        <section className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          {opcoes.map((opcao) => {
            return (
              <button
                key={opcao.id}
                type="button"
                onClick={() => navigate("/home")}
                className="flex w-full flex-col overflow-hidden rounded-md text-left transition duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-[#D54C15]"
                style={{
                  backgroundColor: opcao.fundo,
                  border: "1px solid rgba(16, 42, 67, 0.15)",
                  boxShadow: "none",
                }}
              >
                {/* Imagem do card */}
                <div className="h-[240px] w-full bg-[#E8EDF2] sm:h-[299px]">
                  <img
                    src={opcao.imagem}
                    alt={opcao.titulo}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </div>

                {/* Texto do card */}
                <div className="flex min-h-[146px] flex-col gap-3 px-6 py-6 sm:px-8">
                  <h2
                    className="text-[25px] font-extrabold leading-9 sm:text-[30px]"
                    style={{
                      color: "#102A43",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    {opcao.titulo}
                  </h2>

                  <p className="text-base leading-6 text-[#102A43] sm:text-lg">
                    {opcao.descricao}
                  </p>
                </div>
              </button>
            );
          })}
        </section>

        {/* Rodapé */}
        <footer className="flex w-full items-center justify-center gap-2.5 pb-1 text-center">
          <span className="text-[17px] font-bold text-[#D54C15]">
            ↗
          </span>

          <p className="text-[15px] leading-[22px] text-white">
            Pode mudar de ideia depois. Seu momento também muda!
          </p>
        </footer>
      </div>
    </main>
  );
}
