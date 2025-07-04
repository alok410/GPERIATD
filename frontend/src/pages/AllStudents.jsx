import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DeleteIcon from "../images/Dltimage.png";
import EditIcon from "../images/Editimage.png";

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
      <div style={pageStyle}>
        <div style={leftSection}>
          
          <h2 style={headingStyle}>📚 All Students</h2>

          <div style={filterContainer}>
            <input type="text" placeholder="Search by name" value={searchName} onChange={e => setSearchName(e.target.value)} style={inputStyle} />
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={inputStyle}>
              <option value="">Filter by Dept</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={inputStyle}>
              <option value="">Filter by Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="Filter by Batch" value={filterBatch} onChange={e => setFilterBatch(e.target.value)} style={inputStyle} />
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)} style={inputStyle}>
              <option value="">Filter by Semester</option>
              {[...new Set(classes.map(c => c.semester_id))].sort((a, b) => a - b).map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div style={tableWrapper}>
            {filteredStudents.length === 0 ? (
              <p style={{ color: '#ccc' }}>No students found.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr style={{ border: "2px solid grey" }}>
                    <th style={cellStyle}>ID</th>
                    <th style={cellStyle}>Name</th>
                    <th style={cellStyle}>Email</th>
                    <th style={cellStyle}>Department</th>
                    <th style={cellStyle}>Class</th>
                    <th style={cellStyle}>Semester</th>
                    <th style={cellStyle}>Batch</th>
                    <th style={cellStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((stu) => (
                    <tr key={stu.id}>
                      <td style={cellStyle}>{stu.id}</td>
                      <td style={cellStyle}>{stu.name}</td>
                      <td style={cellStyle}>{stu.email}</td>
                      <td style={cellStyle}>{stu.department_name}</td>
                      <td style={cellStyle}>{stu.class_name}</td>
                      <td style={cellStyle}>{getSemesterByClassId(stu.class_id)}</td>
                      <td style={cellStyle}>{stu.batch}</td>
                      <td style={cellStyle}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <img style={iconStyle} src={EditIcon} alt="Edit" onClick={() => handleEditClick(stu)} />
                          <img style={iconStyle} src={DeleteIcon} alt="Delete" onClick={() => handleDelete(stu.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={formCard}>
          <h2>{editMode ? "✏️ Edit Student" : "➕ Add Student"}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={stuName} onChange={(e) => setStuName(e.target.value)} style={AddStyle} required />
            <input type="number" placeholder="Batch" value={stuBatch} onChange={(e) => setStuBatch(e.target.value)} style={AddStyle} required />
            <input type="email" placeholder="Email" value={stuEmail} onChange={(e) => setStuEmail(e.target.value)} style={AddStyle} required />
            {!editMode && (
              <input type="password" placeholder="Password" value={stuPassword} onChange={(e) => setStuPassword(e.target.value)} style={AddStyle} required />
            )}
            <select value={departmentId} onChange={(e) => {
              const id = e.target.value;
              setDepartmentId(id);
              setFilteredClasses(classes.filter(cls => cls.department_id == id));
            }} style={AddStyle} required>
              <option value="">-- Select Department --</option>
              {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
            </select>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} style={AddStyle} required>
              <option value="">-- Select Class --</option>
              {filteredClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
            <button type="submit" style={buttonStyle}>{editMode ? "Update" : "Submit"}</button>
          </form>
        </div>
      </div>
    </>
  );
};


const cellStyle = {
  border: "1px solid grey",
  padding: "10px",
  verticalAlign: "middle"
};

const pageStyle = {
  display: "flex",
  gap: "30px",
  background: "linear-gradient(to bottom right, #1f2937, #0f172a)",
  color: "#fff",
  minHeight: "100vh",
  padding: "20px"
};

const leftSection = { flex: 1 };

const headingStyle = {
  fontSize: "1.8rem",
  marginBottom: "1rem"
};

const filterContainer = {
  marginBottom: "15px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
};

const tableWrapper = {
  maxHeight: "530px",
  overflowY: "auto",
  border: "1px solid #ffffff20",
  padding: "10px",
  borderRadius: "10px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#fff",
  borderSpacing: "0 10px", // adds vertical spacing between rows
  fontSize: "14px"
};

const iconStyle = {
  height: "24px",
  margin: "0 10px",
  cursor: "pointer"
};

const inputStyle = {
  padding: "6px",
  borderRadius: "6px",
  border: "1px solid #444",
  minWidth: "150px",
  backgroundColor: "#1e293b",
  color: "#fff"
};

const formCard = {
  background: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "16px",
  padding: "20px",
  width: "350px",
  alignSelf: "flex-start",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)"
};

const AddStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #555",
  backgroundColor: "#1e293b",
  color: "#fff"
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "6px",
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  width: "100%",
  fontWeight: "bold"
};

export default AllStudents;
