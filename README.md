
# 🌱 Plant Care Tracker - Server

This is the backend server for the **Plant Care Tracker** application. It provides RESTful APIs for managing users, plants, and feedback functionality in a secure and organized way.

---

## 🔧 Technologies Used

- Node.js
- Express.js
- MongoDB (native driver)
- dotenv
- cors

---

## 📁 Project Structure

```
plant-care-server/
├── .env.example         # Environment config sample
├── .gitignore
├── index.js             # Main entry point
├── package.json
├── package-lock.json
├── vercel.json          # Deployment config for Vercel
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shakilsarkar12/plant-care-server.git
cd plant-care-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Use the `.env.example` as a guide and create a `.env` file:

```env
PORT=5000
DB_URI=your_mongodb_connection_string
```

### 4. Start the Server

```bash
npm run dev
```

Or (without nodemon):

```bash
node index.js
```

Server will run at: `http://localhost:5000`

---

## 📡 API Endpoints

### 🧑‍💼 Users
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| GET    | `/user/:email`   | Get user by email          |
| POST   | `/user`          | Add user if not exists     |

### 🌿 Plants
| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | `/plant/:id`          | Get plant by ID                  |
| GET    | `/myplants/:email`    | Get all plants for a user        |
| GET    | `/plants?sortBy=...`  | Get all plants (with sorting)    |
| GET    | `/newplants`          | Get 6 newest added plants        |
| POST   | `/plants`             | Add a new plant                  |
| PUT    | `/updateplant/:id`    | Update an existing plant         |
| DELETE | `/plantdelate/:id`    | Delete a plant                   |

### 💬 Feedback
| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| GET    | `/feedback`    | Get all feedback     |
| POST   | `/feedback`    | Submit new feedback  |

---

## 🔐 Environment Variables

These are the required environment variables:

```env
PORT=5000
DB_URI=your_mongodb_connection_string
```

---

## 🌐 Deployment

This project is ready to deploy on **Vercel** using `vercel.json` config.

---

## 🧪 Testing

Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) to test the API endpoints.

---

## 👨‍💻 Author

Developed by [**shakilsarkar12**](https://github.com/shakilsarkar12)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
