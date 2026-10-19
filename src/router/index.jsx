import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Pages } from '../containers';
import { PrivateRoute, PublicRoute } from '../utils/checkAuth';

// const Layout = () => (
//     <div className='page-content'>
//         <Outlet />
//     </div>
// );

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
                        path: '/sobrenos',
                        element: <Pages.SobreNos />,     
                    }
                ],
            },
            {
                element: <PrivateRoute />,
                children: [
                    {
                        path: '/home',
                        element: <Pages.Home />,
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
