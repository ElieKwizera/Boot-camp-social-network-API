const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');


dotenv.config({path:'./config/config.env'});

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));

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
          console.log('data imported ...'.cyan.inverse);
          process.exit();
      }
       catch (error) 
      {
          console.error(error);
          process.exit();
      }
  }

  const deleteData = async ()=>
  {
      try 
      {
          await Course.deleteMany();
          await Bootcamp.deleteMany();
          console.log('data deleted ...'.cyan.inverse);
          process.exit();
      }
       catch (error) 
      {
          console.error(error);
          process.exit();
      }
  }

  if(process.argv[2] === '-import')
  {
      importData();
  }
  else if(process.argv[2] === '-clear')
  {
      deleteData();
  }