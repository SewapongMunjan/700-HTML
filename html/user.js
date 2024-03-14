
const BASE_URL = 'http://localhost:8000'
// 2 นำ user ที่โหลดมาได้ ใส่กลับเข้าไปใน html
window.onload = async () => {
    console.log('on load')
    // 1 โหลด user ทั้งหมดขึ้นมาจาก api 
    const respone = await axios.get(`${BASE_URL}/users`)
    console.log(respone)
} 