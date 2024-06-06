const express = require("express");
const morgan = require("morgan");
const app = express();

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

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return id;
};

app.use(express.static("dist"));
app.use(express.json());

// Custom Morgan token to log the request body for POST requests
morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return null;
});

// Custom Morgan format function to conditionally include the body token
const morganFormat = (tokens, req, res) => {
  const body = tokens.body(req, res);
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    body ? `${body}` : "",
  ].join(" ");
};

// Apply the Morgan middleware using the custom format function
app.use(morgan(morganFormat));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

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
  //   console.log("[POST] Request:", body);

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  const nameExists = persons.some((person) => person.name === body.name);

  if (nameExists) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  //   console.log(`[POST] New entry ID: '${person.id}' Name: '${person.name}' Number: '${person.number}' created.`);
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

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
