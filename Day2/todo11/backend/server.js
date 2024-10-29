const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://vidhi2005ajmera:9BnHy4pPlElJT4Sq@cluster0.8lxun.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Task Schema
const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: String,
  date: Date,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", TaskSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Allow JSON body parsing
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Set static files (e.g., the HTML, CSS, and JS)
app.use(express.static("public"));

// Register Route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  req.session.userId = newUser._id; // Start session after registration
  res.redirect("/");
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.userId = user._id; // Start session on login
    res.redirect("/");
  } else {
    res.redirect("/login?error=Invalid credentials");
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Protect routes
app.use((req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
});

// Serve the HTML file for the Todo list
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// API to add a task
app.post("/tasks", async (req, res) => {
  const { task, date } = req.body;
  const newTask = new Task({ userId: req.session.userId, task, date });
  await newTask.save();
  res.json(newTask);
});

// API to get tasks for the logged-in user
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find({ userId: req.session.userId });
  res.json(tasks);
});

// API to update task completion status
app.patch("/tasks/:id", async (req, res) => {
  const { completed } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { completed });
  res.sendStatus(200);
});

// API to delete a task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
