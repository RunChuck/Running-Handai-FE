import { Routes, Route } from 'react-router-dom';

import Login from '@/pages/auth/Login';
import Auth from '@/pages/auth/Auth';
import AdminLogin from '@/pages/auth/AdminLogin';
import Course from '@/pages/course/Course';
import CourseDetail from '@/pages/courseDetail/CourseDetail';
import CourseCreation from '@/pages/courseCreation/CourseCreation';
import { CourseCreationProvider } from '@/contexts/CourseCreationContext';
import MyPage from '@/pages/mypage/MyPage';
import TermsPage from '@/pages/mypage/terms/TermsPage';
import InfoPage from '@/pages/mypage/Info/InfoPage';
import ReviewPage from '@/pages/mypage/review/ReviewPage';
import FavoritePage from '@/pages/mypage/favorites/FavoritePage';
import MyCoursePage from '@/pages/mypage/mycourse/MyCoursePage';
import MyCourseDetail from '@/pages/mypage/mycourse/MyCourseDetail';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/course" element={<Course />} />
      <Route path="/course-detail/:id" element={<CourseDetail />} />
      <Route
        path="/course-creation"
        element={
          <CourseCreationProvider>
            <CourseCreation />
          </CourseCreationProvider>
        }
      />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/terms" element={<TermsPage />} />
      <Route path="/mypage" element={<ProtectedRoute />}>
        <Route path="info" element={<InfoPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="favorites" element={<FavoritePage />} />
        <Route path="mycourse" element={<MyCoursePage />} />
        <Route path="mycourse/:id" element={<MyCourseDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
