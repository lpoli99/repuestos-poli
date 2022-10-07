const btnSwitch = document.querySelector('#switch');
const tbody = document.querySelector('.tbody');
let cart = [];
const spareParts = [];

class part{
    constructor (imagen, titulo, descripcion, precio) {
        this.imagen = imagen;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
    }
};

//CREACION DE OBJETOS
const neumatico1 = new part("../media/bridgestone.jpg", "Neumatico Bridgestone", "175/70 R14, A/T", "$10000");
const neumatico2 = new part("../media/pirelli.jpg", "Neumatico Pirelli", "170/65 R13 Ruta", "$8000");
const amortiguador1 = new part("../media/amortiguador-delantero-derecho-chevrolet-spark-ii.jpg", "Amortiguador Corven", "Para Renault Kangoo 2007 a 2013", "$7000");
const refrigerante1 = new part("../media/total-rosa.jpg", "Refrigerante Total", "Color Rosa, tipo A", "$2000");
const refrigerante2 = new part("../media/tir-amarillo.jpg", "Refrigerante TIR", "Color Amarillo, tipo A", "$1500");
const aceite1 = new part("../media/gulf.png", "Aceite Gulf", "10W-40, tamaño 4L", "$6000");

//PUSH DE OBJETOS A RESPECTIVOS ARRAYS
spareParts.push(neumatico1, neumatico2, amortiguador1, refrigerante1, refrigerante2, aceite1);

// JSON DE TODOS LOS REPUESTOS 
const sparepartsJson = JSON.stringify(spareParts);

//MOSTRAR LOS REPUESTOS EN EL HTML
function showSpareparts(spareParts){
    const sparePartscontainer = document.getElementById("cntCards");
    sparePartscontainer.innerHTML = "";
    spareParts.forEach(part =>{
        const divRepuesto = document.createElement("div");
        divRepuesto.classList.add("card");
        divRepuesto.setAttribute("style", "width: 18rem;");
        divRepuesto.innerHTML= `
        <img src="${part.imagen}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${part.titulo}</h5>
            <p class="card-text">${part.descripcion}</p>
            <h5 class="text-primary">Precio:<span class="price">${part.precio}</span></h5>
            <button class="btn btn-primary add">Añadir al carrito</button>
        </div>
        `;
        sparePartscontainer.appendChild(divRepuesto);
    })
} 
showSpareparts(spareParts);

// CARRITO DE COMPRAS 
const addCart = document.querySelectorAll('.add');
addCart.forEach(btn =>{
    btn.addEventListener('click', addToCart);  
});

//Capturar item para añadir al carrito 

function addToCart(e){
    const button = e.target;
    const item = button.closest('.card');
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.price').textContent;
    const newItem = {
        title: itemTitle,
        price: itemPrice,
        quantity: 1
    }
    
    addItemCart(newItem);
    Toastify({
        text: "Item añadido al carrito!",
        duration: 1800,
        gravity: "top",
        position: "left"
    }).showToast();
};

//Cantidad de items y render del carrito

function addItemCart(newItem){
    const inputElement = tbody.getElementsByClassName('inputElement');
    for(let i = 0; i < cart.length; i++){
        if(cart[i].title.trim() === newItem.title.trim()){
            cart[i].quantity++;
            const inputValue = inputElement[i];
            inputValue.value++;
            cartTotal();
            return null;
        }
    }
    cart.push(newItem);
    renderCart();
};

//Creacion de item en el carrito

function renderCart(){
    tbody.innerHTML = '';
    cart.map(item => {
        const tr = document.createElement('tr');
        tr.classList.add('itemCart');
        const Content = `
        <th scope="row">1</th>
        <td class="tableProducts">
          <h6 class="title">${item.title}</h6>
        </td>
        <td class="tablePrice">
          <p>${item.price}</p>
        </td>
        <td class="tableQuantity">
          <input type="number" min="1" value=${item.quantity} class="inputElement">
          <button class="delete btn btn-danger">X</button>
        </td>
        `;
        tr.innerHTML = Content;
        tbody.append(tr);

        tr.querySelector(".delete").addEventListener('click', removeItemCart);
        tr.querySelector(".inputElement").addEventListener('change', addQuantity);
    })
    cartTotal();
};

//Suma del total del carrito

function cartTotal(){
    let total = 0;
    const itemCartTotal = document.querySelector('.cartTotal');
    cart.forEach((item) => {
        const price = Number(item.price.replace("$", ''));
        total = total + price*item.quantity;
    })

    itemCartTotal.innerHTML = `Total $${total}`;
    addLocalStorage();
};

//Remover item del carrito

function removeItemCart(e){
    const buttonDelete = e.target;
    const tr = buttonDelete.closest(".itemCart");
    const title = tr.querySelector('.title').textContent;
    for(let i = 0; i< cart.length ; i++){
        if(cart[i].title.trim() === title.trim()){
            cart.splice(i, 1)
        }
    }
    tr.remove();
    cartTotal();
    Toastify({
        text: "Item eliminado del carrito!",
        duration: 1800,
        gravity: "top",
        position: "left"
    }).showToast();
};

//Añadir o quitar cantidad de item en carrito por imput

function addQuantity(e){
    const addInput = e.target;
    const tr = addInput.closest(".itemCart");
    const Title = tr.querySelector('.title').textContent;
    cart.forEach(item =>{
        if(item.title.trim() === Title){
            addInput.value < 1 ? (addInput.value = 1) : addInput.value;
            item.quantity = addInput.value;
            cartTotal();
        }
    })
    console.log(cart);
};

//Guardar carrito en local storage

function addLocalStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
};

window.onload = function(){
    const storage = JSON.parse(localStorage.getItem('cart'));
    if(storage){
        cart = storage;
        renderCart();
    }
};

// MODO OSCURO 
btnSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    btnSwitch.classList.toggle('active');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('modo-oscuro', 'true');
    }else {
        localStorage.setItem('modo-oscuro', 'false');
    }
});

if(localStorage.getItem('modo-oscuro') === 'true'){
    document.body.classList.add('dark');
     btnSwitch.classList.add('active');
}else {
    document.body.classList.remove('dark');
    btnSwitch.classList.remove('active');
};




  

  




