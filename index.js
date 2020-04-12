const express = require("express");
const fs = require('fs');
const path = require('path');
const app = express();
const XLSX = require('xlsx');

app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index', { courses: getNames('./files') });
});

app.get('/course', function (req, res, next) {
    res.render('course', { course: req.query.sel_course,
        fio: req.query.sel_f + " " + req.query.sel_i + " " + req.query.sel_o,
        subjects: getSubjects(req.query.sel_course) });
});

app.get('/list', function (req, res, next) {
    res.render('list', { list: getList() });
});

app.get('/calculate', function (req, res) {
    res.render('report', { course: req.query.sel_course, fio: req.query.sel_fio,
        subjects: getResult(req.query) });
});

app.get('/show', function (req, res) {
    res.render('show', { course: req.query.sel_course, fio: splitName(req.query.sel_course),
        subjects: readResult(req.query) });
});

app.listen(3000);

function splitName(str) {
    return str.split(', ')[0];
}

function getNames(dir) {
    let names = [];
    fs.readdirSync(dir).forEach((item, i) => {
        names.push(path.parse(item).name)
    });
    return names;
    //return fs.readdirSync('./files', "utf8", true);
}

function getSubjects(course) {
    var subjects = [];
    var workbook = XLSX.readFile('./files/' + course + ".xlsx");
    var worksheet = workbook.Sheets["План учебного процесса"];
    i = 10;
    name = worksheet['B' + i];
    val = worksheet['H' + i]
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

function getList(course) {
    var names = getNames('./data');
    return names;
    //return JSON.parse(fs.readFileSync('./files/' + course, 'utf8'));
}

function getResult(query) {
    let results = [];
    getSubjects(query.sel_course).forEach(element => {
        if (element.hours - query[element.subject] > 0) {
            results.push({ "subject": element.subject, "result": element.hours - query[element.subject] });
        }
    });
    let json = JSON.stringify(results);
    fs.writeFile('./data/' + query.sel_fio + ', ' + query.sel_course + '.json', json, function(err) {
        {
            if (err) {
                console.log(err);
            }
        }
    });
    return results;
}

function readResult(query) {
    return JSON.parse(fs.readFileSync('./data/' + query.sel_course + '.json', 'utf8'));;
}