import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DeleteIcon from '../images/Dltimage.png';

const AllHOD = () => {
  const [hod, setHOD] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [facultyId, setFacultyId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [filterDeptId, setFilterDeptId] = useState('');

  const fetchHODs = () => {
    let url = 'https://gperiatd.onrender.com/hod/getAllHOD';
    if (filterDeptId) url += `?department_id=${filterDeptId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setHOD(data.hod || []))
      .catch(err => console.error('Failed to fetch HODs', err));
  };

  const fetchDepartments = () => {
    fetch('https://gperiatd.onrender.com/departments/getAllDepartments')
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []))
      .catch(err => console.error('Failed to fetch departments', err));
  };

  const fetchFacultyByDepartment = (deptId) => {
    if (!deptId) return setFacultyList([]);
    fetch(`https://gperiatd.onrender.com/faculty/getByDepartment/${deptId}`)
      .then(res => res.json())
      .then(data => setFacultyList(data.faculty || []))
      .catch(err => console.error('Failed to fetch faculty', err));
  };

  useEffect(() => {
    fetchHODs();
    fetchDepartments();
  }, [filterDeptId]);

  useEffect(() => {
    fetchFacultyByDepartment(departmentId);
  }, [departmentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { faculty_id: facultyId, department_id: departmentId };

    fetch('https://gperiatd.onrender.com/hod/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        fetchHODs();
        setFacultyId('');
        setDepartmentId('');
      })
      .catch(err => console.error('Submit error', err));
  };

  const handleDelete = (id) => {
    fetch(`https://gperiatd.onrender.com/hod/delete/${id}`, { method: 'POST' })
      .then(res => res.json())
      .then(() => fetchHODs())
      .catch(err => console.error('Delete error', err));
  };

  return (
    <>
      <Navbar />

      <div style={{ display: "flex", gap: "50px", padding: "20px" }}>
        {/* Table */}
        <div style={{ flex: 1 }}>
          <h2>👨‍🏫 All HODs</h2>

          

          {hod.length === 0 ? (
            <p>No HODs found.</p>
          ) : (
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Faculty Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hod.map((h) => (
                  <tr key={h.id}>
                    <td>{h.id}</td>
                    <td>{h.faculty_name}</td>
                    <td>{h.faculty_email || "No email added"}</td>
                    <td>{h.department_name}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <a style={{ cursor: "pointer" }} onClick={() => handleDelete(h.id)}>
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

        <div
          style={{
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            width: "350px"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>➕ Add HOD</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="DepartmentID" style={{ display: "block", marginBottom: "5px" }}>
                Select Department
              </label>
              <select
                id="DepartmentID"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                style={{ width: "100%", padding: "8px" }}
                required
              >
                <option value="">--Select Department--</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="FacultyID" style={{ display: "block", marginBottom: "5px" }}>
                Select Faculty
              </label>
              <select
                id="FacultyID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                style={{ width: "100%", padding: "8px" }}
                required
              >
                <option value="">--Select Faculty--</option>
                {facultyList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.faculty_name} ({f.faculty_email || "No email added"})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AllHOD;
