// Simple frontend for Gift Shop Management (static demo data)
const orders = [
  { id: 'G-1001', customer: 'Aisha Fernando', items: 3, total: 129.00, status: 'pending', date: '2025-10-18', itemsList: ['Handmade Mug','Greeting Card','Ribbon Wrap'] },
  { id: 'G-1002', customer: 'Kamal Perera', items: 1, total: 49.00, status: 'processing', date: '2025-10-16', itemsList: ['Canvas Print'] },
  { id: 'G-1003', customer: 'Saman Silva', items: 2, total: 89.50, status: 'shipped', date: '2025-10-12', itemsList: ['Photo Frame','Keychain'] },
  { id: 'G-1004', customer: 'Nadeesha Jay', items: 5, total: 299.99, status: 'processing', date: '2025-10-10', itemsList: ['Gift Box','Assorted Chocolates','Scented Candle','Card','Ribbon'] },
  { id: 'G-1005', customer: 'Ravi Kumar', items: 1, total: 19.99, status: 'cancelled', date: '2025-09-30', itemsList: ['Sticker Pack'] }
];

const ordersTbody = document.getElementById('ordersTbody');
const ordersCount = document.getElementById('ordersCount');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const orderModal = document.getElementById('orderModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const newOrderBtn = document.getElementById('newOrderBtn');

function formatCurrency(n){return '$' + n.toFixed(2)}

function renderOrders(list){
  ordersTbody.innerHTML = '';
  list.forEach(o=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding:.75rem;border-top:1px solid rgba(255,255,255,0.02)">${o.id}</td>
      <td style="padding:.75rem;border-top:1px solid rgba(255,255,255,0.02)">${o.customer}</td>
      <td style="padding:.75rem;border-top:1px solid rgba(255,255,255,0.02)">${o.items}</td>
      <td style="padding:.75rem;border-top:1px solid rgba(255,255,255,0.02)">${formatCurrency(o.total)}</td>
      <td style="padding:.75rem;border-top:1px solid rgba(255,255,255,0.02)"><span class="text-muted">${o.status}</span></td>
      <td style="padding:.75rem;border-top:1px solid rgba(255,255,255,0.02)">${o.date}</td>
      <td style="padding:.75rem;border-top:1px solid rgba(255,255,255,0.02)"><button class="btn" data-id="${o.id}">View</button></td>
    `;
    ordersTbody.appendChild(tr);
  });
  ordersCount.textContent = `${list.length} order${list.length!==1? 's':''}`
  // attach view handlers
  document.querySelectorAll('button[data-id]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-id');
      openOrderModal(id);
    });
  });
}

function openOrderModal(id){
  const o = orders.find(x=>x.id===id);
  if(!o) return;
  modalTitle.textContent = `Order #${o.id} — ${o.customer}`;
  modalBody.innerHTML = `
    <p><strong>Items:</strong> ${o.items} (${o.itemsList.join(', ')})</p>
    <p><strong>Total:</strong> ${formatCurrency(o.total)}</p>
    <p><strong>Status:</strong> ${o.status}</p>
    <p><strong>Date:</strong> ${o.date}</p>
    <div style="margin-top:1rem">
      <button class="btn" id="markProcessing">Mark Processing</button>
      <button class="btn secondary" id="markShipped">Mark Shipped</button>
    </div>
  `;
  orderModal.classList.add('open');
  orderModal.setAttribute('aria-hidden','false');

  document.getElementById('markProcessing').addEventListener('click', ()=>{
    updateOrderStatus(id,'processing');
  });
  document.getElementById('markShipped').addEventListener('click', ()=>{
    updateOrderStatus(id,'shipped');
  });
}

function closeOrderModal(){
  orderModal.classList.remove('open');
  orderModal.setAttribute('aria-hidden','true');
}

function updateOrderStatus(id,status){
  const o = orders.find(x=>x.id===id);
  if(!o) return;
  o.status = status;
  renderOrders(applyFilters());
  closeOrderModal();
}

function applyFilters(){
  const q = (searchInput.value||'').toLowerCase().trim();
  const s = statusFilter.value;
  return orders.filter(o=>{
    if(s && o.status!==s) return false;
    if(!q) return true;
    return o.id.includes(q) || o.customer.toLowerCase().includes(q);
  });
}

searchInput.addEventListener('input', ()=> renderOrders(applyFilters()));
statusFilter.addEventListener('change', ()=> renderOrders(applyFilters()));
closeModal.addEventListener('click', closeOrderModal);
orderModal.addEventListener('click', (e)=>{ if(e.target===orderModal) closeOrderModal(); });
newOrderBtn.addEventListener('click', ()=> alert('This demo demo does not implement order creation. To add orders use the admin panel or API.'));

// initial render
renderOrders(orders);
