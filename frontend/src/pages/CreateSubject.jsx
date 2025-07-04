import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const CreateSubjects = () => {
  const [subjectName, setSubjectName] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');

  useEffect(() => {
    const deptId = JSON.parse(localStorage.getItem('department'));
    setDepartmentId(deptId);

    if (deptId) {
      // ✅ Fetch classes by department ID
      fetch(`https://gperiatd.onrender.com/classes/byDept/${deptId}`)
        .then(res => res.json())
        .then(data => {
          setClasses(data || []);
        });

      // ✅ Get department name
      fetch('https://gperiatd.onrender.com/departments/getAllDepartments')
        .then(res => res.json())
        .then(data => {
          const dept = data.departments?.find(d => d.id === deptId);
          if (dept) setDepartmentName(dept.name);
        });
    }
  }, []);

  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!subjectName || !selectedClassId) {
      return alert('Subject name and class are required.');
    }

    fetch('https://gperiatd.onrender.com/subjects/createSubject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: subjectName, class_id: selectedClassId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert('Subject created successfully!');
          setSubjectName('');
          setSelectedClassId('');
        } else {
          alert('Error creating subject.');
        }
      });
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2>Create Subject</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            style={inputStyle}
            required
          />

          <select
            value={selectedClassId}
            onChange={handleClassChange}
            style={inputStyle}
            required
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - {cls.batch}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={departmentName}
            disabled
            style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
          />

          <button type="submit" style={buttonStyle}>Create</button>
        </form>
      </div>
    </>
  );
};

export default CreateSubjects;

// [containerStyle, formStyle, inputStyle, buttonStyle same as before]


const containerStyle = {
  maxWidth: '500px',
  margin: '0 auto',
  padding: '30px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px'
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#28a745',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
