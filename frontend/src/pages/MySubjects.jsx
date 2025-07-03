import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; 

const MySubjects = () => {
  const facultyId = JSON.parse(localStorage.getItem('id'));
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [lectureCounts, setLectureCounts] = useState([]);
  const navigate = useNavigate(); 
  const [filter, setFilter] = useState({
    subject: '',
    className: '',
    batch: ''
  });


    const handleOpenClick = (subject) => {
    // Navigate to lecture page and pass subject via state or query
    navigate(`/faculty/my-subjects/${subject.id}`, { state: subject });
  };

  useEffect(() => {
    if (!facultyId) return;

    // Fetch subjects assigned to this faculty
    fetch(`http://localhost:5000/subjects/byFaculty/${facultyId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSubjects(data);
          setFilteredSubjects(data);
        } else {
          setSubjects([]);
          setFilteredSubjects([]);
        }
      })
      .catch(err => {
        console.error('Error fetching subjects:', err);
        setSubjects([]);
        setFilteredSubjects([]);
      });

    // Fetch lecture & lab counts for this faculty
    fetch(`http://localhost:5000/lectures/lectureCounts/${facultyId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLectureCounts(data);
        } else {
          setLectureCounts([]);
        }
      })
      .catch(err => {
        console.error('Error fetching lecture counts:', err);
        setLectureCounts([]);
      });

  }, [facultyId]);

  // Filter logic
  useEffect(() => {
    const filtered = subjects.filter(sub => {
      const subjectMatch = filter.subject ? sub.name === filter.subject : true;
      const classMatch = filter.class_name ? sub.class_name === filter.class_name : true;
      const batchMatch = filter.batch ? sub.batch === filter.batch : true;
      return subjectMatch && classMatch && batchMatch;
    });
    setFilteredSubjects(filtered);
  }, [filter, subjects]);

  // Dropdown options
  const subjectOptions = [...new Set(subjects.map(s => s.name))];
  const classOptions = [...new Set(subjects.map(s => s.class_name))];
  const batchOptions = [...new Set(subjects.map(s => s.batch))];

  // Get lecture/lab count for subject
  const getCounts = (subjectId) => {
    const found = lectureCounts.find(item => item.subject_id === subjectId);
    return {
      lec: found?.lecture_count || 0,
      lab: found?.lab_count || 0
    };
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={headingStyle}>📘 My Subjects</h2>

        {/* Filters */}
        <div style={filterWrapperStyle}>
          <select
            value={filter.subject}
            onChange={e => setFilter({ ...filter, subject: e.target.value })}
            style={selectStyle}
          >
            <option value="">Filter by Subject</option>
            {subjectOptions.map((sub, idx) => (
              <option key={idx} value={sub}>{sub}</option>
            ))}
          </select>

          <select
            value={filter.class_name}
            onChange={e => setFilter({ ...filter, class_name: e.target.value })}
            style={selectStyle}
          >
            <option value="">Filter by Class</option>
            {classOptions.map((cls, idx) => (
              <option key={idx} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            value={filter.batch}
            onChange={e => setFilter({ ...filter, batch: e.target.value })}
            style={selectStyle}
          >
            <option value="">Filter by Batch</option>
            {batchOptions.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {filteredSubjects.length === 0 ? (
          <p>No subjects found.</p>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ border: "2px solid grey" }}>
                  <th>Subject ID</th>
                  <th>Subject Name</th>
                  <th>Class</th>
                  <th>Batch</th>
                  <th>No. of Lectures</th>
                  <th>No. of Labs</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((sub, idx) => (
                  <tr key={idx}>
                    <td style={cellStyle}>{sub.id}</td>
                    <td style={cellStyle}>{sub.name}</td>
                    <td style={cellStyle}>{sub.class_name}</td>
                    <td style={cellStyle}>{sub.batch || '-'}</td>
                    <td style={cellStyle}>{getCounts(sub.id).lec}</td>
                    <td style={cellStyle}>{getCounts(sub.id).lab}</td>
                    <td style={cellStyle}>
                      <button style={openBtnStyle} onClick={() => handleOpenClick(sub)}>Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MySubjects;

// --- Styles ---
const containerStyle = {
  padding: '2rem 1rem',
  maxWidth: '100%',
  fontFamily: 'Segoe UI, sans-serif',
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#2c3e50',
  fontSize: '26px',
};

const filterWrapperStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center',
  marginBottom: '1.5rem',
};

const selectStyle = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  minWidth: '200px',
  outline: 'none',
};

const tableWrapperStyle = {
  overflowX: 'auto',
  borderRadius: '10px',
  boxShadow: '0 0 12px rgba(0, 0, 0, 0.08)',
  backgroundColor: '#fff',
};

const tableStyle = {
  width: '100%',
  minWidth: '800px',
  borderCollapse: 'collapse',
};

const cellStyle = {
  border: '2px solid grey',
  textAlign: 'center',
  padding: '8px',
};

const openBtnStyle = {
  backgroundColor: '#8e44ad',
  color: '#fff',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
