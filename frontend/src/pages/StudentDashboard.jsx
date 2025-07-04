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
  PointElement,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  TimeScale
);

const StudentDashboard = () => {
  const studentId = JSON.parse(localStorage.getItem("id"));
  const [classInfo, setClassInfo] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chartType, setChartType] = useState('bar');
      
  const [monthFilter, setMonthFilter] = useState('');

  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      try {
        const res1 = await fetch(`https://gperiatd.onrender.com/students/getById/${studentId}`);
        const studentData = await res1.json();
        console.log("Student Data:", studentData);
        setClassInfo(studentData.classDetails);

        const res2 = await fetch(`https://gperiatd.onrender.com/subjects/byClass/${studentData.class_id}`);
        const subjectData = await res2.json();
        console.log("Subjects:", subjectData);
        setSubjects(subjectData || []);

        const res3 = await fetch(`https://gperiatd.onrender.com/attendance/student/${studentId}`);
        const attendanceData = await res3.json();
        console.log("Attendance Records:", attendanceData.records);
        setAttendance(attendanceData.records || []);
      } catch (error) {
        console.error("Error loading student dashboard data:", error);
      }
    };

    fetchData();
  }, [studentId]);

  const getFilteredAttendance = () => {
    const result = attendance.filter(a => {
      if (!monthFilter) return true;
      return a.date.startsWith(monthFilter);
    });
    console.log("Filtered Attendance:", result);
    return result;
  };

  const filteredAttendance = getFilteredAttendance();

  const getLectureAttendanceCount = () => {
    const lectures = filteredAttendance.filter(a => a.type === 'lecture');
    const labs = filteredAttendance.filter(a => a.type === 'lab');
    return {
      lecture: lectures.length,
      lab: labs.length
    };
  };

  const getSubjectWiseAttendance = () => {
    const subjectMap = {};
    filteredAttendance.forEach(record => {
      const subjectName = record.subject_name || 'Unknown';
      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = { lecture: 0, lab: 0, presentDates: [], absentDates: [] };
      }
      if (record.type === 'lecture') subjectMap[subjectName].lecture++;
      if (record.type === 'lab') subjectMap[subjectName].lab++;
      const status = record.present ? '✅ Present' : '❌ Absent';
      const entry = `${record.date} - ${record.type.toUpperCase()} - ${status}`;
      if (record.present) subjectMap[subjectName].presentDates.push(entry);
      else subjectMap[subjectName].absentDates.push(entry);
    });
    console.log("Subject-wise Data:", subjectMap);
    return subjectMap;
  };

  const getDateWiseTypeAttendance = (subject = null) => {
    const dateMap = {};
    filteredAttendance.forEach(record => {
      if (subject && record.subject_name !== subject) return;
      const date = record.date;
      const type = record.type;
      if (!dateMap[date]) dateMap[date] = { lecture: 0, lab: 0 };
      if (type === 'lecture') dateMap[date].lecture += 1;
      else if (type === 'lab') dateMap[date].lab += 1;
    });
    const trend = Object.entries(dateMap).map(([date, counts]) => ({ date, ...counts }));
    console.log("Trend Data:", trend);
    return trend;
  };

  const { lecture, lab } = getLectureAttendanceCount();
  const subjectWiseData = getSubjectWiseAttendance();
  const activeSubjectData = selectedSubject ? subjectWiseData[selectedSubject] : null;
  const trendData = getDateWiseTypeAttendance(selectedSubject);

  const lineChartData = {
    labels: trendData.map(d => d.date),
    datasets: [
      {
        label: 'Lectures',
        data: trendData.map(d => d.lecture),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f655',
        tension: 0.3
      },
      {
        label: 'Labs',
        data: trendData.map(d => d.lab),
        borderColor: '#10b981',
        backgroundColor: '#10b98155',
        tension: 0.3
      }
    ]
  };

  const barData = {
    labels: ['Lecture', 'Lab'],
    datasets: [
      {
        label: 'Attendance Count',
        data: [lecture, lab],
        backgroundColor: ['#3b82f6', '#10b981']
      }
    ]
  };

  const doughnutData = {
    labels: ['Lecture', 'Lab'],
    datasets: [
      {
        data: [lecture, lab],
        backgroundColor: ['#60a5fa', '#34d399'],
        hoverOffset: 4
      }
    ]
  };

  const chartMap = {
    bar: <Bar data={barData} options={{ maintainAspectRatio: false }} height={200} />,
    line: <Line data={lineChartData} options={{ maintainAspectRatio: false }} height={200} />,
    doughnut: <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} height={200} />
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
          <h3 style={subHeading}>📆 Filter By Month</h3>
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

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
          <h3 style={subHeading}>📊 Chart View Toggle</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['bar', 'line', 'doughnut'].map(type => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                style={subBtn(chartType === type)}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={section}>
          <h3 style={subHeading}>📈 Attendance Overview ({chartType.toUpperCase()} Chart)</h3>
          <div style={chartBox}>{chartMap[chartType]}</div>
        </div>

        <div style={section}>
          <h3 style={subHeading}>📊 Subject-wise Line Chart</h3>
          {selectedSubject && activeSubjectData ? (
            <div style={chartBox}>
              <Line data={lineChartData} options={{ maintainAspectRatio: false }} height={200} />
            </div>
          ) : (
            <p style={{ color: '#94a3b8' }}>Select a subject to view detailed chart.</p>
          )}
        </div>

        {selectedSubject && activeSubjectData && (
          <div style={section}>
            <h3 style={subHeading}>📜 {selectedSubject} Attendance Details</h3>
            <div style={infoCard}>
              <h4>✅ Present</h4>
              <ul>
                {activeSubjectData.presentDates.map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
              <hr style={{ margin: '1rem 0', borderColor: '#ccc' }} />
              <h4>❌ Absent</h4>
              <ul>
                {activeSubjectData.absentDates.map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

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

const section = {
  marginBottom: "2rem"
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

const chartBox = {
  flex: 1,
  minWidth: "300px",
  height: "200px",
  background: "#1e293b",
  padding: "1rem",
  borderRadius: "10px"
};

export default StudentDashboard;
