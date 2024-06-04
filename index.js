const express = require("express");
const app = express();

app.use(express.json());

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return id;
};

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Phonebook backend</h1>");
});

app.get("/info", (request, response) => {
  const numberOfPersons = persons.length;
  const currentDateTime = new Date();
  const responseText = `
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentDateTime}</p>
  `;
  response.send(responseText);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "Person Not Found";
    response.status(404).end();
    // response.status(404).send({ error: "Person not found" });
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log("[POST] Request:", body);

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  console.log(`[POST] New entry ID: '${person.id}' Name: '${person.name}' Number: '${person.number}' created.`);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personIndex = persons.findIndex((person) => person.id === id);

  if (personIndex !== -1) {
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end(); // 204 No Content
  } else {
    response.statusMessage = "Person Not Found";
    response.status(404).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
