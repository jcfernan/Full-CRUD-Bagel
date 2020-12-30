console.log( "Hi there")

var myHeaders = new Headers();
myHeaders.append("x-ebirdapitoken", "cn9j4ts7dra2");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://api.ebird.org/v2/data/obs/geo/recent?lat=39.7002&lng=-104.9640", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .then(result => handleBirds(result))
  .catch(error => console.log('error', error));

function handleBirds (birds) {
    return birds.forEach(bird => renderBird(comName, howMany))
}

const bagelsList = document.getElementById('bagel-ul')

function renderBird (bagel, id) {
    const li = document.createElement('li')
    li.innerText = bagel
    li.id = id
    createUpdateButton(li)
    createDeleteButton(li)
    bagelsList.append(li)
}

function createDeleteButton(li) {
    const deleteButton = document.createElement('button')
    deleteButton.innerText= 'x'
    li.append(deleteButton)
    deleteButton.addEventListener('click', (event) => 
    bagelDelete(event, event.target.parentNode.id))

}

function bagelDelete(event, id){
    fetch (`http://bagel-api-fis.herokuapp.com/birds/${id}`,
    {
        method: 'DELETE'
    })
    event.target.parentNode.remove()
}

function createUpdateButton(li){
    const updateButton = document.createElement('button')
    updateButton.innerText= 'update'
    updateButton.addEventListener('click', (event)=> bagelUpdate(event))
    li.append(updateButton)
}

function bagelUpdate(event){
    event.target.parentNode.innerHTML = `
    <form id= "update-form">
        <input type='text' value='${event.target.parentNode.innerText.slice(0, -6)}'/>
    </form>
    `
    const updateForm = document.getElementById('update-form')
        updateForm.addEventListener('submit', (event)=> handleUpdateForm(event))
}

function handleUpdateForm(event){
    event.preventDefault()
    const updatedBagel = event.target.children[0].value
    renderBird(updatedBagel)
    persistBagelUpdate(event.target.parentNode.id, updatedBagel)
    event.target.parentNode.remove()
}

function persistBagelUpdate(id, bagel){
    fetch(`http://bagel-api-fis.herokuapp.com/bagels/${id}`,{
        method: 'PUT',
        headers: {'Accept':"application/json",
        'Content-Type': 'application/json'},
        body: JSON.stringify({type: bagel})
    })
}

const bagelForm = document.getElementById('bagel-form')


bagelForm.addEventListener('submit', (event) => captureFormInput(event))

function captureFormInput(event) {
    event.preventDefault()
    const formData = new FormData(bagelForm)
    const newBagel = formData.get('bagel')
    renderBird(newBagel)
    persistBagel(newBagel)
}

function persistBagel(bagel){
    fetch('http://bagel-api-fis.herokuapp.com/bagels',{
        method: 'POST',
        headers: {'Accept':"application/json",
        'Content-Type': 'application/json'},
        body: JSON.stringify({type: bagel})
    })
}


