// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import HodDashboard from './pages/HodDashboard';
import PrincipalDashboard from './pages/PrincipalDashboard';

import AllStudents from './pages/AllStudents';
import AllFaculty from './pages/AllFaculty';
import AllHOD from './pages/AllHOD';
import AllPrincipal from './pages/AllPrincipal';
import AllClasses from './pages/AllClasses';

import Forbidden from './pages/Forbidden';
import AssignSubject from './pages/AssignSubject';
import MySubjects from './pages/MySubjects';
import AllLectures from './pages/AllLectures';
import CreateSubjects from './pages/CreateSubject';
import Attendance from './pages/Attendence';
import Report from './pages/Report';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/403" element={<Forbidden />} />

        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AllStudents /></ProtectedRoute>} />
        <Route path="/admin/faculty" element={<ProtectedRoute allowedRoles={['admin']}><AllFaculty /></ProtectedRoute>} />
        <Route path="/admin/hod" element={<ProtectedRoute allowedRoles={['admin']}><AllHOD /></ProtectedRoute>} />
        <Route path="/admin/principal" element={<ProtectedRoute allowedRoles={['admin']}><AllPrincipal /></ProtectedRoute>} />
        <Route path="/admin/classes" element={<ProtectedRoute allowedRoles={['admin']}><AllClasses /></ProtectedRoute>} />


        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/hod/dashboard" element={<ProtectedRoute allowedRoles={['hod']}><HodDashboard /></ProtectedRoute>} />
        <Route path="/principal/dashboard" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDashboard /></ProtectedRoute>} />

        <Route path="/hod/assign-subject" element={<ProtectedRoute allowedRoles={['hod']}><AssignSubject /></ProtectedRoute>} />
        <Route path="/hod/create-subject" element={<ProtectedRoute allowedRoles={['hod']}><CreateSubjects /></ProtectedRoute>} />
        <Route path="/faculty/my-subjects" element={<ProtectedRoute allowedRoles={['faculty']}><MySubjects /></ProtectedRoute>} />
        <Route path="/faculty/my-subjects/:id" element={<ProtectedRoute allowedRoles={['faculty']}><AllLectures /></ProtectedRoute>} />
        <Route path="/faculty/my-subjects/:subjectId/:lectureId" element={<ProtectedRoute allowedRoles={['faculty']}><Attendance /></ProtectedRoute>} />
        <Route path="/faculty/my-subjects/report/:subjectId/:facultyId" element={<ProtectedRoute allowedRoles={['faculty']}><Report /></ProtectedRoute>} />
        

      
      </Routes>
    </Router>
  );
}

export default App;