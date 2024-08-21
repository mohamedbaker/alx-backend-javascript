const express = require('express');
const fs = require('fs');

const app = express();
const path = process.argv.length > 2 ? process.argv[2] : '';

const countStudents = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, resData) => {
            if (err) {
                reject(new Error('Cannot load the database'));
                return;
            }

            const printOut = [];
            const data = resData.toString().split('\n');
            let students = data.filter((item) => item.trim() !== '');
            students = students.map((item) => item.split(','));

            if (students.length <= 1) {
                resolve(['Number of students: 0']);
                return;
            }

            const studentCount = students.length - 1;
            printOut.push(`Number of students: ${studentCount}`);

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
                const fieldCount = names.length;
                const list = names.join(', ');
                printOut.push(`Number of students in ${field}: ${fieldCount}. List: ${list}`);
            }

            resolve(printOut);
        });
    });
};

app.get('/', (req, res) => {
    res.send('Hello Holberton School!');
});

app.get('/students', (req, res, next) => {
    countStudents(path)
        .then((data) => {
            res.send(`This is the list of our students\n${data.join('\n')}`);
        })
        .catch((error) => {
            next(error);
        });
});

app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});

app.listen(1245, () => { });

module.exports = app;
