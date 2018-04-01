const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    name: String,
    description: String,
    userId: String,
    race: String,
    gender: String,
    age: String,
    kind: String,
    date: Date,
    position: [],
    cellphone: String,
    photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }]
})

postSchema.index({ position: "2d" })

module.exports = mongoose.model("Post", postSchema)