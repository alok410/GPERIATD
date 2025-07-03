import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const AllPrincipal = () => {
  const [principal, setPrincipal] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editId, setEditId] = useState(null);

  // Fetch principals
  const fetchPrincipals = () => {
    fetch("http://localhost:5000/principal/getPrincipal")
      .then(res => res.json())
      .then(data => {
        setPrincipal(data.principal || []);
      })
      .catch(err => console.error("Failed to fetch Principal", err));
  };

  useEffect(() => {
    fetchPrincipals();
  }, []);

  // Handle form submit (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, email, password };

    const url = editId
      ? `http://localhost:5000/principal/update/${editId}`
      : `http://localhost:5000/principal/create`;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        fetchPrincipals();
        setName('');
        setEmail('');
        setPassword('');
        setEditId(null);
      })
      .catch(err => console.error("Failed to save Principal", err));
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setName(p.name);
    setEmail(p.email);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/principal/delete/${id}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(() => fetchPrincipals())
      .catch(err => console.error("Delete error", err));
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', gap: '50px', padding: '20px' }}>
        {/* Principal Table */}
        <div style={{ flex: 1 }}>
          <h2>👨‍🏫 Principal</h2>
          {principal.length === 0 ? (
            <p>No Principal found.</p>
          ) : (
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {principal.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>
                      <button onClick={() => handleEdit(p)} style={{ marginRight: '10px' }}>Edit</button>
                      <button onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add/Edit Principal Form */}
        <div
          style={{
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            width: "350px",
          }}
        >
          <h2>{editId ? '✏️ Edit Principal' : '➕ Add Principal'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
                required={!editId} // Password only required on create
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: editId ? "#ffc107" : "#28a745",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              {editId ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AllPrincipal;
