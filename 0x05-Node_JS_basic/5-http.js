const http = require('http');
const fs = require('fs');

const path = process.argv[2];

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

      if (students.length <= 1) {
        resolve(['Number of students: 0']);
        return;
      }

      printItem = `Number of students: ${students.length - 1}`;
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
        printOut.push(printItem);
      }

      resolve(printOut);
    });
  });
};

const app = http.createServer((req, res) => {
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Holberton School!');
  } else if (req.url === '/students') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    countStudents(path)
      .then((data) => {
        res.end(`This is the list of our students\n${data.join('\n')}`);
      })
      .catch((error) => {
        res.statusCode = 500;
        res.end(error.message);
      });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

app.listen(1245, () => {
});

module.exports = app;
