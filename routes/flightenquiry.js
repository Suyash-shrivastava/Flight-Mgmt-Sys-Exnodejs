var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/flightinterface', function(req, res, next) {
var admin=JSON.parse(localStorage.getItem('ADMIN'))
if(admin)
{res.render('flightinterface',{'message':' '});
}
else
{res.render('adminlogin',{'message':' '});
}
});

router.get('/displayallflights',function(req,res){
var admin=JSON.parse(localStorage.getItem('ADMIN'))
if(!admin)
{res.render('adminlogin',{message:''})}
else
{
  pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.sourcecity)as sourcecity,(select C.cityname from cities C where C.cityid=F.destinationcity)as destcity from flightdetails F",function(error,result){
    if(error)
    {
      console.log(error)
      res.render('displayallflights',{'data':[],'message':'Server Error...'})
    }
    else
    {
      res.render('displayallflights',{'data':result,'message':'Success'})
    }    
    })
}
})

  router.get('/searchbyid',function(req,res){
    pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.sourcecity)as sourcecity,(select C.cityname from cities C where C.cityid=F.destinationcity)as destcity from flightdetails F where flightid=?",[req.query.fid],function(error,result){
if(error)
{
  console.log(error)
  res.render('flightbyid',{'data':[],'message':'Server Error'})
}
else{
  console.log(error)
  res.render('flightbyid',{'data':result[0],'message':'Success'})
}
})
})
  
  router.get('/searchbyidforimage',function(req,res){
    pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.sourcecity)as sourcecity,(select C.cityname from cities C where C.cityid=F.destinationcity)as destcity from flightdetails F where flightid=?",[req.query.fid],function(error,result){
if(error)
{
  console.log(error)
  res.render('showimage',{'data':[],'message':'Server Error'})
}
else
{
  res.render('showimage',{'data':result[0],'message':'Success'})
}
})
})

router.post('/flightsubmit',upload.single('logo'),function(req,res){
  console.log("BODY",req.body)
  console.log("FILE",req.file)

  var days=(""+req.body.days).replaceAll("'",'"')
 
pool.query("insert into flightdetails (flightname, flighttype, flightseats, days, sourcecity, destinationcity, arrivaltime, departuretime, company, logo)values(?,?,?,?,?,?,?,?,?,?)",[req.body.flightname,req.body.flighttype,req.body.flightseats,days,req.body.sourcecity,req.body.destcity,req.body.arrtime,req.body.deptime,req.body.company,req.file.originalname],function(error,result){
if(error)
{
  console.log(error)
  res.render('flightinterface',{'message':'Server Error'})
}  
else
{
  res.render('flightinterface',{'message':'Record Submitted Succesfully'})
}
})
})

router.post('/editimage',upload.single('logo'),function(req,res){
  console.log("BODY",req.body)
  console.log("FILE",req.file)
 
pool.query("update flightdetails set logo=? where flightid=?",[req.file.originalname,req.body.flightid],function(error,result){

if(error)
{
  console.log(error)
  res.redirect('/flight/displayallflights')}  
else
{
  res.redirect('/flight/displayallflights')}
})
})

router.post('/flight_edit_delete',function(req,res){
if(req.body.btn=="Edit")
{var days=(""+req.body.days).replaceAll("'",'"')
 
pool.query("update flightdetails set flightname=?, flighttype=?, flightseats=?, days=?, sourcecity=?, destinationcity=?, arrivaltime=?, departuretime=?, company=? where flightid=?",[req.body.flightname,req.body.flighttype,req.body.flightseats,days,req.body.sourcecity,req.body.destcity,req.body.arrtime,req.body.deptime,req.body.company,req.body.flightid],function(error,result){
if(error)
{
  res.redirect('/flight/displayallflights')
}  
else
{
  res.redirect('/flight/displayallflights')
}
})
}

else 
{
  var days=(""+req.body.days).replaceAll("'",'"')

pool.query("delete from flightdetails where flightid=?",[req.body.flightid],function(error,result){
if(error)
{
  res.redirect('/flight/displayallflights')
}  
else
{
  res.redirect('/flight/displayallflights')
}
})
} 
})


router.get('/fetchallcities',function(req,res){
  pool.query("select * from cities",function(error,result){
    if(error)
    {res.status(500).json({result:[],message:'Server Error'})}
    else
    {res.status(200).json({result:result,message:'Success'})}
  })
})

  module.exports = router;
  