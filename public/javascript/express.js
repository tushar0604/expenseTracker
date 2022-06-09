const premium = document.getElementById('premium')
const close = Array.from(document.getElementsByClassName('close'))
const one = document.getElementById('one')
const two = document.getElementById('two')
const buy_now = document.getElementById('buy-now')

premium.addEventListener('click', async ()=>{
    await axios.get('http://localhost:3000/main/premium',{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
    .then(response =>{
        // console.log('This is the response',response)
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

// function add(object){
//     let li = document.createElement('li');
//     li.className = 'list';
//     li.appendChild(document.createTextNode(`${object.amount}-${object.category}-${object.descrip}`));
//     var del = document.createElement('button');
//     del.id='del';
//     del.className=object._id;
//     del.appendChild(document.createTextNode('delete'));
//     li.appendChild(del);
//     let edit = document.createElement('button');
//     edit.id='edit';
//     edit.className=object._id;
//     edit.appendChild(document.createTextNode('Edit'));
//     li.appendChild(edit);
//     ul.appendChild(li);
//     del.addEventListener('click',remove);
//     edit.addEventListener('click',edited);
// }

// async function remove(e){
//     try{
//     if (confirm('are you sure?')){
//         let del_id = e.target.className;
//         ul.removeChild(e.target.parentElement);
//         await axios.delete('http://localhost:3000/main/delete/'+del_id,)
//     }
//     }catch(err){console.log(err)}
// }

// async function edited(e){
//     try{
//     let up_id = e.target.className;
//     let rep = await axios.get('http://localhost:3000/main/edit/'+up_id,)
//     document.getElementById('expense').value=rep.data.amount;
//     document.getElementById('categories').value=rep.data.category;
//     document.getElementById('describe').value=rep.data.descrip;
//     localStorage.setItem('id',up_id);
//     }catch(err){
//         console.log(err);
//     }
// }

// window.addEventListener('load', retrive());
// async function retrive(){
//     try{
//     let ret = await axios.get('https://crudcrud.com/api/d3d91cbf22a24d2f88ea1c83c63758cc/tracker/')
//         for (let i of ret.data){
//             add(i);
//         }
//     }catch(err){
//         console.log(err);
//     }
// }

// var s = document.getElementById('update');
// s.addEventListener('click', async (e)=>{
//     try{
//     e.preventDefault();
//     let ex =document.getElementById('expense').value;
//     let ca =document.getElementById('categories').value;
//     let des =document.getElementById('describe').value;
//     let updated ={
//         amount:ex,
//         category:ca,
//         descrip:des
//     }
//     let id = localStorage.getItem('id')
//     edit1 = document.getElementsByClassName(id)
//     edit1[1].parentElement.parentElement
//     .removeChild(edit1[1].parentElement);
//     await axios.delete('https://crudcrud.com/api/d3d91cbf22a24d2f88ea1c83c63758cc/tracker/'+id,)
//     let new_post = await axios.post('https://crudcrud.com/api/d3d91cbf22a24d2f88ea1c83c63758cc/tracker/',updated)
//     add(new_post.data)
//     }catch(err){
//         console.log(err)
//     }
// })