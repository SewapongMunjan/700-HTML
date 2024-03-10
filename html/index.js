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

const submitData = async() => {
    let firstNameDOM = document.querySelector('input[name=firstname]')
    let lastNameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')
    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked') || {}
    let descriptionDOM = document.querySelector('textarea[name=description]')

    let messageDOM = document.getElementById('message')
    
    try{   
let interest = ''
for (let i = 0;i < interestDOMs.length; i++){
    interest+= interestDOMs[i].value
    if (i < interestDOMs.length -1) {
        interest += ','
    }
}
    console.log('test')
    let userData = {
        firstname: firstNameDOM.value,
        lastname: lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        description: descriptionDOM.value,
        interests: interest
    }
    console.log('submitData', userData)

        const errors = validateData (userData)
        if (errors.length > 0){
            //สิ่งที่ต้องทำ 
            //1. มี error เกิดขึ้น
            throw{
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            }
        }

        const response = await axios.post('http://localhost:8000/users' , userData)
        console.log('response', response.data);
        messageDOM.innerText = 'บันทึกข้อมูลเสร็จสิ้น'
        messageDOM.className = 'message success'
    }catch(error){
        console.log('error message', error.message)
        console.log('error',error.errors)
        // if (error.response)
        // {console.log(error.response.data.message)}
    
        let  htmlData = '<div>'
    htmlData += `</div>  ${error.message}  </div>`
    htmlData += '<ul>'  
    for (let i = 0; i < error.errors.length ; i++){
        htmlData += `<li> ${error.errors[i]} </li>`
    }
    htmlData += '</ul>'
    htmlData += '</div>'

        messageDOM.innerHTML = htmlData
        messageDOM.className = 'message danger'
    }
}