import MeuPerfil from './components/meuperfil'
import InfoPessoais from './components/info_pessoais'
import SobControle from './components/sobcontrole'  
import Footer from '../../shared/footer'
import Styles from './perfil.module.css'
import { Info } from 'lucide-react'
import { useState } from 'react'

export default function Perfil() {

    const [view, setView] = useState(1)

    return (
        <main className={Styles.main_perfil}>

        {
            view == 1 && (<MeuPerfil mudarView={setView} />)
        }
        {
            view == 2 && (<InfoPessoais mudarView={setView} />)
        }

        <SobControle />

        <Footer />

        </main >
            

    
    )
}
