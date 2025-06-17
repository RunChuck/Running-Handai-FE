import { Routes, Route } from 'react-router-dom';

import Login from '@/pages/auth/Login';
import Main from '@/pages/main/Main';
import Test from '@/pages/temp/Test';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
};

export default AppRoutes;
