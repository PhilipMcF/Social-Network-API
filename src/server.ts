import express from 'express';
import routes from './routes/index.js';
import db from './config/connection.js';

const port = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

await db();

app.listen(port, () => {
    console.log(`API server running on port ${port}`);
});