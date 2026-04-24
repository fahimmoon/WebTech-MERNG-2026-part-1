import { db, connectDB } from "./models/index.ts";

async function verify() {
    await connectDB();
    const studentCount = await db.Student.countDocuments();
    const markCount = await db.Mark.countDocuments();
    const headCount = await db.Head.countDocuments();
    const gradeCount = await db.Grade.countDocuments();

    console.log("--- Database Verification ---");
    console.log(`Students in DB: ${studentCount}`);
    console.log(`Marks in DB: ${markCount}`);
    console.log(`Heads in DB: ${headCount}`);
    console.log(`Grades in DB: ${gradeCount}`);
    
    if (studentCount > 0) {
        console.log("SUCCESS: Data is being fetched directly from MongoDB.");
    } else {
        console.log("WARNING: MongoDB appears to be empty.");
    }
    process.exit(0);
}

verify();
