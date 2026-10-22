import { Button, Title } from "../components/ui"
import { Header, Footer } from "../components"
import Imagemapresentativa from "../assets/images/imagemapresentativa.png"

export default function Aprendendo() {
    return (
        <>
            <Header />
            <div className='mx-30 mb-20 mt-10 flex flex-col items-center justify-center gap-4'>
                <Title variant="pequenoLj">Aprendendo a morar</Title>
                <Title variant="normal" className='text-7xl' >Ninguém nasce</Title>
                <div className='bg-(--laranja-principal) w-fit px-20 rotate-4 mt-5 mb-5 hover:rotate-0 transition-all duration-300'>
                    <h1 className='text-7xl font-heading text-white font-bold'>Sabendo</h1>
                </div>
                 <Title variant="pequeno">Guias diretos para aprender o que ninguém te contou sobre morar por conta própria.</Title>
                 <img src={Imagemapresentativa} alt="Imagem apresentativa" className='w-full max-w-4xl h-auto' />






                <Button variant="solido" className="mt-4" color="laranja">
                    Ver minha jornada
                </Button>
                <Title variant="normal">Aprendendo a morar</Title>
            </div>
            <Footer />
        </>
    );

}