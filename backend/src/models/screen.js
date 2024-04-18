const mongoose = require("mongoose");
const { Schema } = mongoose;

const screenSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  updTime: { type: Number, required: true, default: 5 },
  initPositions: { 
    type: Map, 
    of: { 
      left: Number,
      right: Number, 
      top: Number, 
      bottom: Number, 
      width: Number, 
      height: Number 
    },
    required: true,
  },
  chartData: { type: Array },
  username: { type: String, select: false }, 
  password: { type: String, select: false }
}, { timestamps: true });

screenSchema.set('toObject', { virtuals: true });
screenSchema.set('toJSON', { virtuals: true });


screenSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Screen = mongoose.model('Screen', screenSchema);

module.exports = Screen;
