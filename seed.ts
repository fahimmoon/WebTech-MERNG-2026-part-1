import { db, connectDB } from "./models/index.ts";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
    try {
        await connectDB();
        const dataPath = path.join(__dirname, 'models', 'JSON');
        
        const students = JSON.parse(fs.readFileSync(path.join(dataPath, 'students.json'), 'utf8'));
        const marks = JSON.parse(fs.readFileSync(path.join(dataPath, 'marks.json'), 'utf8'));
        const heads = JSON.parse(fs.readFileSync(path.join(dataPath, 'heads.json'), 'utf8'));
        const grades = JSON.parse(fs.readFileSync(path.join(dataPath, 'grades.json'), 'utf8'));

        console.log('Clearing existing data...');
        await Promise.all([
            db.Student.deleteMany({}),
            db.Mark.deleteMany({}),
            db.Head.deleteMany({}),
            db.Grade.deleteMany({})
        ]);

        console.log('Importing data...');
        await db.Student.insertMany(students);
        await db.Mark.insertMany(marks);
        await db.Head.insertMany(heads);
        await db.Grade.insertMany(grades);

        console.log('✅ Data imported successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seed();
