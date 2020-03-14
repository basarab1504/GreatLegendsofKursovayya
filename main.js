const express = require("express");
const app = express();
const fs = require('fs');

app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index', { courses: getCourses()});
});

app.get('/course', function (req, res, next) {
    res.render('course', { course: req.query.sel_course, subjects: getSubjects(req.query.sel_course)});
});

app.get('/calculate', function (req, res) {
    res.render('report', { course: req.query.sel_course, subjects: getResult(req.query)});
});

app.listen(3000);

function getCourses()
{
    return fs.readdirSync('./files');
}

function getSubjects(course)
{
    return JSON.parse(fs.readFileSync('./files/' + course, 'utf8'));
}

function getResult(query)
{
    let results = [];

    getSubjects(query.sel_course).forEach(element => {
        results.push({"subject": element.subject, "result": element.hours - query[element.subject] <= 0 ? "Прошел" : "Не прошел"});
    });

    return results;
}