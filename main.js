const express = require("express");
const app = express();

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
    return ["aaa", "bbb", "ccc"];
}

function getSubjects(course)
{
    return [{"subject": "math", "hours": 10}, {"subject": "phys", "hours": 10}, {"subject": "chem", "hours": 10}, {"subject": "autism", "hours": 10}];
}

function getResult(query)
{
    let results = [];

    getSubjects(query.sel_course).forEach(element => {
        results.push({"subject": element.subject, "result": element.hours - query[element.subject] <= 0 ? "Прошел" : "Нахуй пошел"});
    });

    return results;
}