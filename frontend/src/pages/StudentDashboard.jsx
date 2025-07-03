import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const StudentDashboard = () => {
  const studentId = JSON.parse(localStorage.getItem("id"));
  const [classInfo, setClassInfo] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      try {
        const res1 = await fetch(`http://localhost:5000/students/getById/${studentId}`);
        const studentData = await res1.json();
        setClassInfo(studentData.classDetails);

        const res2 = await fetch(`http://localhost:5000/subjects/byClass/${studentData.class_id}`);
        const subjectData = await res2.json();
        setSubjects(subjectData || []);

        const res3 = await fetch(`http://localhost:5000/attendance/student/${studentId}`);
        const attendanceData = await res3.json();
        setAttendance(attendanceData.records || []);
        console.log("Attendance records:", attendanceData.records);

        const res4 = await fetch(`http://localhost:5000/lectures/getAllLecture`);
        const lectureData = await res4.json();
        setLectures(lectureData.lectures || []);
        console.log("All lectures:", lectureData.lectures);
      } catch (error) {
        console.error("❌ Error loading student dashboard data:", error);
      }
    };

    fetchData();
  }, [studentId]);

  const getSubjectWiseAttendance = () => {
    const subjectMap = {};
    attendance.forEach(record => {
      const subjectName = record.subject_name || 'Unknown';
      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = { lecture: 0, lab: 0, dates: [] };
      }
      if (record.type === 'lecture') subjectMap[subjectName].lecture++;
      if (record.type === 'lab') subjectMap[subjectName].lab++;
      subjectMap[subjectName].dates.push({ date: record.date, type: record.type });
    });
    return subjectMap;
  };

  const subjectWiseData = getSubjectWiseAttendance();
  const activeSubjectData = selectedSubject ? subjectWiseData[selectedSubject] : null;

  const lineChartData = {
    labels: activeSubjectData?.dates.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: `${selectedSubject || ''} Attendance (Timeline)`,
        data: activeSubjectData?.dates.map((_, i) => i + 1),
        borderColor: '#22d3ee',
        backgroundColor: '#06b6d4',
        tension: 0.3,
        fill: false
      }
    ]
  };

  const barData = {
    labels: ['Lecture', 'Lab'],
    datasets: [
      {
        label: `Attendance Count - ${selectedSubject || ''}`,
        data: [
          activeSubjectData?.lecture || 0,
          activeSubjectData?.lab || 0
        ],
        backgroundColor: ['#3b82f6', '#10b981']
      }
    ]
  };

  const doughnutData = {
    labels: ['Lecture', 'Lab'],
    datasets: [
      {
        data: [
          activeSubjectData?.lecture || 0,
          activeSubjectData?.lab || 0
        ],
        backgroundColor: ['#60a5fa', '#34d399'],
        hoverOffset: 4
      }
    ]
  };

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <h2 style={heading}>🎓 Student Dashboard</h2>

        {classInfo && (
          <div style={infoCard}>
            <p><strong>Class:</strong> {classInfo.name}</p>
            <p><strong>Semester:</strong> {classInfo.semester_id}</p>
            <p><strong>Department:</strong> {classInfo.department_name}</p>
          </div>
        )}

        <div style={section}>
          <h3 style={subHeading}>📘 Subjects You're Learning</h3>
          <ul style={listStyle}>
            {subjects.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No subjects found.</p>
            ) : (
              subjects.map((subj, i) => (
                <li key={i}>
                  <button
                    style={subBtn(selectedSubject === subj.name)}
                    onClick={() => setSelectedSubject(subj.name)}
                  >
                    {subj.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div style={section}>
          <h3 style={subHeading}>📊 Subject-wise Attendance</h3>
          {selectedSubject && activeSubjectData ? (
            <div style={chartGrid}>
              <div style={chartBox}><Bar data={barData} /></div>
              <div style={chartBox}><Doughnut data={doughnutData} /></div>
              <div style={chartBox}><Line data={lineChartData} /></div>
            </div>
          ) : (
            <p style={{ color: '#94a3b8' }}>Select a subject to view charts.</p>
          )}
        </div>

        <div style={section}>
          <h3 style={subHeading}>🧾 Attendance for {selectedSubject || '...'}</h3>
          {selectedSubject ? (
            (() => {
              const filteredLectures = lectures.filter(
                lec => lec.subject_name === selectedSubject
              );

              const attendanceMap = {};
              attendance.forEach(record => {
                attendanceMap[record.lecture_id] = record.present;
              });

              return filteredLectures.length > 0 ? (
                <div style={tableContainer}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLectures.map((lec, i) => {
                        const date = new Date(lec.date);
                        const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                        const isPresent = attendanceMap[lec._id];
                        return (
                          <tr key={i}>
                            <td style={tdStyle}>{formatted}</td>
                            <td style={tdStyle}>{lec.type}</td>
                            <td style={tdStyle}>{isPresent ? '✅ Present' : '❌ Absent'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: '#94a3b8' }}>No lectures found for this subject.</p>
              );
            })()
          ) : (
            <p style={{ color: '#94a3b8' }}>Select a subject to view attendance table.</p>
          )}
        </div>
      </div>
    </>
  );
};

// Styles (same)
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

const subHeading = {
  fontSize: "1.3rem",
  marginBottom: "0.5rem"
};

const infoCard = {
  background: "#1f2937",
  padding: "1rem",
  borderRadius: "10px",
  marginBottom: "2rem",
  boxShadow: "0 0 10px rgba(0,0,0,0.2)"
};

const section = { marginBottom: "2rem" };

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

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1rem"
};

const chartBox = {
  background: "#1e293b",
  padding: "0.5rem",
  borderRadius: "10px",
  height: "250px"
};

const tableContainer = {
  overflowX: 'auto',
  backgroundColor: '#1f2937',
  padding: '1rem',
  borderRadius: '10px'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  color: '#fff'
};

const thStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #334155',
  textAlign: 'left',
  backgroundColor: '#0f172a'
};

const tdStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #334155'
};

export default StudentDashboard;
