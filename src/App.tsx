import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from '@/styles/ThemeProvider';
import { MapProvider } from '@/contexts/MapContext';
import AppRoutes from '@/router';
import { queryClient } from '@/lib/queryClient';
import '@/locales'; 

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <MapProvider>
            <AppRoutes />
          </MapProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
