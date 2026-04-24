import mongoose, { Schema, model } from 'mongoose'
import type { InferSchemaType } from 'mongoose'

export const gradeSchema = new Schema({
	gradeid: Number,
	start: Number,
	end: Number,
	grade: String,
	gpa: Number
})


export const Grade = mongoose.models.Grade || model<InferSchemaType<typeof gradeSchema>>('Grade', gradeSchema)
