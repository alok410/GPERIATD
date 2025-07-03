import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Attendance = () => {
  const { subjectId, lectureId } = useParams();
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch subject details
    fetch(`http://localhost:5000/subjects/details/${subjectId}`)
      .then(res => res.json())
      .then(data => {
        setClassName(data.class_name || '');
        setSubjectName(data.subject_name || '');
      })
      .catch(err => console.error('Error fetching subject details:', err));

    // Fetch students by subject
    fetch(`http://localhost:5000/students/bySubject/${subjectId}`)
      .then(res => res.json())
      .then(data => {
        if (data.students) {
          setStudents(data.students);
          setClassId(data.class_id);

          // Fetch existing attendance
          fetch(`http://localhost:5000/attendance/byLecture/${lectureId}`)
            .then(res => res.json())
            .then(saved => {
              const mapped = {};
              let anyMarked = false;

              data.students.forEach(stu => {
                if (saved.hasOwnProperty(stu.id)) {
                  mapped[stu.id] = saved[stu.id];
                  anyMarked = true;
                } else {
                  mapped[stu.id] = 'Absent'; // Default to Absent
                }
              });

              setIsAttendanceMarked(anyMarked);
              setAttendanceData(mapped);
            });
        }
      })
      .catch(err => console.error('Error fetching students or attendance:', err));
  }, [subjectId, lectureId]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    const attendanceArray = students.map(stu => ({
      student_id: stu.id,
      lecture_id: lectureId,
      status: attendanceData[stu.id]
    }));

    fetch('http://localhost:5000/attendance/markOrUpdate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendance: attendanceArray })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Attendance saved!');
        setEditMode(false);
        setIsAttendanceMarked(true);
      })
      .catch(err => alert('Error saving attendance'));
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>
          📋 Attendance for: <span style={{ color: '#2c3e50' }}>{subjectName}</span> - <span style={{ color: '#16a085' }}>{className}</span>
        </h2>

        <div style={{ marginBottom: '10px' }}>
          {isAttendanceMarked ? (
            <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Attendance already marked. You can update it.</p>
          ) : (
            <p style={{ color: 'red', fontWeight: 'bold' }}>❗ Attendance not marked yet. Please mark now.</p>
          )}
        </div>

        <button onClick={() => setEditMode(!editMode)} style={btnStyle}>
          {editMode ? 'Cancel Edit' : 'Edit Attendance'}
        </button>

        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <table border="1" cellPadding="10" style={tableStyle}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>
                    {editMode ? (
                      <div>
                        <label style={{ marginRight: '10px' }}>
                          <input
                            type="radio"
                            name={`status-${student.id}`}
                            value="Present"
                            checked={attendanceData[student.id] === 'Present'}
                            onChange={() => handleStatusChange(student.id, 'Present')}
                          />
                          Present
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`status-${student.id}`}
                            value="Absent"
                            checked={attendanceData[student.id] !== 'Present'} // Default to Absent
                            onChange={() => handleStatusChange(student.id, 'Absent')}
                          />
                          Absent
                        </label>
                      </div>
                    ) : (
                      <span style={{ color: attendanceData[student.id] === 'Present' ? 'green' : 'red' }}>
                        {attendanceData[student.id] || 'Absent'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editMode && (
          <button onClick={handleSubmit} style={submitBtnStyle}>
            Submit Attendance
          </button>
        )}
      </div>

      <button style={backBtnStyle} onClick={() => navigate(`/faculty/my-subjects/${subjectId}`)}>Back</button>
    </>
  );
};

export default Attendance;

// Styles
const btnStyle = {
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  marginBottom: '10px',
  cursor: 'pointer'
};

const backBtnStyle = {
  width: "100px",
  height: "36px",
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "20px",
  margin: "30px auto",
  display: 'block',
  cursor: "pointer"
};

const submitBtnStyle = {
  ...btnStyle,
  backgroundColor: 'green',
  marginTop: '20px'
};

const tableStyle = {
  marginTop: '20px',
  width: '100%',
  borderCollapse: 'collapse',
};
