const mongoose = require("mongoose");

const BlockedEmailSchema = new mongoose.Schema({
  email_address: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = BlockedEmail = mongoose.model(
  "blocked-email",
  BlockedEmailSchema
);
