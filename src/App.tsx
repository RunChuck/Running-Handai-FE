import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@/styles/ThemeProvider';
import { MapProvider } from '@/contexts/MapContext';
import AppRoutes from '@/router';
import '@/locales'; 

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MapProvider>
          <AppRoutes />
        </MapProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
