import { db, connectDB } from "./models/index.ts";

async function findMark() {
    await connectDB();
    const regno = "1712218";
    const mark = await db.Mark.findOne({ regno: regno, hid: 1 });
    console.log(`Student ${regno}, Head 1 Marks: ${mark ? mark.marks : "NOT FOUND"}`);
    process.exit(0);
}

findMark();
