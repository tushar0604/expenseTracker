const form2 = document.getElementById('forgot-pass')
const form_image = document.getElementById('form-image')

form2.addEventListener('submit',retrive)

async function retrive(event) {
    let id
    event.preventDefault();
    const data = new FormData(event.target);
    const email = data.get('email');
    let obj = {
        'email':email,
    }
    await axios.post('http://localhost:3000/password/resetpassword',obj)
    .then(response =>{
        id = response.data.id
    })
    await axios.get(`http://localhost:3000/password/resetpassword/${id}`)
    .then(response =>{
        const placeholder = document.createElement("div");
        placeholder.insertAdjacentHTML("afterbegin", response.data);
        const node = placeholder.firstElementChild;
        form_image.replaceChild(node,form2)
        console.log(response.data)
        const form = document.getElementById('form')
        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            const data = new FormData(e.target);
            const password = data.get('password');
            let obj = {
                email:email,
                password:password,
            }
            axios.post(`http://localhost:3000/password/resetpassword/?id=${id}`,obj)
            .then(response => {
                window.location.href = response.data.redirect;
            })
        })
    })
}