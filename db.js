const mongoose = require("mongoose");
// Free tier MongoDB Cluster URI
const mongoURI =
  "mongodb+srv://joefstack:CULiTkWkbhKZPhcU@cluster0.cjwiw.mongodb.net/cluster0?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
