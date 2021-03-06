//Author : Bhavik Thakkar
var express = require('express');
var app = express();
var path = require('path');

var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');

var sequelize = new Sequelize('OracleCloudDBTest', 'root', 'Bhavik123!', {
  dialect: 'mysql',
  host: "129.157.218.217",
  port: 3306,

  define:
  {
    timestamps: false // true by default
  }
});

var sellerRecords = sequelize.define('seller_records', {
   sellerID: {
      type: Sequelize.INTEGER,
      field: 'sellerID',
      primaryKey: true,
      autoIncrement: true
    },
  sellerFirstName: {
      type: Sequelize.STRING,
      field: 'sellerFirstName'
    },
    sellerLastName:{
      type: Sequelize.STRING,
      field: 'sellerLastName'
    },
    sellerEmail:{
      type: Sequelize.STRING,
      field: 'sellerEmail'
    },
    sellerPhoneNumber:{
      type: Sequelize.STRING,
      field: 'sellerPhoneNumber'
    },
	sellerCardNum:{
      type: Sequelize.STRING,
      field: 'sellerCardNum'
    },
	sellerCardCVV:{
      type: Sequelize.STRING,
      field: 'sellerCardCVV'
    },
	sellerCardExp:{
      type: Sequelize.STRING,
      field: 'sellerCardExp'
    },
	sellerAddress1: {
      type: Sequelize.STRING,
      field: 'sellerAddress1'
    },
    sellerAddress2:{
      type: Sequelize.STRING,
      field: 'sellerAddress2'
    },
    sellerCity:{
      type: Sequelize.STRING,
      field: 'sellerCity'
    },
	sellerPostcode:{
      type: Sequelize.STRING,
      field: 'sellerPostcode'
    },
	sellerPassword: {
      type: Sequelize.STRING,
      field: 'sellerPassword'
    },
  role: {
        type: Sequelize.STRING,
        field: 'role'
      }
}, {
  hooks: {
    afterValidate: function (seller_records) {
      seller_records.sellerPassword = bcrypt.hashSync(seller_records.sellerPassword, 8);
    }
  }
});


// this method inserts new seller once registration is successfully validated
exports.insertNewSeller = (req, res) => {


  sellerRecords.findOne({
    where: {
    sellerEmail : req.body.sellerEmail
    }
  }).then(function (result){
    if(!result) {
      //console.log('not present');
    sequelize.sync().then(function() {
    return sellerRecords.create({
      sellerFirstName: req.body.sellerFirstName,
      sellerLastName: req.body.sellerLastName,
      sellerEmail:req.body.sellerEmail,
      sellerPhoneNumber:req.body.sellerPhoneNumber,
	  sellerCardNum:req.body.sellerCardNum,
	  sellerCardCVV:req.body.sellerCardCVV,
	  sellerCardExp:req.body.sellerCardExp,
	  sellerAddress1: req.body.sellerAddress1,
      sellerAddress2: req.body.sellerAddress2,
      sellerCity:req.body.sellerCity,
	  sellerPostcode: req.body.sellerPostcode,
      sellerPassword: req.body.sellerPassword,
      role: 'seller'
    });
  }).then(function () {
    res.status(200);
  res.sendFile(path.join(__dirname + '/../views'+'/login.html'));
  });
}
else{
  //console.log('present');
  res.send('present');
}

});
};



var loginDetails = sequelize.define('login_details', {
   login_id: {
      type: Sequelize.STRING,
      field: 'login_id',
      primaryKey: true
    },
	password: {
      type: Sequelize.STRING,
      field: 'password'
    },
  role: {
        type: Sequelize.STRING,
        field: 'role'
    }
}, {
  hooks: {
    afterValidate: function (login_details) {
      login_details.password = bcrypt.hashSync(login_details.password, 8);
    }
  }
});

// this method also inserts data into login table once registration is done
exports.insertLogin = (req, res) => {
  sequelize.sync().then(function() {
    return loginDetails.create({
      login_id: req.body.sellerEmail,
      password: req.body.sellerPassword,
      role: 'seller'
    });
  }).then(function () {
    //res.sendStatus(200);
    //console.log('Login added');
  });
};


var nodemailer = require('nodemailer');

var router = express.Router();

//this method sends mail to buyer once registration is done successfully
exports.handleSayHello = (req, res) => {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'foodforsoul.16@gmail.com', // Your email id
          pass: 'ffs_nprss' // Your password
        }
    });
    var text = 'Hello ' +   req.body.sellerFirstName + ' \n\n' + 'Thank you for registering with FoodForSoul.\n You can now login into our website.';

      var mailOptions = {
        from: 'foodforsoul.16@gmail.com',
        to:  req.body.sellerEmail,
        subject: 'Welcome to FoodForSoul',
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
          //  res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            //res.json({yo: info.response});
        };
    });


  }
