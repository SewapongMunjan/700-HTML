// 1. GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
// 2. POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
// 3. GET /users/:id สำหรับการดึง users รายคนออกมา
// 4. PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
// 5. DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const mysql = require('mysql2/promise');

app.use(bodyParser.json());
app.use(cors());

let users = [];
let counter = 1;
let conn = null

const validateData = (userData) => {
  let errors = []
  if (!userData.firstname){
      errors.push('กรุณากรอกชื่อ')
  }
  if (!userData.lastname){
      errors.push('กรุณากรอกนามสกุล')
  }

  if (!userData.age){
      errors.push('กรุณากรอกอายุ')
  }

  if (!userData.gender){
      errors.push('กรุณากรอกเพศ')
  }

  if (!userData.interests){
      errors.push('กรุณากรอกความสนใจ')
  }
  
  return errors
}


const initMySQL = async () => {
  conn = await mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'webdb',
    port: 8700
  })
}


// app.get('/testdb-new', async (req, res) => {
//   try{
//     const results = await conn.query('SELECT * FROM users')
//     res.json(results[0]);

//   }catch (error) {
//     console.error('Error fetching users:', error.message)
//     res.status(500).json({error:'Error fetching users'})
//   }
// })


app.get("/", (req, res) => {
  let user = {
    firstname: "John",
    lastname: "Doe",
    age: 25,
  }

  res.json(user);
});


// 1. GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get("/users", async (req, res) => {
  try{
  const results = await conn.query('SELECT * FROM users')
  res.json(results[0]);

  }catch(error){
    console.log('errorMessage',error.message)
  res.status(500).json({
    message:'ERROR fetching users'})
}
})

  


// 2. POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post("/users", async (req, res) => {
  try{
  let user = req.body;
  const errors = validateData(user)
  if(errors.length > 0){
    throw {
      message:'กรอกข้อมูลไม่ครบ',
      errors: errors
    }
  }
  const results = await conn.query('INSERT INTO users SET ?',user)
  res.json({
    message: 'Create new user successfully',
    data:results[0]
  })
}catch(error){
  const errorMessage = error.errors || 'Something went wrong'
  const errors = error.errors || []
  console.log('errorMessage',error.message)
  res.status(500).json({
    message:errorMessage,
    errors: errors
  })
}
})



// 3. GET /users/:id สำหรับการดึง users รายคนออกมา
app.get("/users/:id", async (req, res) => {
  try {
    let id = req.params.id
  const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
   
  if(results[0].length == 0){
    throw { statusCode: 404, message: 'user not found'}
    }
      res.json(results[0][0])
  }catch(error){
    console.log('errorMessage', error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
});



// 4. PUT /user/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put("/users/:id", async (req, res) => {
  
  try{
    let updateUser = req.body;
    let id = req.params.id;
    const results = await conn.query('UPDATE users SET ? WHERE id = ?',[updateUser, id])
    res.json({
      message: 'Update user successfully',
      data:results[0]
    })
  }catch(error){
    console.log('errorMessage',error.message)
    res.status(500).json({
      message:'Someting went wrong'})
  }
  // // Update ข้อมูล user
  //   users[selectIndex].firstname = updateUser.firstname || users[selectIndex].firstname;
  //   users[selectIndex].lastname = updateUser.lastname || users[selectIndex].lastname;
  //   users[selectIndex].age = updateUser.age || users[selectIndex].age;
  //   users[selectIndex].gender = updateUser.gender || users[selectIndex].gender;
    
    // 2. Update users นั้น
  // users[selectIndex].firstname = updateUser.firstname || users[selectIndex].firstname;
  // users[selectIndex].lastname = updateUser.lastname || users[selectIndex].lastname;

    // 3. users ที่ Update ใหม่ ทำการ Update กลับเข้าไปที่ users ตัวเดิม
});


// 5. DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete("/users/:id", async (req, res) => {
  try{
    let id = req.params.id;
    const results = await conn.query('DELETE FROM users WHERE id = ?',id)
    res.json({
      message: 'Delete user succussfully',
      data: results[0]
    })
  }catch{
      console.log('errorMessage',error.message)
      res.status(500).json({
        message:'Someting went wrong'})
  }
  // 1. หาข้อมูล User จาก index
  // 2. ลบข้อมูล User
  // delete users[selectIndex]; ลบแบบนี้จะมีค่า Null ทิ้งไว้
 // ลบแบบนี้จะไม่ทิ้งค่า Null ไว้ (ดีกว่า)

});

app.listen(port, async (req, res) => {
  await initMySQL()
  console.log(`Server is running on port ${port}.`);
});
