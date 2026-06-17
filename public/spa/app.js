const apiBase = '/api/products';

async function fetchProducts() {
  const res = await fetch(apiBase);
  return res.json();
}

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  children.flat().forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}

function render(products) {
  const list = document.getElementById('products-list');
  list.innerHTML = '';
  if (!products.length) {
    list.appendChild(el('p', {}, 'No hay productos aún.'));
    return;
  }
  const table = el('table');
  const header = el('tr', {}, el('th', {}, 'ID'), el('th', {}, 'Nombre'), el('th', {}, 'Precio'), el('th', {}, 'Acciones'));
  table.appendChild(header);
  products.forEach(p => {
    const row = el('tr', {},
      el('td', {}, String(p.id)),
      el('td', {}, p.name),
      el('td', {}, String(p.price)),
      el('td', {},
        (function(){
          const edit = el('button', {}, 'Editar');
          edit.addEventListener('click', () => fillForm(p));
          const del = el('button', {}, 'Eliminar');
          del.addEventListener('click', () => removeProduct(p.id));
          return el('span', {}, edit, ' ', del);
        })()
      )
    );
    table.appendChild(row);
  });
  list.appendChild(table);
}

function fillForm(p) {
  document.getElementById('product-id').value = p.id;
  document.getElementById('name').value = p.name;
  document.getElementById('price').value = p.price;
  document.getElementById('form-title').textContent = 'Editar producto';
}

function resetForm() {
  document.getElementById('product-id').value = '';
  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  document.getElementById('form-title').textContent = 'Agregar producto';
}

async function removeProduct(id) {
  if (!confirm('Eliminar producto?')) return;
  await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
  load();
}

async function submitForm(e) {
  e.preventDefault();
  const id = document.getElementById('product-id').value;
  const name = document.getElementById('name').value.trim();
  const price = document.getElementById('price').value;
  const body = { name, price: Number(price) };
  if (id) {
    await fetch(`${apiBase}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } else {
    await fetch(apiBase, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  }
  resetForm();
  load();
}

async function load() {
  const products = await fetchProducts();
  render(products);
}

document.getElementById('product-form').addEventListener('submit', submitForm);
document.getElementById('cancel-btn').addEventListener('click', resetForm);

load();
