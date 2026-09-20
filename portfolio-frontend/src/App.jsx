import { AuthProvider } from './context/AuthProvider';
import AppRoutes from './routes/AppRoutes';
import PortfolioProvider from './context/PortfolioProvider';

function App() {
    return (
        <AuthProvider>
            <PortfolioProvider>
                <AppRoutes />
            </PortfolioProvider>
        </AuthProvider>
    );
}

export default App;
