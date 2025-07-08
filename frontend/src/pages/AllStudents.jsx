import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DeleteIcon from "../images/Dltimage.png";
import EditIcon from "../images/Editimage.png";
import './AllStudents.css'; // import this CSS file

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [stuName, setStuName] = useState('');
  const [stuEmail, setStuEmail] = useState('');
  const [stuPassword, setStuPassword] = useState('');
  const [stuBatch, setStuBatch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [classId, setClassId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [searchName, setSearchName] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterSem, setFilterSem] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("https://gperiatd.onrender.com/students/getAllStudents")
      .then(res => res.json())
      .then(data => {
        setStudents(data.students || []);
        setFilteredStudents(data.students || []);
      });

    fetch("https://gperiatd.onrender.com/departments/getAllDepartments")
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []));

    fetch("https://gperiatd.onrender.com/classes/getAllClasses")
      .then(res => res.json())
      .then(data => setClasses(data.classes || []));
  };

  const getSemesterByClassId = (classId) => {
    const found = classes.find(cls => cls.id == classId);
    return found ? found.semester_id : '';
  };

  const handleFilterChange = () => {
    let filtered = [...students];

    if (searchName) {
      filtered = filtered.filter(stu =>
        stu.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (filterDept) {
      filtered = filtered.filter(stu => stu.department_id == filterDept);
    }
    if (filterClass) {
      filtered = filtered.filter(stu => stu.class_id == filterClass);
    }
    if (filterBatch) {
      filtered = filtered.filter(stu => stu.batch == filterBatch);
    }
    if (filterSem) {
      filtered = filtered.filter(stu => getSemesterByClassId(stu.class_id) == filterSem);
    }

    setFilteredStudents(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchName, filterDept, filterClass, filterBatch, filterSem, students]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: stuName,
      email: stuEmail,
      password: stuPassword,
      batch: stuBatch,
      department_id: departmentId,
      class_id: classId
    };

    const url = editMode
      ? `https://gperiatd.onrender.com/students/update/${editId}`
      : "https://gperiatd.onrender.com/students/create";
    const method = editMode ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        alert(editMode ? "Student updated!" : "Student added!");
        resetForm();
        fetchData();
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      fetch(`https://gperiatd.onrender.com/students/delete/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => {
          alert("Deleted successfully!");
          fetchData();
        });
    }
  };

  const handleEditClick = (student) => {
    if (!window.confirm(`Edit ${student.name}?`)) return;

    setEditMode(true);
    setEditId(student.id);
    setStuName(student.name);
    setStuEmail(student.email);
    setStuBatch(student.batch);
    setDepartmentId(student.department_id);
    setClassId(student.class_id);
    setStuPassword('');

    const filtered = classes.filter(cls => cls.department_id == student.department_id);
    setFilteredClasses(filtered);
  };

  const resetForm = () => {
    setStuName('');
    setStuEmail('');
    setStuPassword('');
    setStuBatch('');
    setDepartmentId('');
    setClassId('');
    setEditMode(false);
    setEditId(null);
  };

  return (
    <>
      <Navbar />
      <div className="page-style">
        <div className="left-section">
          <h2 className="heading-style">📚 All Students</h2>

          <div className="filter-container">
            <input className="input-style" type="text" placeholder="Search by name" value={searchName} onChange={e => setSearchName(e.target.value)} />
            <select className="input-style" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="">Filter by Dept</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select className="input-style" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
              <option value="">Filter by Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input className="input-style" type="number" placeholder="Filter by Batch" value={filterBatch} onChange={e => setFilterBatch(e.target.value)} />
            <select className="input-style" value={filterSem} onChange={e => setFilterSem(e.target.value)}>
              <option value="">Filter by Semester</option>
              {[...new Set(classes.map(c => c.semester_id))].sort((a, b) => a - b).map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="table-wrapper">
            {filteredStudents.length === 0 ? (
              <p style={{ color: '#ccc' }}>No students found.</p>
            ) : (
              <table className="table-style">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Class</th>
                    <th>Semester</th>
                    <th>Batch</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((stu) => (
                    <tr key={stu.id}>
                      <td>{stu.id}</td>
                      <td>{stu.name}</td>
                      <td>{stu.email}</td>
                      <td>{stu.department_name}</td>
                      <td>{stu.class_name}</td>
                      <td>{getSemesterByClassId(stu.class_id)}</td>
                      <td>{stu.batch}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <img className="icon-style" src={EditIcon} alt="Edit" onClick={() => handleEditClick(stu)} />
                          <img className="icon-style" src={DeleteIcon} alt="Delete" onClick={() => handleDelete(stu.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="form-card">
          <h2>{editMode ? "✏️ Edit Student" : "➕ Add Student"}</h2>
          <form onSubmit={handleSubmit}>
            <input className="form-input" type="text" placeholder="Name" value={stuName} onChange={(e) => setStuName(e.target.value)} required />
            <input className="form-input" type="number" placeholder="Batch" value={stuBatch} onChange={(e) => setStuBatch(e.target.value)} required />
            <input className="form-input" type="email" placeholder="Email" value={stuEmail} onChange={(e) => setStuEmail(e.target.value)} required />
            {!editMode && (
              <input className="form-input" type="password" placeholder="Password" value={stuPassword} onChange={(e) => setStuPassword(e.target.value)} required />
            )}
            <select className="form-input" value={departmentId} onChange={(e) => {
              const id = e.target.value;
              setDepartmentId(id);
              setFilteredClasses(classes.filter(cls => cls.department_id == id));
            }} required>
              <option value="">-- Select Department --</option>
              {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
            </select>
            <select className="form-input" value={classId} onChange={(e) => setClassId(e.target.value)} required>
              <option value="">-- Select Class --</option>
              {filteredClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
            <button className="submit-button" type="submit">{editMode ? "Update" : "Submit"}</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AllStudents;
