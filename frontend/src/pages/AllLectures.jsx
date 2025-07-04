import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AllLectures = () => {
  const { id: subjectId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('');
  const [classId, setClassId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newLecture, setNewLecture] = useState({ date: '', type: 'Lec', topic: '' });
  const facultyId = JSON.parse(localStorage.getItem('id'));
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ date: '', type: '', topic: '', faculty: '' });

  useEffect(() => {
    // Fetch lectures
    fetch(`https://gperiatd.onrender.com/lectures/bySubject/${subjectId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLectures(data);
        }
      })
      .catch(err => {
        console.error('Error fetching lectures:', err);
        setLectures([]);
      });

    // Fetch subject details
    fetch(`https://gperiatd.onrender.com/subjects/details/${subjectId}`)
      .then(res => res.json())
      .then(data => {
        setSubjectName(data.subject_name || '');
        setClassName(data.class_name || '');
        setClassId(data.id || '');
        
      })
      .catch(err => console.error('Error fetching subject details:', err));
  }, [subjectId]);

  const filteredLectures = lectures.filter(lec =>
    (!filter.date || new Date(lec.date).toLocaleDateString().includes(filter.date)) &&
    (!filter.type || (lec.duration === 1 ? 'Lec' : 'Lab') === filter.type) &&
    (!filter.topic || lec.topic?.toLowerCase().includes(filter.topic.toLowerCase())) &&
    (!filter.faculty || lec.faculty_name?.toLowerCase().includes(filter.faculty.toLowerCase()))
  );

  const handleCreateLecture = () => {
  // Ensure date is sent in 'YYYY-MM-DD' format without time manipulation
  const formattedDate = new Date(newLecture.date).toISOString().split('T')[0];

  const payload = {
    subject_id: subjectId,
    faculty_id: facultyId,
    topic: newLecture.topic,
    date: formattedDate,
    duration: newLecture.type === 'Lec' ? 1 : 2
  };

  fetch('https://gperiatd.onrender.com/lectures/createLecture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(() => {
      alert('Lecture created!');
      setShowModal(false);
      setNewLecture({ date: '', type: 'Lec', topic: '' });
      fetch(`https://gperiatd.onrender.com/lectures/bySubject/${subjectId}`)
        .then(res => res.json())
        .then(setLectures);
    })
    .catch(() => alert('Failed to create lecture'));
};


  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
        <h1>📚 All Lectures for: <span style={{ color: "#2c3e50" }}>{subjectName}</span></h1>

        <div style={filterWrapperStyle}>
          <input type="text" placeholder="Filter by Date" value={filter.date}
            onChange={e => setFilter({ ...filter, date: e.target.value })} style={filterInputStyle} />
          <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })} style={filterInputStyle}>
            <option value="">All Types</option>
            <option value="Lec">Lec</option>
            <option value="Lab">Lab</option>
          </select>
          <input type="text" placeholder="Filter by Topic" value={filter.topic}
            onChange={e => setFilter({ ...filter, topic: e.target.value })} style={filterInputStyle} />
          <input type="text" placeholder="Filter by Faculty" value={filter.faculty}
            onChange={e => setFilter({ ...filter, faculty: e.target.value })} style={filterInputStyle} />
        </div>

        <button style={createBtnStyle} onClick={() => setShowModal(true)}>+ Create Lecture</button>
        <button
          onClick={() => navigate(`/faculty/my-subjects/report/${subjectId}/${facultyId}`, {
  state: { subjectName, className, classId }
})}
          style={{ ...btnStyle, backgroundColor: '#17a2b8', marginLeft: '10px' }}
        >
          Export Report
        </button>

        {filteredLectures.length === 0 ? (
          <p>No lectures found.</p>
        ) : (
          <div style={scrollContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Topic</th>
                  <th style={thStyle}>Faculty</th>
                  <th style={thStyle}>Mark Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredLectures.map(lec => (
                  <tr key={lec.id}>
                    <td style={tdStyle}>{lec.id}</td>
                    <td style={tdStyle}>{new Date(lec.date).toLocaleDateString()}</td>
                    <td style={tdStyle}>{lec.duration === 1 ? "Lec" : "Lab"}</td>
                    <td style={tdStyle}>{lec.topic || '-'}</td>
                    <td style={tdStyle}>{lec.faculty_name}</td>
                    <td style={tdStyle}>
                      {lec.faculty_id === facultyId ? (
                        <button
                          onClick={() => navigate(`/faculty/my-subjects/${subjectId}/${lec.id}`)}
                          style={btnStyle}
                        >
                          Mark
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{ ...btnStyle, backgroundColor: 'gray', cursor: 'not-allowed' }}
                        >
                          Not Allowed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button style={backBtnStyle} onClick={() => navigate(`/faculty/my-subjects`)}>Back</button>

        {showModal && (
          <div style={modalOverlay}>
            <div style={modalStyle}>
              <button onClick={() => setShowModal(false)} style={closeBtn}>×</button>
              <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Create New Lecture</h3>
              <label>Topic:</label>
              <input type="text" value={newLecture.topic}
                onChange={e => setNewLecture({ ...newLecture, topic: e.target.value })} style={MfilterInputStyle} />
              <label>Date:</label>
              <input type="date" value={newLecture.date}
                onChange={e => setNewLecture({ ...newLecture, date: e.target.value })} style={MfilterInputStyle} />
              <label>Type:</label>
              <select value={newLecture.type}
                onChange={e => setNewLecture({ ...newLecture, type: e.target.value })} style={MfilterInputStyle}>
                <option value="Lec">Lec</option>
                <option value="Lab">Lab</option>
              </select>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button style={btnStyle} onClick={handleCreateLecture}>Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllLectures;

// ---------------- Styles ----------------

const scrollContainerStyle = {
  maxHeight: '400px',
  overflowY: 'auto',
  borderRadius: '10px',
  boxShadow: '0 0 12px rgba(0, 0, 0, 0.08)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle = {
  padding: '12px 16px',
  backgroundColor: '#f1f3f5',
  textAlign: 'center',
  fontWeight: '600',
};

const tdStyle = {
  padding: '12px 16px',
  textAlign: 'center',
  backgroundColor: '#fff',
  borderBottom: '1px solid #ddd',
};

const btnStyle = {
  padding: '6px 12px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const createBtnStyle = {
  ...btnStyle,
  backgroundColor: '#28a745',
  marginBottom: '20px',
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

const filterWrapperStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  margin: '20px 0'
};

const filterInputStyle = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  minWidth: '130px',
  fontSize: '14px',
  width: '80%'
};

const MfilterInputStyle = {
  padding: '8px 12px',
  margin: "6px",
  border: '1px solid #ccc',
  borderRadius: '6px',
  minWidth: '130px',
  fontSize: '14px',
  width: '95%'
};

const modalOverlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '30px 20px',
  borderRadius: '10px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  position: 'relative'
};

const closeBtn = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#999'
};
