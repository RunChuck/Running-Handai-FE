import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@/styles/ThemeProvider';
import AppRoutes from '@/router';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
