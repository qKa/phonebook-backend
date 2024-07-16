require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

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

app.get("/", (request, response) => {
  response.send("<h1>Phonebook backend</h1>");
});

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((numberOfPersons) => {
      const currentDateTime = new Date();
      const responseText = `
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentDateTime}</p>
    `;
      response.send(responseText);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.statusMessage = "Person Not Found";
        response.status(404).send({ error: "Person Not Found" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  //   console.log("[POST] Request:", body);

  if (!body.name) {
    return response.status(400).json({ error: "name is missing" });
  }

  if (!body.number) {
    return response.status(400).json({ error: "number is missing" });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).json({ error: "Person Not Found" });
      }
      response.status(204).end(); // 204 No Content
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return response.status(404).json({ error: "Person Not Found" });
      }
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "Malformatted ID" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  response.status(500).json({ error: "Internal Server Error" });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
