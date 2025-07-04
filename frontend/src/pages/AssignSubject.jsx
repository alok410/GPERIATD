import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const AssignSubject = () => {
  const getParsed = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      if (!value || value === 'undefined' || value === 'null') return fallback;
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const departmentId = getParsed('department', null);
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [filter, setFilter] = useState({ subject: '', className: '', faculty: '', batch: '' });
  const [editingId, setEditingId] = useState(null);
  const [editedFaculties, setEditedFaculties] = useState({});

  useEffect(() => {
    if (!departmentId) return;

    fetch(`https://gperiatd.onrender.com/subjects/byDeptFull/${departmentId}`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setSubjects(data) : setSubjects([]))
      .catch(err => console.error('Error fetching subjects:', err));

    fetch(`https://gperiatd.onrender.com/faculty/getByDepartment/${departmentId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFacultyList(data);
        else if (Array.isArray(data.faculty)) setFacultyList(data.faculty);
        else setFacultyList([]);
      })
      .catch(err => {
        console.error('Error fetching faculty:', err);
        setFacultyList([]);
      });

    fetch(`https://gperiatd.onrender.com/classes/byDept/${departmentId}`)
      .then(res => res.json())
      .then(setClassList)
      .catch(err => console.error('Error fetching classes:', err));
  }, [departmentId]);

  const batchList = [...new Set(classList.map(cls => cls.batch).filter(Boolean))];

  const filteredSubjects = subjects.filter(sub => {
    const subjectMatch = filter.subject ? sub.name === filter.subject : true;
    const classMatch = filter.className ? sub.class_name === filter.className : true;
    const facultyMatch = filter.faculty
      ? [sub.fac_1?.id, sub.fac_2?.id, sub.fac_3?.id, sub.fac_4?.id].includes(parseInt(filter.faculty))
      : true;
    const batchMatch = filter.batch ? sub.batch === filter.batch : true;

    return subjectMatch && classMatch && facultyMatch && batchMatch;
  });

  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setEditedFaculties({
      fac_1: sub.fac_1?.id || '',
      fac_2: sub.fac_2?.id || '',
      fac_3: sub.fac_3?.id || '',
      fac_4: sub.fac_4?.id || '',
    });
  };

  const handleSave = (subjectId) => {
    fetch(`https://gperiatd.onrender.com/subjects/assignFaculty/${subjectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedFaculties),
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Updated successfully!');
        setEditingId(null);
        return fetch(`https://gperiatd.onrender.com/subjects/byDeptFull/${departmentId}`);
      })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setSubjects(data) : setSubjects([]))
      .catch(err => console.error("Failed to update subject:", err));
  };

  const handleFacultyChange = (key, value) => {
    setEditedFaculties(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={headingStyle}>🎓 Assign Faculty to Subjects</h2>

        <div style={filterWrapperStyle}>
          <select value={filter.subject} onChange={e => setFilter({ ...filter, subject: e.target.value })} style={selectStyle}>
            <option value="">Filter by Subject</option>
            {subjects.map((sub, i) => (
              <option key={i} value={sub.name}>{sub.name}</option>
            ))}
          </select>

          <select value={filter.className} onChange={e => setFilter({ ...filter, className: e.target.value })} style={selectStyle}>
            <option value="">Filter by Class</option>
            {classList.map((cls, i) => (
              <option key={i} value={cls.name}>{cls.name}</option>
            ))}
          </select>

          <select value={filter.batch} onChange={e => setFilter({ ...filter, batch: e.target.value })} style={selectStyle}>
            <option value="">Filter by Batch</option>
            {batchList.map((batch, i) => (
              <option key={i} value={batch}>{batch}</option>
            ))}
          </select>

          <select value={filter.faculty} onChange={e => setFilter({ ...filter, faculty: e.target.value })} style={selectStyle}>
            <option value="">Filter by Faculty</option>
            {facultyList.map((fac, i) => (
              <option key={i} value={fac.id}>{fac.name || fac.faculty_name}</option>
            ))}
          </select>
        </div>

        <div style={scrollableTableWrapper}>
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                <th>Subject</th>
                <th>Class</th>
                <th>Batch</th>
                <th>Faculty 1</th>
                <th>Faculty 2</th>
                <th>Faculty 3</th>
                <th>Faculty 4</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map(sub => (
                <tr key={sub.id} style={rowStyle}>
                  <td>{sub.name}</td>
                  <td>{sub.class_name}</td>
                  <td>{sub.batch || '-'}</td>
                  {[1, 2, 3, 4].map(num => (
                    <td key={num}>
                      {editingId === sub.id ? (
                        <select
                          value={editedFaculties[`fac_${num}`] || ''}
                          onChange={e => handleFacultyChange(`fac_${num}`, e.target.value)}
                          style={selectStyle}
                        >
                          <option value="">-- None --</option>
                          {facultyList.map(fac => (
                            <option key={fac.id} value={fac.id}>
                              {fac.name || fac.faculty_name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        sub[`fac_${num}`]?.name || '-'
                      )}
                    </td>
                  ))}
                  <td>
                    {editingId === sub.id ? (
                      <button style={saveBtnStyle} onClick={() => handleSave(sub.id)}>💾 Save</button>
                    ) : (
                      <button style={editBtnStyle} onClick={() => handleEdit(sub)}>✏️ Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssignSubject;

// --- Styles ---
const containerStyle = {
  padding: '2rem 1rem',
  maxWidth: '100%',
  fontFamily: 'Segoe UI, sans-serif',
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
  color: '#2c3e50',
  fontSize: '28px',
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

const scrollableTableWrapper = {
  overflowX: 'auto',
  borderRadius: '10px',
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.08)',
  backgroundColor: '#fff',
};

const tableStyle = {
  width: '100%',
  minWidth: '1200px',
  borderCollapse: 'collapse',
};

const theadStyle = {
  backgroundColor: '#f8f9fa',
  textAlign: 'left',
};

const rowStyle = {
  borderBottom: '1px solid #ddd',
  transition: 'background 0.3s',
};

const saveBtnStyle = {
  backgroundColor: '#27ae60',
  color: '#fff',
  padding: '8px 14px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const editBtnStyle = {
  backgroundColor: '#2980b9',
  color: '#fff',
  padding: '8px 14px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
