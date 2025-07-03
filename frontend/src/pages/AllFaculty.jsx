import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DeleteIcon from "../images/Dltimage.png";
import EditIcon from "../images/Editimage.png";

const AllFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [facultyName, setFacultyName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterDept, setFilterDept] = useState("");
  const [filteredFaculty, setFilteredFaculty] = useState([]);

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  const fetchFaculty = () => {
    fetch("http://localhost:5000/faculty/getAllFaculty")
      .then(res => res.json())
      .then(data => {
        setFaculty(data.faculty || []);
        setFilteredFaculty(data.faculty || []);
      });
  };

  const fetchDepartments = () => {
    fetch("http://localhost:5000/departments/getAllDepartments")
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []));
  };

  const handleFilterChange = () => {
    let filtered = [...faculty];

    if (searchName) {
      filtered = filtered.filter(fac =>
        fac.faculty_name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (filterDept) {
      filtered = filtered.filter(fac => fac.department_id == filterDept);
    }

    setFilteredFaculty(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchName, filterDept, faculty]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: facultyName,
      email: facultyEmail,
      department_id: departmentId
    };

    if (!editMode) {
      payload.password = facultyPassword;
    } else if (facultyPassword.trim() !== '') {
      payload.password = facultyPassword;
    }

    const url = editMode
      ? `http://localhost:5000/faculty/updateFaculty/${editId}`
      : `http://localhost:5000/faculty/createFaculty`;
    const method = editMode ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(res => res.json())
      .then(() => {
        alert(editMode ? "Faculty updated!" : "Faculty added!");
        fetchFaculty();
        resetForm();
      });
  };

  const handleEdit = (fac) => {
    if (!window.confirm(`Edit ${fac.faculty_name}?`)) return;

    setEditMode(true);
    setEditId(fac.id);
    setFacultyName(fac.faculty_name);
    setFacultyEmail(fac.faculty_email);
    setDepartmentId(fac.department_id);
    setFacultyPassword('');
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this faculty?")) {
      fetch(`http://localhost:5000/faculty/deleteFaculty/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => {
          alert("Faculty deleted!");
          fetchFaculty();
        });
    }
  };

  const resetForm = () => {
    setFacultyName('');
    setFacultyEmail('');
    setFacultyPassword('');
    setDepartmentId('');
    setEditId(null);
    setEditMode(false);
  };

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", gap: "50px", padding: "20px" }}>
        <div style={{ flex: 1 }}>
          <h2>👨‍🏫 All Faculty</h2>
          <div style={{ marginBottom: "10px", display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Search by name" value={searchName} onChange={e => setSearchName(e.target.value)} style={inputStyle} />
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={inputStyle}>
              <option value="">Filter by Dept</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div style={{ maxHeight: "530px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "10px" }}>
            {filteredFaculty.length === 0 ? (
              <p>No faculty found.</p>
            ) : (
              <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((fac) => (
                    <tr key={fac.id}>
                      <td>{fac.id}</td>
                      <td>{fac.faculty_name}</td>
                      <td>{fac.faculty_email}</td>
                      <td>{fac.department_name}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <a style={{ cursor: "pointer", marginRight: "25px" }} onClick={() => handleEdit(fac)}>
                            <img style={{ height: "25px" }} src={EditIcon} alt="Edit" />
                          </a>
                          <a style={{ cursor: "pointer" }} onClick={() => handleDelete(fac.id)}>
                            <img style={{ height: "20px" }} src={DeleteIcon} alt="Delete" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", width: "350px" }}>
          <h2>{editMode ? "✏️ Edit Faculty" : "➕ Add Faculty"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={facultyEmail}
              onChange={(e) => setFacultyEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={facultyPassword}
              onChange={(e) => setFacultyPassword(e.target.value)}
              style={inputStyle}
              required={!editMode}
            />
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map(dep => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>
            <button type="submit" style={buttonStyle}>
              {editMode ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #aaa"
};

const buttonStyle = {
  padding: "10px 20px",
  borderRadius: "5px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};

export default AllFaculty;
