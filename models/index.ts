import mongoose, {type Model} from "mongoose";

import { Student } from "./Student.ts";
import { Mark } from "./Mark.ts";
import { Grade } from "./Grade.ts";
import { Head } from "./Head.ts";

import type{ 
    Student as StudentType, 
    Mark as MarkType, 
    Grade as GradeType, 
    Head as HeadType 
} from "../types.ts"


const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/recapsheet";


/* ------------------------ Singleton Connection --------------- */

let connectionPromise: Promise<typeof mongoose> | null = null;

async function ensureConnection() {
    if (!connectionPromise) {
        console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);
        connectionPromise = mongoose.connect(mongoUri)
            .then((m) => {
                console.log("Successfully connected to MongoDB");
                return m;
            })
            .catch((err) => {
                console.error("MongoDB connection error:", err);
                connectionPromise = null; // Reset for retry
                throw err;
            });
    }
    return connectionPromise;
}

/* connect immediately (hidden from user) */
export const connectDB = ensureConnection;
/* ------------------------------------------------------------- */

export const db = {
    Student, 
    Mark,
    Grade,
    Head, 
} satisfies {
    Student: Model<StudentType>,
    Mark: Model<MarkType>,
    Grade: Model<GradeType>,
    Head: Model<HeadType>
}