const form = document.getElementById('form')

form.addEventListener('submit',handleSubmit)

async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const email = data.get('email');
    const password = data.get('password')
    let obj = {
        'email':email,
        'password':password
    }
    await axios.post('http://localhost:3000/logged-in',obj)
    .then(response => {
        sessionStorage.setItem('token', response.data.token);
        window.location.href = response.data.redirect;
    })
    .catch(err =>{console.log(err)})
  }



