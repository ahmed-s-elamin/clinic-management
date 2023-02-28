const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

//db configs
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "eddy",
  database: "clinic",
});

//fetching all
app.get("/patients", (req, res) => {
  const q = "SELECT * FROM patient";
  db.query(q, (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//create new patient
app.post("/patients/new", (req, res) => {
  const q =
    "INSERT INTO patient (`name`, `age`, `sex`, `diagnosis`, `prescription`) Values (?)";
  const values = [
    req.body.name,
    req.body.age,
    req.body.sex,
    req.body.diagnosis,
    req.body.prescription,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//fetching with id
app.get("/patients/:id", (req, res) => {
  const patientId = req.params.id;
  const q = "SELECT * FROM patient WHERE ID = ?";

  db.query(q, patientId, (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//update a patient
app.patch("/patients/:id", (req, res) => {
  const patientId = req.params.id;
  const q =
    "UPDATE patient SET `name`= ?, `age`= ?, `sex`= ?, `diagnosis`= ?, `prescription`= ? WHERE id = ? ";

  const values = [
    req.body.name,
    req.body.age,
    req.body.sex,
    req.body.diagnosis,
    req.body.prescription,
  ];

  db.query(q, [...values, patientId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//deleting a patient
app.delete("/patients/delete/:id", (req, res) => {
  const patientId = req.params.id;
  const q = "DELETE FROM patient WHERE id = ?";

  db.query(q, [patientId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(3030, () => console.log("server runnig"));
