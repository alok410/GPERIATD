import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import * as XLSX from 'xlsx';

const Report = () => {
  const { subjectId, facultyId } = useParams();
  const location = useLocation();
  const { subjectName, className } = location.state || {};

  const [students, setStudents] = useState({ theory: [], lab: [] });
  const [lectureDatesTheory, setLectureDatesTheory] = useState([]);
  const [lectureDatesLab, setLectureDatesLab] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/attendance/report/${subjectId}/${facultyId}`)
      .then(res => res.json())
      .then(data => {
        const theoryLectures = data.lectureDates.filter(ld => ld.duration === 1);
        const labLectures = data.lectureDates.filter(ld => ld.duration === 2);

        setLectureDatesTheory(theoryLectures);
        setLectureDatesLab(labLectures);

        const mapAttendance = (lectures) => {
          return data.students.map(student => {
            const attendance = {};
            lectures.forEach(ld => {
              if (student.attendance[ld.id]) {
                attendance[ld.id] = student.attendance[ld.id];
              }
            });
            return { ...student, attendance };
          });
        };

        setStudents({
          theory: mapAttendance(theoryLectures),
          lab: mapAttendance(labLectures)
        });
      })
      .catch(err => console.error('Error fetching report:', err));
  }, [subjectId, facultyId]);

  const calculateStats = (student, lectures) => {
    const attended = lectures.filter(ld => student.attendance[ld.id] === 'Present').length;
    const percentage = lectures.length ? ((attended / lectures.length) * 100).toFixed(2) : '0.00';
    return { attended, percentage };
  };




const generateSheetData = (type, lectureDates, reportData) => {
  const totalColumns = 3 + 30 + 2; // Sr No., Roll No, Name + 30 lectures + Total + %
  const lastCol = totalColumns - 1;

  const headingRows = [
    ['Gujarat Power Engineering and Research Institute'],
    [`Department: ____________ | Attendance Register: ${type}`],
    [`Subject Name: ${subjectName} | Class: ${className}`],
    [`Faculty: Prof. Alok Patel | Term Duration: 26/12/24 to 16/05/25`],
    []
  ];

  const headers = [
    'Sr No.', 'Roll No', 'Name',
    ...[...Array(30)].map((_, i) => {
      const lec = lectureDates[i];
      return lec ? `Lec ${i + 1} (${lec.date})` : `Lec ${i + 1}`;
    }),
    'Total Present', 'Attendance %'
  ];

  const dataRows = reportData.map((student, index) => {
    const attended = lectureDates.filter(ld => student.attendance[ld.id] === 'Present').length;
    const percentage = lectureDates.length ? ((attended / lectureDates.length) * 100).toFixed(2) : '0.00';
    const row = [
      index + 1,
      student.erno,
      student.name,
      ...[...Array(30)].map((_, i) => {
        const lec = lectureDates[i];
        if (lec) {
          const status = student.attendance[lec.id];
          return status === 'Present' ? 'P' : status === 'Absent' ? 'A' : '';
        }
        return '';
      }),
      attended,
      percentage
    ];
    return row;
  });

  const footerRows = [
    [],
    ['Signature of Faculty:', '', ''],
    ['Signature of HOD:', '', '']
  ];

  const sheetData = [...headingRows, headers, ...dataRows, ...footerRows];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // ✨ Merges
  worksheet['!merges'] = [
    ...[0, 1, 2, 3].map(r => ({
      s: { r, c: 0 },
      e: { r, c: lastCol }
    })),
    { s: { r: sheetData.length - 2, c: 0 }, e: { r: sheetData.length - 2, c: 2 } },
    { s: { r: sheetData.length - 1, c: 0 }, e: { r: sheetData.length - 1, c: 2 } }
  ];

  // ✨ Borders, Centering, Styling
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (!cell) continue;

      const isHeading = R < 4 && C === 0;
      const isHeaderRow = R === 5;
      const isFooter = R >= sheetData.length - 2 && C === 0;

      cell.s = {
        font: { bold: isHeading || isHeaderRow || isFooter },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        },
        fill: isHeaderRow ? { fgColor: { rgb: "D9D9D9" } } : undefined
      };
    }
  }

  // ✨ Column widths
  worksheet['!cols'] = [
    { wch: 6 }, // Sr No.
    { wch: 10 }, // Roll No
    { wch: 20 }, // Name
    ...Array(30).fill({ wch: 9 }),
    { wch: 14 }, // Total
    { wch: 14 }  // Percentage
  ];

  return worksheet;
};



  const exportAllToExcel = () => {
    const workbook = XLSX.utils.book_new();
const theorySheet = generateSheetData('Theory', lectureDatesTheory, students.theory);
const labSheet = generateSheetData('Lab', lectureDatesLab, students.lab);
XLSX.utils.book_append_sheet(workbook, theorySheet, 'Theory');
XLSX.utils.book_append_sheet(workbook, labSheet, 'Lab');
XLSX.writeFile(workbook, 'Attendance_Report_All.xlsx');
  };

  const renderStyledTable = (title, lectures, reportData) => {
    return (
      <>
        <h4 style={{ marginTop: '40px' }}>{title} Attendance</h4>
        <table border="1" cellPadding="6" style={{
          borderCollapse: 'collapse', width: '100%', fontSize: '14px'
        }}>
          <thead>
            <tr style={{ textAlign: 'center', fontWeight: 'bold' }}>
              <th>Sr No.</th>
              <th>Roll No</th>
              <th>Name</th>
              {[...Array(30)].map((_, i) => {
                const lec = lectures[i];
                return (
                  <th
                    key={i}
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      fontSize: '11px',
                      minWidth: '30px',
                      textAlign: 'center'
                    }}
                  >
                    {lec ? `Lec ${i + 1} (${lec.date})` : `Lec ${i + 1}`}
                  </th>
                );
              })}
              <th>Total Present</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((student, index) => {
              const { attended, percentage } = calculateStats(student, lectures);
              return (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.erno}</td>
                  <td>{student.name}</td>
                  {[...Array(30)].map((_, i) => {
                    const lec = lectures[i];
                    const status = lec ? student.attendance[lec.id] : '';
                    const color = status === 'Present' ? 'blue' : status === 'Absent' ? 'red' : '';
                    return (
                      <td
                        key={i}
                        style={{textAlign: 'center', fontWeight: 'bold', color }}
                      >
                        {status === 'Present' ? 'P' : status === 'Absent' ? 'A' : ''}
                      </td>
                    );
                  })}
                  <td>{attended}</td>
                  <td>{percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h3 style={{ textAlign: 'center' }}>Gujarat Power Engineering and Research Institute</h3>
        <p style={{ textAlign: 'center' }}>
          Department: ____________ | Attendance Register <br />
          Subject Name: <strong>{subjectName}</strong> | Class: <strong>{className}</strong> <br />
          Faculty: <strong>Prof. Alok Patel</strong> | Term Duration: 26/12/24 to 16/05/25
        </p>

        <div style={{ textAlign: 'right', marginBottom: '15px' }}>
          <button onClick={exportAllToExcel} style={{ padding: '8px 16px' }}>
            Export All to Excel
          </button>
        </div>

        {renderStyledTable('Theory', lectureDatesTheory, students.theory)}
        {renderStyledTable('Lab', lectureDatesLab, students.lab)}
      </div>
    </>
  );
};

export default Report;
