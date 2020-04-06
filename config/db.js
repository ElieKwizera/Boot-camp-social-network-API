const mongoose = require("mongoose");

const DBConnect = async () => {
  const conn = await mongoose.connect(process.env.MongoDB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB connected: ${conn.connection.host}`.yellow);
};

module.exports = DBConnect;
