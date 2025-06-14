import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;
