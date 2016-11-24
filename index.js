var express    = require('express');
var mysql   = require('mysql');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'mani',
        database: 'marriage'
    }); 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }});

app.get('/ologin',function(req,res){
	res.sendFile(__dirname +'/public/ownerlogin.html');
})

app.get('/marr',function(req,res){
	var c=req.query.name;
	var e=req.query.Address;
	var f=req.query.City;
	var g=req.query.age;
	var h=req.query.job;
	var k=req.query.phonenumber;
	var i=req.query.salary;
	var j=req.query.gender;
	console.log('test'+c);
	n={name:c,Address:e,City:f,Age:g,job:h,phonenumber:k,salary:i,gender:j}
	connection.query('insert into people set ?',n,function(err,rows)
	{   
		res.render('success_in',{});
	})

})


app.get('/ologincheck',function(req,res){
	var cuser=req.query.username;
	var cpass=req.query.password;
	connection.query('select * from ownerreg where oname= ?',cuser,function(err,result){
        console.log(cuser+'test');
        console.log(result[0].password+'test');
		if(cpass==result[0].password)
			{	connection.query('select * from person,people,request where people.Cid=request.Cid and request.oid=person.oid and p_name=?',cuser , function(err,  rows ,fields) 
				{	console.log(rows);
					if(rows.length!=0)
					res.render('marriagepage',{username:rows});
				else
				{connection.query('select * from person where p_name=?',cuser,function(err,rows){
					res.render('marriagepage2',{username:rows});
				})
					
				}
				});
		}
			else
			res.sendFile(__dirname +'/public/error.html');	
	})
});




app.get('/book',function(req,res){
var username=req.query.id;
console.log(username);

connection.query('select * from people',function(err,  rows ,fields) 
 	{
var hel=[{people:rows},{username:username}];
console.log(hel[1].username);
console.log(hel);
		res.render('book',{hello:hel});
	}); 				
});

app.post('/book',function(req,res){
var username=req.query.id;
var name=req.body.cname;
var city=req.body.city;
console.log(name+"cname");
console.log(city+"city");
console.log(username+"username");
connection.query('select OID from person where p_name=?',username,function(err,result,fields)
{
	console.log(result[0].OID);
connection.query('select * from people where name =?',name,function(err,rows,fields)
{
	console.log(rows[0].CID);

var o={OID:result[0].OID,CID:rows[0].CID}	;
connection.query('insert into request set ?', o, function (err, rows) {
	
 res.render('success',{username:username,name:name});
});

})	

})
			
});

app.get('/createowner',function(req,res){
	var a=req.query.username;
	var b=req.query.password;
	
	var e=req.query.address;
	var f=req.query.city;

	console.log(a);
		var o={
			p_name:a,Address:e,city:f
	};
	var p={
		oname:a,password:b
	}
	connection.query('insert into ownerreg set ?',p,function(err,result){
console.log(result);
console.log(result+"success");
	})
connection.query('insert into person set ?',o, function (err, result) {
	if(err)
		throw err;
  console.error(result);
  res.sendFile(__dirname +'/public/ownerlogin.html');
  
});

})

app.listen(3000);
console.log("Express server listening on port 3000 ");