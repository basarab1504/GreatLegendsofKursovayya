const express = require("express");
const fs = require('fs');
const path = require('path');
const app = express();

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

function getCourses(callback)
{
    let names = [];
    fs.readdirSync('./files').forEach((item, i) => {
        names.push(path.parse(item).name)
    });
    return names;
    //return fs.readdirSync('./files', "utf8", true);

function getSubjects(course) {
    return JSON.parse(fs.readFileSync('./files/' + course, 'utf8'));
}

function getResult(query) {
    let results = [];

    getSubjects(query.sel_course).forEach(element => {
        if (element.hours - query[element.subject] > 0) {
            results.push({"subject": element.subject, "result": element.hours - query[element.subject]});
        }
    });

    return results;
}