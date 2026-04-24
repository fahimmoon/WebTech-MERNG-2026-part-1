import mongoose, { Schema, model } from 'mongoose'
import type { InferSchemaType } from 'mongoose'

export const headSchema = new Schema({
	hid: Number,
	headname: String,
	total: Number
})


export const Head = mongoose.models.Head || model<InferSchemaType<typeof headSchema>>('Head', headSchema)
