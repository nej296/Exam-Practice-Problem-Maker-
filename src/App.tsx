import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import SemesterGrid from './components/scheduler/SemesterGrid';
import SemesterDetail from './components/scheduler/SemesterDetail';
import ClassSelector from './components/practice/ClassSelector';
import ProblemCreator from './components/practice/ProblemCreator';
import SuccessScreen from './components/practice/SuccessScreen';
import StudyModeSelectPage from './components/study/StudyModeSelectPage';
import StudySession from './components/study/StudySession';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/scheduler" replace />} />
            <Route path="/scheduler" element={<SemesterGrid />} />
            <Route path="/scheduler/:semesterId" element={<SemesterDetail />} />
            <Route path="/practice" element={<ClassSelector />} />
            <Route path="/practice/:semesterId/:classId" element={<ProblemCreator />} />
            <Route path="/practice/:semesterId/:classId/success" element={<SuccessScreen />} />
            <Route path="/study/:semesterId/:classId/:setId" element={<StudyModeSelectPage />} />
            <Route path="/study/:semesterId/:classId/:setId/session" element={<StudySession />} />
          </Routes>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
