const ol = document.getElementById('order-list')

window.addEventListener('load', async (e)=>{
    e.preventDefault()
    await axios.get('http://localhost:3000/main/leaderboard')
    .then(response =>{
        // console.log(response)
        const list = response.data
        list.sort(function(a, b){return b.exp-a.exp});
        console.log(list)
        list.forEach(user => {
            const par1 = document.createElement('li')
            const par1_child1 = document.createElement('mark')
            par1_child1.innerHTML = user.name
            const par1_child2 = document.createElement('small')
            par1_child2.innerHTML = user.exp
            par1.appendChild(par1_child1)
            par1.appendChild(par1_child2)
            ol.appendChild(par1)
        });
    })

})