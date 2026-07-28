import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Authentication from './pages/authentication';
import LandingPage from './pages/landingPage';
import HomePage from './pages/homePage';
import ProfilePage from './pages/profilePage';
import FormPage from './pages/formPage';
import { AuthProvider } from './contexts/AuthContext';
import { InterviewProvider } from './contexts/InterviewContext';
import { SubmissionProvider } from './contexts/SubmissionContext';
import InterviewPage from './pages/interviewPage';
import FeedbackPage from './pages/feedbackPage';
import ChangePassword from "./pages/changePassword";

function App() {
  return (
    <Router>
  <AuthProvider>
    <InterviewProvider>
      <SubmissionProvider>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/inter/:id" element={<InterviewPage />} />
        <Route path="/feed/:id" element={<FeedbackPage />} />
        <Route path="/change-password" element={<ChangePassword />}/>
      </Routes>

      </SubmissionProvider>
    </InterviewProvider>
  </AuthProvider>
</Router>
  );
}

export default App;