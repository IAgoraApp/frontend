export default function FinancasA (){
    return(
        <>
        <h6 className='text-orange-600 text-[14px] mx-30'> SEU DINHEIRO EM PERSPECTIVA </h6>

        <div className='relative w-100% mx-30 flex justify-between items-center'>

            <h1 className='text-[48px]'>Meu mês </h1>
            
            <div className='relative h-15 flex gap-5 items-center'>

            <a href="#" className='relative w-40 h-10 text-[15px] flex justify-center items-center rounded-[9px] border-[1.5px] border-[#D9E2EC]'>Este mês ⌄</a>

            <a href="#" className='relative w-60 h-10 text-[#ffff] bg-[#C64411] rounded-[28px] text-[15px] flex justify-center items-center'>+ Adicionar lançamento</a>
            </div>
        </div>
         <h6 className='text-[17px] text-[#627D98] mx-30'>Acompanhe seus ganhos, gastos e mantenha o controle.</h6>
         <nav className='relative mx-30 text-[15px] flex gap-8 mt-5 border-b border-[#D9E2EC]'>
            <a href="#" className="border-b-2 border-[#C64411] pb-2">Visão geral</a>
            <a href="#">Lançamentos</a>
            <a href="#">Categorias</a>
            <a href="#">Metas</a>
         </nav>
        </>
    )
}
