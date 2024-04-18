const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionSchema = new Schema({
  //_id: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  screenIds: { type: [ String ] },  
}, { timestamps: true });

collectionSchema.set('toObject', { virtuals: true });
collectionSchema.set('toJSON', { virtuals: true });

collectionSchema.virtual('id').get( function() {
  return this._id.toHexString();
});


const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;