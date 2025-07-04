import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const AllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [form, setForm] = useState({
    name: '',
    department_id: '',
    semester_id: '',
    program_id: '',
    batch: '',
  });

  const [filters, setFilters] = useState({
    name: '',
    department_id: '',
    semester_id: '',
    program_id: '',
    batch: ''
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchDropdownData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, classes]);

  const fetchData = () => {
    fetch('https://gperiatd.onrender.com/classes/getAllClasses')
      .then(res => res.json())
      .then(data => {
        setClasses(data.classes || []);
        setFilteredClasses(data.classes || []);
      });
  };

  const fetchDropdownData = () => {
    fetch('https://gperiatd.onrender.com/departments/getAllDepartments')
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []));

    fetch('https://gperiatd.onrender.com/sems/getAllSem')
      .then(res => res.json())
      .then(data => setSemesters(data.sems || []));

    fetch('https://gperiatd.onrender.com/programs/getAllPrograms')
      .then(res => res.json())
      .then(data => setPrograms(data.programs || []));
  };

  const applyFilters = () => {
    let result = [...classes];

    if (filters.name)
      result = result.filter(cls => cls.name?.toLowerCase().includes(filters.name.toLowerCase()));

    if (filters.department_id)
      result = result.filter(cls => cls.department_name === filters.department_id);

    if (filters.semester_id)
      result = result.filter(cls => cls.semester_name === filters.semester_id);

    if (filters.program_id)
      result = result.filter(cls => cls.program_name === filters.program_id);

    if (filters.batch)
      result = result.filter(cls => cls.batch?.toLowerCase().includes(filters.batch.toLowerCase()));

    setFilteredClasses(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editId
      ? `https://gperiatd.onrender.com/classes/updateClass/${editId}`
      : 'https://gperiatd.onrender.com/classes/createClass';
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => {
        fetchData();
        resetForm();
        alert(editId ? 'Class updated!' : 'Class added!');
      });
  };

  const handleEdit = (cls) => {
    setForm({
      name: cls.name,
      department_id: cls.department_id,
      semester_id: cls.semester_id,
      program_id: cls.program_id,
      batch: cls.batch,
    });
    setEditId(cls.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this class?')) {
      fetch(`https://gperiatd.onrender.com/classes/deleteClass/${id}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(() => {
          fetchData();
          alert('Class deleted!');
        });
    }
  };

  const resetForm = () => {
    setForm({ name: '', department_id: '', semester_id: '', program_id: '', batch: '' });
    setEditId(null);
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', gap: '50px', padding: '20px' }}>
        {/* Left Section: Table */}
        <div style={{ flex: 1 }}>
          <h2>🏫 All Classes</h2>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Search Class Name"
              value={filters.name}
              onChange={e => setFilters({ ...filters, name: e.target.value })}
              style={filterInputStyle}
            />
            <select
              value={filters.department_id}
              onChange={e => setFilters({ ...filters, department_id: e.target.value })}
              style={filterInputStyle}
            >
              <option value="">Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <select
              value={filters.semester_id}
              onChange={e => setFilters({ ...filters, semester_id: e.target.value })}
              style={filterInputStyle}
            >
              <option value="">Semester</option>
              {semesters.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <select
              value={filters.program_id}
              onChange={e => setFilters({ ...filters, program_id: e.target.value })}
              style={filterInputStyle}
            >
              <option value="">Program</option>
              {programs.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Batch"
              value={filters.batch}
              onChange={e => setFilters({ ...filters, batch: e.target.value })}
              style={filterInputStyle}
            />
          </div>

          <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Program</th>
                <th>Batch</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map(cls => (
                <tr key={cls.id}>
                  <td>{cls.id}</td>
                  <td>{cls.name}</td>
                  <td>{cls.department_name}</td>
                  <td>{cls.semester_name}</td>
                  <td>{cls.program_name}</td>
                  <td>{cls.batch}</td>
                  <td>
                    <button onClick={() => handleEdit(cls)}>Edit</button>
                    <button onClick={() => handleDelete(cls.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Section: Form */}
        <div style={{ width: '350px' }}>
          <h2>{editId ? '✏️ Edit Class' : '➕ Add Class'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Class Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              style={inputStyle}
            />
            <select
              value={form.department_id}
              onChange={e => setForm({ ...form, department_id: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select
              value={form.semester_id}
              onChange={e => setForm({ ...form, semester_id: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">Select Semester</option>
              {semesters.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              value={form.program_id}
              onChange={e => setForm({ ...form, program_id: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">Select Program</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Batch"
              value={form.batch}
              onChange={e => setForm({ ...form, batch: e.target.value })}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              {editId ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '15px',
  borderRadius: '5px',
  border: '1px solid #aaa'
};

const filterInputStyle = {
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  minWidth: '140px'
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

export default AllClasses;
