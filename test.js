const express = require('express');
const app = express();

app.get('/', (req,res)=>{
    res.send('Hello woorld');
});

app.get('/api/courses',(req,res)=>{
    res.send([1,2,3]);
    console.log(api.name);
});

app.listen(3000,()=>console.log('listening to 3000'));


