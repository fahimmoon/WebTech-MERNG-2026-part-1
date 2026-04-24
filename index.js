import 'dotenv/config';
import express from 'express';
import path from 'path';
import vash from 'vash';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js';
import apiRouter from './routes/api.js';
import { connectDB } from './models/index.ts';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');
const viewsDir = path.join(__dirname, 'views');

app.engine('vash', vash.__express);
app.set('view engine', 'vash');
app.set('views', viewsDir);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir, { index: false }));


app.use('/', indexRouter);
app.use('/api', apiRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
