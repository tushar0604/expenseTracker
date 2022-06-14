const daily = document.getElementById('daily')
const table = document.getElementById('table')
const download = document.getElementById('download')
const view = document.getElementById('view')
const page = document.querySelectorAll('.page')

view.addEventListener('change', (e)=>{
    localStorage.setItem('view', view.value)
})

function createTable(response){
    console.log(response)
    response.data.list.forEach(element => {
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
}

view.value = localStorage.getItem('view')

async function record(no){
    await axios.get(`http://localhost:3000/main/daily?view=${view.value}&page=${no}`,{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
    .then(result => {
        createTable(result)
    })
    .catch(err => console.log(err))
}

window.addEventListener('load', record(1))

// daily.addEventListener('click', record())

download.addEventListener('click', async (e)=>{
    e.preventDefault()
    await axios.get('http://localhost:3000/main/download',{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    }).then(response => {
        if (response.status===200){
            console.log(response.data.fileurl)
            window.location.href = response.data.fileurl
        }
    })
})

page.forEach(page =>{
    page.addEventListener('click', (e)=>{
        record(page.innerHTML)
    })
})