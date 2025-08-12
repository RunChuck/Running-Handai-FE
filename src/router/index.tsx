import { Routes, Route } from 'react-router-dom';

import Login from '@/pages/auth/Login';
import Auth from '@/pages/auth/Auth';
import Course from '@/pages/course/Course';
import CourseDetail from '@/pages/courseDetail/CourseDetail';
import MyPage from '@/pages/mypage/MyPage';
import InfoPage from '@/pages/mypage/Info/InfoPage';
import ReviewPage from '@/pages/mypage/review/ReviewPage';
import Test from '@/pages/temp/Test';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/course" element={<Course />} />
      <Route path="/course-detail/:id" element={<CourseDetail />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/info" element={<InfoPage />} />
      <Route path="/mypage/review" element={<ReviewPage />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
};

export default AppRoutes;
