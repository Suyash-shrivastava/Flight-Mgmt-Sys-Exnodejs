var express = require('express');
var router = express.Router();
var pool=require('./pool')

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');


router.get('/adminlogin', function(req, res, next) {
  res.render("adminlogin",{message:''});
});

router.get('/adminlogout', function(req, res, next) {
  localStorage.clear()
  res.render("adminlogin",{message:''});
});

router.post('/chkadminlogin', function(req, res, next) {
  pool.query("select * from administrator where (emailid=? or mobileno=?) and password=?",[req.body.emailmob, req.body.emailmob, req.body.pwd],function(error,result){
    if(error)
    {
      console.log(error)
      res.render("adminlogin",{message:'Server Error...'})
    }
    else
    {
      if(result.length==1)
      {
        localStorage.setItem("ADMIN",JSON.stringify(result[0]))
        res.render("dashboard",{data:result[0]})
      }
      else
      {
        res.render("adminlogin",{message:'Invalid Emailid/Mobile no./Password'})
      }
    }
  })
});

module.exports = router;
