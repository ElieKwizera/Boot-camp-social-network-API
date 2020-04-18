const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');


dotenv.config({path:'./config/config.env'});

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'));

mongoose.connect(process.env.MongoDB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const importData = async ()=>
  {
      try 
      {
          await Bootcamp.create(bootcamps);
          await Course.create(courses);
          await User.create(users);
          await Review.create(reviews);
          console.log('data imported ...'.cyan.inverse);
          process.exit();
      }
       catch (error) 
      {
          console.error(error);
          process.exit();
      }
  };

  const deleteData = async ()=>
  {
      try 
      {
          await Course.deleteMany();
          await Bootcamp.deleteMany();
          await User.deleteMany();
          await Review.deleteMany();
          console.log('data deleted ...'.cyan.inverse);
          process.exit();
      }
       catch (error) 
      {
          console.error(error);
          process.exit();
      }
  };

  if(process.argv[2] === '-import')
  {
      importData();
  }
  else if(process.argv[2] === '-clear')
  {
      deleteData();
  }