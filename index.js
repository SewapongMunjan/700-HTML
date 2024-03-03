// 1. GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
// 2. POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
// 3. GET /users/:id สำหรับการดึง users รายคนออกมา
// 4. PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
// 5. DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const mysql = require('mysql2/promise');

app.use(bodyParser.json());

let users = [];
let counter = 1;
let conn = null


const initMySQL = async () => {
  conn = await mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'webdb',
    port: 8700
  })
}


app.get('/testdb-new', async (req, res) => {
  try{
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0]);

  }catch (error) {
    console.error('Error fetching users:', error.message)
    res.status(500).json({error:'Error fetching users'})
  }
})


app.get("/", (req, res) => {
  let user = {
    firstname: "John",
    lastname: "Doe",
    age: 25,
  }

  res.json(user);
});


// 1. GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get("/users", (req, res) => {
    const filterUsers = users.map(user => {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname, 
            fullname: user.firstname + ' ' + user.lastname
        }
    })
  res.json(filterUsers);
});



// 2. POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post("/users", (req, res) => {
  let user = req.body;
  user.id = counter;
  counter++;
  users.push(user);
  res.json({
    message: "Add new user successfully",
    user: user
  });
  res.send(req.body);
});



// 3. GET /users/:id สำหรับการดึง users รายคนออกมา
app.get("/users/:id", (req, res) => {
    let id = req.params.id;
    //find index
    let selectIndex = users.findIndex(user => user.id == id)
  res.json(users[selectIndex]);
});



// 4. PUT /user/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put("/users/:id", (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;
  // 1. หา users จาก id ที่ส่งมา
  let selectIndex = users.findIndex(user => user.id == id);

  // Update ข้อมูล user
    users[selectIndex].firstname = updateUser.firstname || users[selectIndex].firstname;
    users[selectIndex].lastname = updateUser.lastname || users[selectIndex].lastname;
    users[selectIndex].age = updateUser.age || users[selectIndex].age;
    users[selectIndex].gender = updateUser.gender || users[selectIndex].gender;
    
    // 2. Update users นั้น
  // users[selectIndex].firstname = updateUser.firstname || users[selectIndex].firstname;
  // users[selectIndex].lastname = updateUser.lastname || users[selectIndex].lastname;
  res.json({
    message: 'Update user succussfully',
    data: {
      user: updateUser,
      indexUpdate: selectIndex
    }
    // 3. users ที่ Update ใหม่ ทำการ Update กลับเข้าไปที่ users ตัวเดิม
  });

});



// 5. DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete("/users/:id", (req, res) => {
  let id = req.params.id;
  // 1. หาข้อมูล User จาก index
  let selectIndex = users.findIndex(user => user.id == id);
  // 2. ลบข้อมูล User
  // delete users[selectIndex]; ลบแบบนี้จะมีค่า Null ทิ้งไว้
  users.splice(selectIndex,1); // ลบแบบนี้จะไม่ทิ้งค่า Null ไว้ (ดีกว่า)
  res.json({
    message: 'Delete user succussfully',
    data: {
      indexUpdate: selectIndex
    }
  });
});

app.listen(port, async (req, res) => {
  await initMySQL()
  console.log(`Server is running on port ${port}.`);
});
