const express = require("express");
const fs = require('fs');
const path = require('path');
const app = express();
const XLSX = require('xlsx');

app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index', { courses: getCourses() });
});

app.get('/course', function (req, res, next) {
    res.render('course', { course: req.query.sel_course, subjects: getSubjects(req.query.sel_course) });
});

app.get('/calculate', function (req, res) {
    res.render('report', { course: req.query.sel_course, subjects: getResult(req.query) });
});

app.listen(3000);

function getCourses(callback) {
    let names = [];
    fs.readdirSync('./files').forEach((item, i) => {
        names.push(path.parse(item).name)
    });
    return names;
    //return fs.readdirSync('./files', "utf8", true);
}

function getSubjects(course) {
    var subjects = [];
    var workbook = XLSX.readFile('./files/' + course);
    var worksheet = workbook.Sheets["План учебного процесса"];
    i = 10;
    name = worksheet['B' + i];
    val = worksheet['H' + i];

    while (name) {
        var subj = {
            subject: name.v,
            hours: val.v
        };
        subjects.push(subj);
        i = i + 1;
        name = worksheet['B' + i];
        val = worksheet['H' + i];
    }
    return subjects;
    //return JSON.parse(fs.readFileSync('./files/' + course, 'utf8'));
}

function getResult(query) {
    let results = [];

    getSubjects(query.sel_course).forEach(element => {
        if (element.hours - query[element.subject] > 0) {
            results.push({ "subject": element.subject, "result": element.hours - query[element.subject] });
        }
    });

    return results;
}
