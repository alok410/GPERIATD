const db = require('../config/db'); 

const getAllLecture = (req,res) =>{

    const query = `SELECT 
  L.subject_id,
  f.name AS faculty_name,
  L.faculty_id,
  S.name AS subject_name,
  L.id AS lecture_id,
  L.duration,
  C.name AS class_name,
  S.class_id
FROM lectures AS L
JOIN subjects AS S ON L.subject_id = S.id
JOIN classes AS C ON S.class_id = C.id
JOIN faculty AS f ON f.id = L.faculty_id;`


  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({
      message: 'Lectures fetched successfully',
      lectures: results
    });
  });
};




// 📘 Controller to get count of lectures (duration = 1) and labs (duration = 2) per subject
const getLectureSummary = (req, res) => {
    const query = `
    SELECT 
    s.id AS subject_id,
    s.name AS subject_name,
    c.name AS class_name,
    SUM(CASE WHEN l.duration = 1 THEN 1 ELSE 0 END) AS total_lectures,
    SUM(CASE WHEN l.duration = 2 THEN 1 ELSE 0 END) AS total_labs
    FROM lectures l
    JOIN subjects s ON l.subject_id = s.id
    JOIN classes c ON s.class_id = c.id
    GROUP BY l.subject_id;
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
    res.status(200).json({
        message: 'Lecture summary fetched successfully',
        summary: results
    });
  });
};

const getLectureSummaryByFaculty = (req, res) => {
  const query = `
    SELECT 
      f.id AS faculty_id,
      f.name AS faculty_name,
      s.id AS subject_id,
      s.name AS subject_name,
      c.name AS class_name,
      SUM(CASE WHEN l.duration = 1 THEN 1 ELSE 0 END) AS total_lectures,
      SUM(CASE WHEN l.duration = 2 THEN 1 ELSE 0 END) AS total_labs
    FROM lectures l
    JOIN faculty f ON l.faculty_id = f.id
    JOIN subjects s ON l.subject_id = s.id
    JOIN classes c ON s.class_id = c.id
    GROUP BY f.id, s.id;
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({
      message: 'Lecture summary by faculty fetched successfully',
      summary: results
    });
  });
};

const getLectureCountsByFaculty = (req, res) => {
  const { facultyId } = req.params;

  const query = `
    SELECT 
      subject_id,
      SUM(CASE WHEN duration = 1 THEN 1 ELSE 0 END) AS lecture_count,
      SUM(CASE WHEN duration = 2 THEN 1 ELSE 0 END) AS lab_count
    FROM lectures
    WHERE faculty_id = ?
    GROUP BY subject_id
  `;

  db.query(query, [facultyId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(results);
  });
};

const getLecturesBySubject = (req, res) => {
  const { subjectId } = req.params;

  const query = `
    SELECT 
      l.id,
      l.topic,
      l.date,
      l.duration,
      l.status,
      l.faculty_id,
      s.name AS subject_name,
      f.name AS faculty_name
    FROM lectures l
    JOIN subjects s ON l.subject_id = s.id
    JOIN faculty f ON l.faculty_id = f.id
    WHERE l.subject_id = ?
    ORDER BY l.id DESC
  `;

  db.query(query, [subjectId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(results);
  });
};





const createLecture = (req, res) => {
  const { subject_id, faculty_id, topic, date, duration } = req.body;

  if (!subject_id || !faculty_id || !topic || !date || !duration) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `
    INSERT INTO lectures (subject_id, faculty_id, topic, date, duration)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [subject_id, faculty_id, topic, date, duration], (err, result) => {
    if (err) {
      console.error('❌ Error inserting lecture:', err);
      return res.status(500).json({ message: 'Server error while creating lecture.' });
    }

    res.status(201).json({ message: 'Lecture created successfully', lectureId: result.insertId });
  });
};



module.exports = {
  getAllLecture,getLectureSummary,getLecturesBySubject,
  getLectureSummaryByFaculty,getLectureCountsByFaculty,createLecture};