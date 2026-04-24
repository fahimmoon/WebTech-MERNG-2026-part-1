import mongoose, { Schema, model } from 'mongoose'
import type { InferSchemaType } from 'mongoose'

export const markSchema = new Schema({
	mid: Number,
	regno: String,
	hid: Number,
	marks: Number, 
	// student: { 
	// 	type: Schema.Types.ObjectId, 
	// 	ref: 'Student' 
	// }
})


export const Mark = mongoose.models.Mark || model<InferSchemaType<typeof markSchema>>('Mark', markSchema)
