const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path');
const db = require("./config/db");
const cors = require('cors');
// Routes
const ActivityRoute = require('./routes/activity.route');
const ArticleRoute = require('./routes/article.route');
const CategoryRoute = require('./routes/category.route');
const DialogRoute = require('./routes/dialog.route');
const PublicationRoute = require('./routes/publication.route');
const SeminarRoute = require('./routes/seminar.route');
const StudyRoute = require('./routes/study.route');
// middleware rate limit 
const rateLimiter = require('./middlewares/rateLimiter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(rateLimiter);

// main
app.get('/', (req, res) => {
    res.send('MCIE API PAGE HOME');
});

// Route V1
app.use('/api/v1/activity', ActivityRoute);
app.use('/api/v1/article', ArticleRoute);
app.use('/api/v1/category', CategoryRoute);
app.use('/api/v1/dialog', DialogRoute);
app.use('/api/v1/publication', PublicationRoute);
app.use('/api/v1/seminar', SeminarRoute);
app.use('/api/v1/study', StudyRoute);
app.use("/api/v1/image/", express.static(path.join(__dirname, "")));

//Not Found Routes
app.use("*", (req, res) => {
    res.status(404).json({
        message: "Endpoint not found: The requested resource does not exist.",
        endpoint: req.originalUrl,
        timestamp: new Date(),
    });
});

db.connect();
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`);
});