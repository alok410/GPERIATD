import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const studentId = JSON.parse(localStorage.getItem("id"));
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [allLectures, setAllLectures] = useState([]);
  const [filter, setFilter] = useState("all"); // all, present, absent

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentData = async () => {
      try {
        const res1 = await fetch(`https://gperiatd.onrender.com/students/getById/${studentId}`);
        const student = await res1.json();
        console.log("👤 Student:", student);

        const res2 = await fetch(`https://gperiatd.onrender.com/subjects/byClass/${student.class_id}`);
        const subjectData = await res2.json();
        const validSubjects = Array.isArray(subjectData) ? subjectData.filter(s => s && s.name) : [];

        setSubjects(validSubjects);
        if (validSubjects.length > 0) setSelectedSubject(validSubjects[0]);

        const res3 = await fetch(`https://gperiatd.onrender.com/attendance/student/${studentId}`);
        const attData = await res3.json();
        console.log("🧾 Raw Attendance Records:", attData.records);
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
        console.log("📅 All Fetched Lectures:", data);
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
        const attended = attendance.find(a => a.lecture_id === lec.id && a.student_id === studentId);
        if (filter === "present") return attended;
        if (filter === "absent") return !attended;
        return true;
      });
  };

  const lectures = filterAttendance(allLectures, 1);
  const labs = filterAttendance(allLectures, 2);

  const totalLectures = allLectures.filter(l => l.duration === 1).length;
  const totalLabs = allLectures.filter(l => l.duration === 2).length;

  const presentLectures = attendance.filter(a =>
    allLectures.some(l => l.duration === 1 && l.id === a.lecture_id && a.student_id === studentId)
  ).length;

  const presentLabs = attendance.filter(a =>
    allLectures.some(l => l.duration === 2 && l.id === a.lecture_id && a.student_id === studentId)
  ).length;

  const barData = {
    labels: ['Lectures', 'Labs'],
    datasets: [
      {
        label: 'Total',
        data: [totalLectures, totalLabs],
        backgroundColor: '#0ea5e9'
      },
      {
        label: 'Present',
        data: [presentLectures, presentLabs],
        backgroundColor: '#22c55e'
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Attendance Summary' }
    }
  };

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <h2 style={heading}>📚 Subjects</h2>
        <ul style={listStyle}>
          {subjects.map((subj, i) => (
            <li key={i}>
              <button
                style={subBtn(selectedSubject && subj.id === selectedSubject.id)}
                onClick={() => setSelectedSubject(subj)}
              >
                {subj.name}
              </button>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>Filter Attendance:</label>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="present">Present Only</option>
            <option value="absent">Absent Only</option>
          </select>
        </div>

        {selectedSubject && (
          <div style={infoCard}>
            <h3>📖 {selectedSubject.name} - Lecture Attendance</h3>
            <ul>
              {lectures.length === 0 ? (
                <p>No lecture records found.</p>
              ) : (
                lectures.map((lec, i) => {
                  const attended = attendance.find(
                    a => a.lecture_id === lec.id && a.student_id === studentId
                  );
                  console.log(`[Lecture] ID: ${lec.id}, Topic: ${lec.topic}, Attended: ${!!attended}`);
                  return (
                    <li key={i}>
                      {lec.date} - Topic: {lec.topic} - {attended ? '✅ Present' : '❌ Absent'}
                    </li>
                  );
                })
              )}
            </ul>

            <h3 style={{ marginTop: '20px' }}>🔬 {selectedSubject.name} - Lab Attendance</h3>
            <ul>
              {labs.length === 0 ? (
                <p>No lab records found.</p>
              ) : (
                labs.map((lec, i) => {
                  const attended = attendance.find(
                    a => a.lecture_id === lec.id && a.student_id === studentId
                  );
                  console.log(`[Lab] ID: ${lec.id}, Topic: ${lec.topic}, Attended: ${!!attended}`);
                  return (
                    <li key={i}>
                      {lec.date} - Topic: {lec.topic} - {lec.status} - {attended ? '✅ Present' : '❌ Absent'}
                    </li>
                  );
                })
              )}
            </ul>

            <div style={{ marginTop: '2rem' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// 🎨 Styles
const pageStyle = {
  padding: "2rem",
  background: "linear-gradient(to bottom right, #1e293b, #0f172a)",
  color: "#fff",
  minHeight: "100vh"
};

const heading = {
  fontSize: "2rem",
  marginBottom: "1rem"
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  display: "flex",
  flexWrap: "wrap",
  gap: "10px"
};

const subBtn = (active) => ({
  background: active ? "#2563eb" : "#0ea5e9",
  color: "#fff",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer"
});

const infoCard = {
  background: "#1f2937",
  padding: "1rem",
  borderRadius: "10px",
  marginTop: "2rem",
  boxShadow: "0 0 10px rgba(0,0,0,0.2)"
};

export default StudentDashboard;
