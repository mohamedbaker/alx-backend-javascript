const fs = require('fs');

const countStudents = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, resData) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const printOut = [];
      let printItem;
      const data = resData.toString().split('\n');
      let students = data.filter((item) => item.trim() !== '');
      students = students.map((item) => item.split(','));

      // Assumes the first row is the header
      printItem = `Number of students: ${students.length - 1}`;
      console.log(printItem);
      printOut.push(printItem);

      const fields = {};
      for (let i = 1; i < students.length; i++) {
        const student = students[i];
        const field = student[3];
        if (!fields[field]) {
          fields[field] = [];
        }
        fields[field].push(student[0]);
      }

      for (const [field, names] of Object.entries(fields)) {
        printItem = `Number of students in ${field}: ${names.length}. List: ${names.join(', ')}`;
        console.log(printItem);
        printOut.push(printItem);
      }

      resolve(printOut);
    });
  });
};

module.exports = countStudents;
