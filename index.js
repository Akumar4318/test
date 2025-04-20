const {Client}=require('pg')
const express=require('express');
const app=express();

app.use(express.json())


const connection = new Client({
    host: "dpg-d02ea4ruibrs73aptng0-a.oregon-postgres.render.com",
    user: "postgresroot",
    port: 5432,
    password: "FV0JXyZJbWR13lKbqOgjV0GI4TG7papi",
    database: "user_vhzm",
    ssl: {
      rejectUnauthorized: false,
    }
  });
  
  connection.connect()
    .then(() => {
      console.log("db connected");
    })
    .catch((err) => {
      console.error("connection error", err.stack);
    });

// connection.query('Select * from userstable',(err,res)=>{

//     if(!err){
//         console.log(res.rows)
//     }
//     else{
//         console.log(err.message)
//     }

//     connection.end;
// })

app.listen(3000,(req,res)=>{

   console.log('server is created at port 3000')
})

app.get('/',(req,res)=>{

    res.status(200).json({
        success:true,
        message:"Your server is created"
    })
})

app.post('/postdata',(req,res)=>{

    const {name,id}=req.body;

    const insert_query='INSERT INTO userstable (name,id) VALUES ($1,$2)'

    connection.query(insert_query,[name,id],(err,result)=>{

        if(err){
            console.log(err.message)
        }
        else{
            console.log(result)
            res.send("data posted")
        }
    })
})

// fetch all data from db

app.get('/fetchdata',(req,res)=>{

    const fetch_query=  'SELECT * FROM userstable'

    connection.query(fetch_query,(err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result.rows)
        }
    })
})
// fetch data by id

app.get('/fetchbyid/:id',(req,res)=>{

    const id=parseInt(req.params.id);
    const fetch_query="SELECT * FROM userstable WHERE  id=$1";

    connection.query(fetch_query,[id],(err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send(result.rows[0])
        }
    })
})


// update data by id

app.put('/update/:id',(req,res)=>{

    const id=req.params.id;
    const name=req.body.name;

    const update_query="UPDATE userstable SET name=$1 WHERE id=$2 "

    connection.query(update_query,[name,id],(err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send("updated")
        }
    })
})

// delete data by id

app.delete('/delete/:id',(req,res)=>{
    const id=req.params.id;

    const delete_query='DELETE FROM userstable WHERE id=$1';

    connection.query(delete_query,[id],(err,result)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send("deleted")
        }
    })
})

app.post('/postlist',async (req,res)=>{

    const dataList=req.body;

    try {
        
        for(let item of dataList){
            const {name,id}=item;
          let result=  await connection.query('INSERT INTO userstable (name,id) VALUES ($1,$2)',[name,id])
        }
        // res.status(200).json({
        //     success:true,
        //     message:result
        // })

        res.send("posted")
    } catch (error) {
        console.log(error.message)
    }
})



