# Phonebook Backend

This repository contains the backend implementation for the Phonebook application as part of the Full Stack Open course exercises 3.1-3.6. The backend is built using Node.js and Express, and it provides a REST API for managing phonebook entries.

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/qka/phonebook-backend.git
   cd phonebook-backend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the application:**

   For production:

   ```sh
   npm start
   ```

   For development (with automatic restarts):

   ```sh
   npm run dev
   ```

## API Endpoints

[https://phonebook-backend-vrgo.onrender.com](https://phonebook-backend-vrgo.onrender.com)

### Get All Phonebook Entries

- **URL:** `/api/persons`
- **Method:** `GET`
- **Description:** Returns a list of all phonebook entries.

#### Sample Response:

```json
[
  { "id": 1, "name": "Arto Hellas", "number": "040-123456" },
  { "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523" },
  { "id": 3, "name": "Dan Abramov", "number": "12-43-234345" },
  { "id": 4, "name": "Mary Poppendieck", "number": "39-23-6423122" }
]
```
