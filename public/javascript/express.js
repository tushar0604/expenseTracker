const premium = document.getElementById('premium')
const close = Array.from(document.getElementsByClassName('close'))
const one = document.getElementById('one')
const two = document.getElementById('two')
const buy_now = document.getElementById('buy-now')
const signout = document.getElementById('sign-out')

premium.addEventListener('click', async ()=>{
    await axios.get('http://localhost:3000/main/premium',{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
    .then(response =>{
        console.log('This is the response',response)
        if (response.data){
            console.log(close)
            two.classList.add('active')
        }else{
            one.classList.add('active')
        }
    })
})

close.forEach(button =>{
    button.addEventListener('click',(e)=>{
        console.log(e.target.parentElement)
        const active = e.target.parentElement.parentElement
        active.classList.remove('active')
    })
})

buy_now.addEventListener('click', async ()=>{
    await axios.post('http://localhost:3000/main/buy-membership',{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
    .then(response =>{
        console.log(response)
        sessionStorage.setItem('order_id', response.data.id)
        window.location.href = '/main/order' 
    })
})


/* **************************************************************** */
// const ul =document.getElementById('unorder');
const sub = document.getElementById('submit');

sub.addEventListener('click', async (e)=>{
    try{
    e.preventDefault();
    let exp = document.getElementById('expense').value;
    let cat = document.getElementById('categories').value;
    let des = document.getElementById('describe').value;
    let obj = {
        amount:exp,
        category:cat,
        descrip:des
    }
    // console.log(obj)
    await axios.post('http://localhost:3000/main/tracker/addexpense',obj,{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
    .then(response =>{console.log('Success')})
    // add(a.data)
    }catch(err){
        console.log(err);
    }
})

signout.addEventListener('click', ()=>{
    sessionStorage.removeItem('token')
    window.location.href = '/sign-in'
})