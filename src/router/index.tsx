import { Routes, Route } from 'react-router-dom';

import Login from '@/pages/auth/Login';
import Auth from '@/pages/auth/Auth';
import Main from '@/pages/main/Main';
import CourseDetail from '@/pages/course/CoursDetail';
import Test from '@/pages/temp/Test';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/main" element={<Main />} />
      <Route path="/course-detail/:id" element={<CourseDetail />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
};

export default AppRoutes;
