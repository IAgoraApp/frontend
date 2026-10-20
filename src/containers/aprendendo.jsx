import {Button, Title} from "../components/ui"

export default function Aprendendo() {
  return (
    <div className='mx-30 mb-20 mt-10'>
      <h1 className='text-3xl font-bold'>Aprendendo</h1>
      
      <Button variant="solido" className="mt-4" color="laranja">
        Clique aqui
      </Button>
      <Title variant="normal">Aprendendo a morar</Title>
    </div>
  );

}