const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const ejs = require('ejs');



var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password    : '',
    database    : 'rest_node',
    multipleStatements:true
});

connection.connect(function(err){
    if (err) throw err
    console.log('You are now connected')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.set('view engine','ejs');
app.get('/employee',(req,res)=>{
    console.log(req);
    connection.query("SELECT id, name, address, phone_no, position, salary, DATE_FORMAT(date_of_joining,'%Y-%m-%d') as date FROM employee_info",function(error,results,fields){
        if (error) throw error;
      
        var employeeid_info=[{'name':'','address':'','phone_no':'','position':'','salary':'','date_of_joining':''}];
        res.render('pages/index.ejs',{employeeid_info,employee_info:results});
    });
});
//create employee details using x-www-form-urlencoded
app.post('/employee',function(req,res){
    var postData = req.body.employee_form_data;
    console.log(postData);
    connection.query('INSERT INTO employee_info SET ?',[postData],function(error,results,fields){
        if (error) {
        console.log(error);
        res.status(500).send('Internal Error');
    }

    res.status(200).send(JSON.stringify(results));
    
    });
});


//create server
const server = app.listen(3000,"127.0.0.1",function(){
    var host = server.address().address
    var port = server.address().port
    
    console.log("Post listening at http:://%s:%s",host,port)
});



//rest api to get all results
app.get('/employees',function(req,res){
    console.log(req);
    connection.query('select * from employee_info',function(error,results,fields){
        if (error) throw error;
        res.render('pages/employee_details',{employee_info:results});
    });
});

app.all('/attendance',function(req,res){


    if(req.method==='GET'){
        
        connection.query('SELECT * from employee_info',function(error,results,fields){
            if (error) throw error;
            //res.status(200).send(JSON.stringify(results));
            res.render('pages/attendance',{employee_name:results});
        });
    }
    if(req.method==='POST'){
        var postData = req.body.employee_attendance_data;
    console.log(postData);
    connection.query('INSERT INTO `attendance`(`e_id`, `name`, `date`, `attendance`, `OT`, `OSV`) VALUES ?',[postData],function(error,results,fields){
        if (error) {
        console.log(error);
        res.status(500).send('Internal Error');
    }
    else
    {

    res.status(200).send(JSON.stringify(results));
    }
    
    });
    }
});

app.post('/attendanceedit',function(req,res)
{
    var getdate= req.body.employee_attendance_data[0][2];

    var postData = req.body.employee_attendance_data;
    console.log(postData);
    connection.query('DELETE from attendance where date=?; INSERT INTO `attendance`(`e_id`, `name`, `date`, `attendance`, `OT`, `OSV`) VALUES ?',[getdate,postData],function(error,results,fields){
        if (error) {
        console.log(error);
        res.status(500).send('Internal Error');
    }
    else
    {

    res.status(200).send(JSON.stringify(results));
    }
    
    });
})

app.get('/searchattendance',function(req,res){
    console.log(req);
 
        res.render('pages/search_attendance',{datalist:'no'});

});


app.post('/searchattendance',function(req,res){
    var postData = req.body.date;
    console.log(postData);
    connection.query("SELECT id, e_id,name,DATE_FORMAT(date,'%Y-%m-%d') as date,attendance,OT,OSV FROM attendance where date=?",[postData],function(error,results){
        if(results.length>0){
            console.log(results);
         res.render('pages/search_attendance',{datalist:'yes',employee_attendance_data:results});
   
        }else{
            res.render('pages/search_attendance',{datalist:'no'});

        }
   

        
    });
 
       
});



app.all('/attendance',function(req,res){


    if(req.method==='GET'){
        
        connection.query('SELECT * from employee_info',function(error,results,fields){
            if (error) throw error;
            //res.status(200).send(JSON.stringify(results));
            res.render('pages/attendance',{employee_name:results});
        });
    }
    if(req.method==='POST'){
        var postData = req.body.employee_attendance_data;
    console.log(postData);
    connection.query('INSERT INTO `attendance`(`e_id`, `name`, `date`, `attendance`, `OT`, `OSV`) VALUES ?',[postData],function(error,results,fields){
        if (error) {
        console.log(error);
        res.status(500).send('Internal Error');
    }
    else
    {

    res.status(200).send(JSON.stringify(results));
    }
    
    });
    }
});




app.post('/attendance_date',function(req,res){
    var postData = req.body;
    console.log(postData);
    connection.query('INSERT INTO days_of_attendance SET ?',[postData],function(error,results,fields){
        if (error){
            console.log(error);
            res.status(500).send('Internal Error');
        }
        res.status(200).send(JSON.stringify(results));
    });
});

app.get('/count_attendance',function(req,res){
    console.log(req);
    connection.query('SELECT e_id, name, sum(attendance) as present_days, SUM(OT) as Total_OT, SUM(OSV) as Total_osv FROM `attendance` GROUP BY e_id',function(error,results,fields){
        if (error) throw error;
        res.render('pages/count_attendance.ejs',{employee_info:results});
    });
});

app.post('/update_employee',function(req,res){
    var user_id= req.body.id;
    console.log(user_id);
    connection.query('select * from employee_info where id=?; select * from employee_info';UPDATE `employee_info` SET `id`=[value-1],`name`=[value-2],`address`=[value-3],`phone_no`=[value-4],`position`=[value-5],`salary`=[value-6],`date_of_joining`=[value-7] WHERE,[user_id],function(error,results,fields){
        if (error) throw error;
        console.log(results[0]);
        res.render('pages/index.ejs',{employeeid_info:results[0],employee_info:results[1]});
    });
});
app.post('/update_post',function(req,res){
    var user_id= req.body.id;
    console.log(user_id);
    connection.query('select * from position where id=?; select * from position',[user_id],function(error,results,fields){
        if (error) throw error;
        console.log(results[0]);
        res.render('pages/empposition.ejs',{employeeid_info:results[0],employee_info:results[1]});
    });
});


app.all('/empposition',function(req,res){


    if(req.method==='GET'){
        
        connection.query('SELECT * from position',function(error,results,fields){
            if (error) throw error;
            //res.status(200).send(JSON.stringify(results));
            res.render('pages/empposition.ejs',{employee_name:results});
        });
    }
    if(req.method==='POST'){
        var postData = req.body.position_form_data;
    console.log(postData);
    connection.query('INSERT INTO `position` (`Position`, `salary`, `OverTimeRate`, `OSVR`) VALUES  ?',[[postData]],function(error,results,fields){
        if (error) {
        console.log(error);
        res.status(500).send('Internal Error');
    }
    else
    {

    res.status(200).send(JSON.stringify(results));
    }
    
    });
    }
});

app.post('/employeeedit',function(req,res)
{
    var getdate= req.body.employee_attendance_data[0][2];

    var postData = req.body.employee_attendance_data;
    console.log(postData);
    connection.query('DELETE from attendance where date=?; INSERT INTO `attendance`(`e_id`, `name`, `date`, `attendance`, `OT`, `OSV`) VALUES ?',[getdate,postData],function(error,results,fields){
        if (error) {
        console.log(error);
        res.status(500).send('Internal Error');
    }
    else
    {

    res.status(200).send(JSON.stringify(results));
    }
    
    });
});


app.all('/calculatesalary',function(req,res){
    if(req.method==='get'){
        connection.query('SELECT ei.name,p.Position,p.salary,p.OverTimeRate,p.OSVR,at.attendance,at.OT,at.OSV,concat(p.salary*at.attendance+p.OverTimeRate*at.OT+p.OSVR*at.OSV) AS salarys from employee_info as ei,attendance as at,position as p WHERE ei.id=at.e_id and ei.position = p.Position group by ei.name',function(error,results,fields){
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
    }
    if(req.method==='post'){

    }
});
















// app.get('/employees/:id',function(req,res){
//     connection.query('select * from employee where id=?',[req.params.id],function(error,results,fields){
//         if (error) 
//         console.log(error);
     
//         res.render('page/index',{results:results})
        
//     });
// });

app.post('/empform', function (req, res) {
    var postData  = req.body;
   connection.query('INSERT INTO employee SET ?', postData, function (error, results, fields) {
       if (error) throw error;
       res.render('pages/index');
	});
});




//rest api to create a new record into mysql database
// app.post('/employees', function (req, res) {
//     var postData  = req.body;
//    connection.query('INSERT INTO employee SET ?', postData, function (error, results, fields) {
//        if (error) throw error;
//        res.end(JSON.stringify(results));
// 	});
// });




const http = require("http");

app.get('/employee/salary',function(req,res){
    var sal1=10000;
    var sal2=11000000000;
    connection.query('select * from employee where employee_salary between ? and ?',
    [sal1,sal2],function(error,results){
        if (error) 
        {
        console.log(error);
        }
        console.log(results);
        
        res.render('pages/index',{results:results})
        
    });
});