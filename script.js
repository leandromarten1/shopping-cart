function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) { //remove um item clicado do carrinho
  const section = document.querySelector('ol.cart__items');
  section.removeChild(event.target);
  moveLocalStorage();
}

function addToCartObj(obj) { // recebe um objeto produto e converte as keys para (sku, name, salePrice)
  const { id: sku, title: name, price: salePrice } = obj;
  // console.log({ sku, name, salePrice });
  return { sku, name, salePrice };
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (id) => { // recebe o ID de um produto, insere na API, 
  // console.log(id);
  const API_ID = `https://api.mercadolibre.com/items/${id}`;
  fetch(API_ID)
  .then(response => response.json())
  .then(data => {    
    return addToCartObj(data) // convertendo as keys 
  }) 
  .then(obj => createCartItemElement(obj)) // Cria o item que vai para o carrinho
  .then(item => {
    document.querySelector('ol.cart__items').appendChild(item);// insere o item no carrinho
  })
  .then(() => moveLocalStorage()); // envia pro localStorage
};

function createCustomElement(element, className, innerText, id = null) {
  const e = document.createElement(element);
  if (element === 'button') { // se for botão, adiciona um eventListener que pega o ID do item
    e.addEventListener('click', () => {
      addToCart(id);
    });
  }
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku),
  );

  return section;
}

const listingProducts = (arr) => { // Recebe o array de produtos da API, (troca as keys para sku, name, image), e insere o producto na section.
  const sectionItem = document.querySelector('section.items');
  arr.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const newObj = { sku, name, image };
    sectionItem.appendChild(createProductItemElement(newObj));
  });
};

const fetchProduct = () => { // Fetch API retornando o Objeto Json (nesse caso o array de produtos).
  const QUERY = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  fetch(API_URL)
    .then(response => response.json())
    .then(data => listingProducts(data.results));
};

setTimeout(() => { // Aplicação do loading
  document.body.removeChild(document.querySelector('.loading'));
}, 2000);


function totalPrice() {// somar Total
  const allItens = document.querySelectorAll('.cart__item');
  // console.log(allItens);
}

window.onload = function onload() {
  fetchProduct();

  const btnClearCart = document.querySelector('#empty-cart');// Remove todos os itens do carrinho de compras
  btnClearCart.addEventListener('click', () => {
    const cadaItem = document.querySelector('ol.cart__items');
    while (cadaItem.firstChild) {
      cadaItem.removeChild(cadaItem.firstChild);
    }
    document.querySelector('.cart__items').innerHTML = '';
    moveLocalStorage();
  });

  if (typeof Storage !== 'undefined') getLocalStorage();
};

const moveLocalStorage = () => {// Envia os produtos do carrinho para o localStorage
  const listProducts = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('carrinho', listProducts);
};

const getLocalStorage = () => {// Pega os produtos do localStorage e insere no carrinho
  const getList = localStorage.getItem('carrinho');
  document.querySelector('.cart__items').innerHTML = getList;
};
