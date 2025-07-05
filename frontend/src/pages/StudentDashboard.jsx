import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const StudentDashboard = () => {
  const studentId = JSON.parse(localStorage.getItem("id"));
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [allLectures, setAllLectures] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentData = async () => {
      try {
        const res1 = await fetch(`https://gperiatd.onrender.com/students/getById/${studentId}`);
        const student = await res1.json();

        const res2 = await fetch(`https://gperiatd.onrender.com/subjects/byClass/${student.class_id}`);
        const subjectData = await res2.json();
        const validSubjects = Array.isArray(subjectData) ? subjectData.filter(s => s && s.name) : [];

        setSubjects(validSubjects);
        if (validSubjects.length > 0) setSelectedSubject(validSubjects[0]);

        const res3 = await fetch(`https://gperiatd.onrender.com/attendance/student/${studentId}`);
        const attData = await res3.json();
        setAttendance(attData.records || []);
      } catch (error) {
        console.error("❌ Error loading data:", error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  useEffect(() => {
    if (!selectedSubject) return;

    const fetchLectures = async () => {
      try {
        const res = await fetch(`https://gperiatd.onrender.com/lectures/bySubject/${selectedSubject.id}`);
        const data = await res.json();
        setAllLectures(data || []);
      } catch (err) {
        console.error("❌ Error fetching lectures:", err);
      }
    };

    fetchLectures();
  }, [selectedSubject]);

  const filterAttendance = (lectures, durationType) => {
    return lectures
      .filter(lec => lec.duration === durationType)
      .filter(lec => {
        const record = attendance.find(
          a => a.lecture_id === lec.id && a.student_id === studentId
        );
        if (filter === "present") return record?.status === "Present";
        if (filter === "absent") return !record || record.status !== "Present";
        return true;
      });
  };

  const lectures = filterAttendance(allLectures, 1);
  const labs = filterAttendance(allLectures, 2);

  const totalLectures = allLectures.filter(l => l.duration === 1).length;
  const totalLabs = allLectures.filter(l => l.duration === 2).length;

  const presentLectures = attendance.filter(
    a =>
      a.student_id === studentId &&
      a.status === "Present" &&
      allLectures.some(l => l.id === a.lecture_id && l.duration === 1)
  ).length;

  const presentLabs = attendance.filter(
    a =>
      a.student_id === studentId &&
      a.status === "Present" &&
      allLectures.some(l => l.id === a.lecture_id && l.duration === 2)
  ).length;

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <h2 style={heading}>📚 My Subjects</h2>
        <div style={subjectContainer}>
          {subjects.map((subj, i) => (
            <button
              key={i}
              style={subBtn(selectedSubject && subj.id === selectedSubject.id)}
              onClick={() => setSelectedSubject(subj)}
            >
              {subj.name}
            </button>
          ))}
        </div>

        <div style={filterStyle}>
          <label style={{ marginRight: '0.5rem' }}>📌 Filter:</label>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={dropdown}
          >
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>
            {/* Foughnits Section */}
            <div style={foughnitBox}>
              <h4>📊 Attendance Summary:</h4>
              <p>🎓 Lectures: {presentLectures} / {totalLectures}</p>
              <p>🔬 Labs: {presentLabs} / {totalLabs}</p>
            </div>

        {selectedSubject && (
          <div style={infoCard}>
            <h3 style={subHeading}>📖 Lecture Attendance</h3>
            <ul>
              {lectures.length === 0 ? (
                <p>No lecture records found.</p>
              ) : (
                lectures.map((lec, i) => {
                  const record = attendance.find(
                    a => a.lecture_id === lec.id && a.student_id === studentId
                  );
                  return (
                    <li key={i} style={listItem}>
                      <strong>{new Date(lec.date).toLocaleDateString('en-GB')}</strong> - Topic: <em>{lec.topic}</em> - <span>{record?.status === "Present" ? '✅ Present' : '❌ Absent'}</span>
                    </li>
                  );
                })
              )}
            </ul>

            <h3 style={subHeading}>🔬 Lab Attendance</h3>
            <ul>
              {labs.length === 0 ? (
                <p>No lab records found.</p>
              ) : (
                labs.map((lec, i) => {
                  const record = attendance.find(
                    a => a.lecture_id === lec.id && a.student_id === studentId
                  );
                  return (
                    <li key={i} style={listItem}>
                      <strong>{new Date(lec.date).toLocaleDateString('en-GB')}</strong> - Topic: <em>{lec.topic}</em> - <span>{record?.status === "Present" ? '✅ Present' : '❌ Absent'}</span>
                    </li>
                  );
                })
              )}
            </ul>

          </div>
        )}
      </div>
    </>
  );
};

// 🎨 Styles
const pageStyle = {
  padding: "2rem",
  background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
  color: "#f8fafc",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const heading = {
  fontSize: "2rem",
  marginBottom: "1.5rem",
  fontWeight: "600"
};

const subjectContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "1rem"
};

const subBtn = (active) => ({
  background: active ? "#2563eb" : "#3b82f6",
  color: "#fff",
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "0.95rem",
  fontWeight: "500",
  transition: "0.2s"
});

const filterStyle = {
  margin: "1rem 0",
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

const dropdown = {
  padding: "0.5rem",
  borderRadius: "6px",
  fontSize: "1rem"
};

const infoCard = {
  background: "#1e293b",
  padding: "1.5rem",
  borderRadius: "10px",
  marginTop: "2rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
};

const subHeading = {
  fontSize: "1.25rem",
  marginBottom: "1rem",
  fontWeight: "500",
  color: "#93c5fd"
};

const listItem = {
  marginBottom: "0.75rem"
};

const foughnitBox = {
  marginTop: "2rem",
  padding: "1rem",
  backgroundColor: "#0f172a",
  borderRadius: "10px",
  border: "1px solid #334155",
  fontSize: "1rem",
  lineHeight: "1.8"
};

export default StudentDashboard;
