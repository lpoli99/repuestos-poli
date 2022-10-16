const sparePartscontainer = document.getElementById('cntCards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCart = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
const btnSwitch = document.querySelector('#switch');
let cart = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchSpareparts();
    if (localStorage.getItem('parts')) {
        cart = JSON.parse(localStorage.getItem('parts'));
        showCart();
    }
});

sparePartscontainer.addEventListener('click', e => {
    addCart(e);
});

items.addEventListener('click', e =>{
    btnAction(e);
});

//FETCH REPUESTOS
const fetchSpareparts = async () => {
    const res = await fetch('../js/repuestos.json');
    const data = await res.json();
    showSpareparts(data);
    
}

//MOSTRAR ITEMS MODIFICANDO DOM
const showSpareparts = data => {
    data.forEach(product =>{
        templateCard.querySelector('h5').textContent = product.titulo;
        templateCard.querySelector('h6').textContent = product.precio;
        templateCard.querySelector('p').textContent = product.descripcion;
        templateCard.querySelector('img').setAttribute("src", product.imagen);
        templateCard.querySelector('.btn-dark').dataset.id = product.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    sparePartscontainer.appendChild(fragment); 
}

//Agregar items al carrito
const addCart = e => {
    e.target.classList.contains('btn-dark') && setCart(e.target.parentElement);
    e.stopPropagation();
    Toastify({
        text: "Item añadido al carrito!",
        duration: 1800,
        gravity: "top",
        position: "left",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}

const setCart = object => {
    const product = {
        id: object.querySelector('.btn-dark').dataset.id,
        title: object.querySelector('h5').textContent,
        price: object.querySelector('h6').textContent,
        quantity: 1
    }
    if(cart.hasOwnProperty(product.id)) {
        product.quantity = cart[product.id].quantity + 1;
    }
    cart[product.id] = {...product};
    showCart();

}

//MOSTRAR ITEMS EN EL CARRITO
const showCart = () => {
    items.innerHTML = '';
    Object.values(cart).forEach(product => {
        templateCart.querySelector('th').textContent = product.id;
        templateCart.querySelectorAll('td')[0].textContent = product.title;
        templateCart.querySelectorAll('td')[1].textContent = product.quantity;
        templateCart.querySelector('.btn-info').dataset.id = product.id;
        templateCart.querySelector('.btn-danger').dataset.id = product.id;
        templateCart.querySelector('span').textContent = product.quantity * product.price;
        const clone = templateCart.cloneNode(true);
        fragment.appendChild(clone)
    })
    items.appendChild(fragment);
    showFooter();
    localStorage.setItem('parts', JSON.stringify(cart));
}

//Evento vaciar carrito 
const showFooter = () => {
    footer.innerHTML = '';
    if(Object.keys(cart).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - ¡Comenzá a comprar!</th>
        `
        return;
    }
    const nQuantity = Object.values(cart).reduce((acc, {quantity}) => acc + quantity, 0);
    const nPrice = Object.values(cart).reduce((acc, {quantity, price}) => acc + quantity * price, 0);
    templateFooter.querySelectorAll('td')[0].textContent = nQuantity;
    templateFooter.querySelector('span').textContent = nPrice;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    const btnEmptyCart = document.getElementById('vaciar-carrito');
    btnEmptyCart.addEventListener('click', () => {
        cart = {};
        showCart();
        Toastify({
            text: "Carrito vaciado!",
            duration: 1800,
            gravity: "top",
            position: "left",
            style: {
                background: "linear-gradient(to right, #F1959B, #DC1C13)",
            }
        }).showToast();
    });
}

//CAMBIAR CANTIDAD DE ITEMS EN EL CARRITO
const btnAction = e => {
    // Aumentar
    if(e.target.classList.contains('btn-info')) {
        const product = cart[e.target.dataset.id];
        product.quantity++;
        cart[e.target.dataset.id] = {...product};
        showCart();
        Toastify({
            text: "Item añadido al carrito!",
            duration: 1800,
            gravity: "top",
            position: "left",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }
    //Disminuir
    if(e.target.classList.contains('btn-danger')) {
        const product = cart[e.target.dataset.id];
        product.quantity--;
        product.quantity === 0 && delete cart[e.target.dataset.id];
        showCart();
        Toastify({
            text: "Item eliminado del carrito!",
            duration: 1800,
            gravity: "top",
            position: "left",
            style: {
                background: "linear-gradient(to right, #F1959B, #DC1C13)",
            }
        }).showToast();
    }
    e.stopPropagation();
}

// MODO OSCURO 
btnSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    btnSwitch.classList.toggle('active');
    document.body.classList.contains('dark') ? localStorage.setItem('modo-oscuro', 'true') : localStorage.setItem('modo-oscuro', 'false');
});

if(localStorage.getItem('modo-oscuro') === 'true'){
    document.body.classList.add('dark');
     btnSwitch.classList.add('active');
}else {
    document.body.classList.remove('dark');
    btnSwitch.classList.remove('active');
};

