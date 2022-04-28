const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const LikeSchema = new Schema({
  user_id: {type: ObjectId},
  image_id: {type: ObjectId}
});

module.exports = mongoose.model('Like', LikeSchema);
