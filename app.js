console.log( "Hi there")

fetch('http://bagel-api-fis.herokuapp.com/bagels')
    .then(response => response.json())
    .then(result => handleBagels(result))

function handleBagels (bagels) {
    return bagels.forEach(bagel => renderBagel(bagel.type, bagel.id))
}

const bagelsList = document.getElementById('bagel-ul')

function renderBagel (bagel, id) {
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
    fetch (`http://bagel-api-fis.herokuapp.com/bagels/${id}`,
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
    renderBagel(updatedBagel)
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
    renderBagel(newBagel)
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


