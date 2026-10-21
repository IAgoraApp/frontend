import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Pages } from '../containers';
import { PrivateRoute, PublicRoute } from '../utils/checkAuth';


const routes = createBrowserRouter([
    {
        element: <Outlet />,
        errorElement: <Pages.TelaErro />,
        children: [
            {
                path: '/manutencao',
                element: <h1>Tela em manutenção</h1>,
            },
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: '/',
                        element: <Pages.LandingPage />,
                    },
                    {
                        path: '/cadastro-empresa',
                        element: <Pages.CadastroEmpresa />,
                    },
                    {
                        path: '/cadastroEmpresa',
                        element: <Pages.CadastroEmpresa />,
                    },
                    {
                        path: '/parceiros',
                        element: <Pages.CadastroEmpresa />,
                    },
                    {
                        path: '/seja-parceiro',
                        element: <Pages.CadastroEmpresa />,
                    },
                ],
            },
            {
                element: <PrivateRoute />,
                children: [
                    {
                        path: '/home',
                        element: <Pages.Home />,
                    },
                    {
                        path: '/dashboard',
                        element: <Pages.Dashboard />,
                    },
                    {
                        path: '/meus-servicos',
                        element: <Pages.MeusServicos />,
                    },
                    {
                        path: '/meusServicos',
                        element: <Pages.MeusServicos />,
                    },
                    {
                        path: '/perfil-empresa',
                        element: <Pages.PerfilEmpresa />,
                    },
                    {
                        path: '/perfilEmpresa',
                        element: <Pages.PerfilEmpresa />,
                    },
                    {
                        path: '/marketplace',
                        element: <Pages.Marketplace />,
                    },
                ],
            },
        ],
    },
]);

const AppRoutes = () => {
    return <RouterProvider router={routes} />;
};

export default AppRoutes;
