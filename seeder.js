const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const Bootcamp = require('./models/Bootcamp');


dotenv.config({path:'./config/config.env'});

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
          console.log('data imported ...'.cyan.inverse);
          process.exit();
      }
       catch (error) 
      {
          console.error(error);
      }
  }

  const deleteData = async ()=>
  {
      try 
      {
          await Bootcamp.deleteMany();
          console.log('data deleted ...'.cyan.inverse);
          process.exit();
      }
       catch (error) 
      {
          console.error(error);
      }
  }

  if(process.argv[2] === '-import')
  {
     importData(); 
  }
  else if(process.argv[2] === '-delete')
  {
      deleteData();
  }