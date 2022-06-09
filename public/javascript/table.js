const daily = document.getElementById('daily')
const table = document.getElementById('table')

daily.addEventListener('click', async (e)=>{
    e.preventDefault()
    await axios.get('http://localhost:3000/main/daily',{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
    .then(response => {
        console.log(response)
        response.data.forEach(element => {
            let tr = document.createElement('tr')
            let td1 = document.createElement('td')
            td1.setAttribute('data-th','Date')
            td1.innerHTML = element.createdAt
            let td2 = document.createElement('td')
            td2.setAttribute('data-th','Description')
            td2.innerHTML = element.description
            let td3 = document.createElement('td')
            td3.setAttribute('data-th','Category')
            td3.innerHTML = element.category
            let td4 = document.createElement('td')
            td4.setAttribute('data-th','Amount')
            td4.innerHTML = element.expense
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            table.appendChild(tr)
        });
    })
})