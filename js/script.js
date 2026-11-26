/* ==========================================================
   Tech Commerce Solutions · script.js
   Organização:
    1. Utilitários
    2. Dados (serviços e produtos)
    3. Componentes reutilizáveis (funções que devolvem HTML)
    4. Renderização das seções
    5. Tema claro/escuro (dark mode)
    6. Cabeçalho e menu mobile
    7. Carrossel de produtos
    8. Notificações, carrinho e gaveta do carrinho
    9. Janelas (dialog), validação de formulários e contato
   10. Animações: contadores, digitação, parallax, inclinação 3D,
       decodificação de títulos e varredura de luz
   ========================================================== */

(function () {
  'use strict';

  /* ---------- 1. Utilitários ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const pad = (n) => String(n).padStart(2, '0');
  const firstName = (nome) => String(nome).trim().split(/\s+/)[0];
  // Escapa texto vindo do banco antes de colocar no HTML (evita injeção de código)
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- 2. Dados ---------- */
  const ICONS = {
    pc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.5 17.3a1.8 1.8 0 0 0 2.6 2.6l5.8-5.8a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>',
    game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8h10a4 4 0 0 1 4 4.4l-.5 3.6a2.5 2.5 0 0 1-4.3 1.3L14.5 15h-5l-1.7 2.3a2.5 2.5 0 0 1-4.3-1.3L3 12.4A4 4 0 0 1 7 8z"/><path d="M8 10.5v3M6.5 12h3"/><circle cx="15.5" cy="11" r=".6" fill="currentColor"/><circle cx="17" cy="13" r=".6" fill="currentColor"/></svg>',
    server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3.5" width="18" height="7" rx="1.6"/><rect x="3" y="13.5" width="18" height="7" rx="1.6"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 7v6M12 17h.01"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.2l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L21 8H6.1"/><circle cx="9.5" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/></svg>'
  };

  /* Dados do site: os cards de serviços e produtos são gerados a partir
     destas listas. Para incluir um produto, basta adicionar um objeto. */

  const SERVICES = [
    {
      icon: 'pc', plate: 'plate-c1', title: 'Venda de computadores',
      text: 'Desktops e notebooks configurados para escritório, estudo e criação de conteúdo.',
      items: ['Montagem sob medida', 'Garantia de 12 meses', 'Entrega em 24h em Manaus'],
      subject: 'Compra de equipamentos'
    },
    {
      icon: 'tool', plate: 'plate-c2', title: 'Assistência técnica',
      text: 'Diagnóstico, reparo e manutenção preventiva com laudo técnico de cada serviço.',
      items: ['Diagnóstico em até 4h', 'Limpeza e troca de pasta térmica', 'Recuperação de dados'],
      subject: 'Assistência técnica'
    },
    {
      icon: 'game', plate: 'plate-c3', title: 'Equipamentos gamer',
      text: 'PCs, periféricos e upgrades pensados para taxa de quadros alta e estável.',
      items: ['Builds com teste de estresse', 'Upgrade de placa de vídeo e memória', 'Periféricos de alto desempenho'],
      subject: 'Equipamentos gamer'
    },
    {
      icon: 'server', plate: 'plate-mix', title: 'Infraestrutura de TI',
      text: 'Redes, servidores e suporte contínuo para empresas de todos os portes.',
      items: ['Cabeamento estruturado e Wi-Fi', 'Servidores e rotinas de backup', 'Contrato de suporte mensal'],
      subject: 'Infraestrutura de TI'
    }
  ];

  const PRODUCTS = [
    { id: 'vortex15', name: 'Notebook Vortex 15 Pro', category: 'Notebooks', img: 'img/notebook.svg', plate: 'plate-c1',
      specs: ['Core i7-13620H', 'RTX 4060 8 GB', '16 GB DDR5', 'SSD 1 TB', '15,6" 144 Hz'], price: 7499, oldPrice: 8299, stock: 8 },
    { id: 'nebulax', name: 'PC Gamer Nebula X', category: 'Gamer', img: 'img/pc-gamer.svg', plate: 'plate-c2',
      specs: ['Ryzen 7 7700', 'RTX 4070 Super 12 GB', '32 GB DDR5', 'SSD 2 TB'], price: 11990, oldPrice: 12990, stock: 4 },
    { id: 'orion', name: 'Kit Orion Office', category: 'Computadores', img: 'img/mini-pc.svg', plate: 'plate-c3',
      specs: ['Core i5-14400', '16 GB DDR4', 'SSD 512 GB', 'Monitor 24"'], price: 3899, oldPrice: null, stock: 15 },
    { id: 'horizon27', name: 'Monitor Horizon 27" Curvo', category: 'Periféricos', img: 'img/monitor.svg', plate: 'plate-c1',
      specs: ['QHD 2560×1440', '165 Hz', '1 ms', 'Curvatura 1500R'], price: 1799, oldPrice: 2099, stock: 12 },
    { id: 'pulse', name: 'Teclado Mecânico Pulse TKL', category: 'Periféricos', img: 'img/teclado.svg', plate: 'plate-c2',
      specs: ['Switch red', 'ABNT2', 'RGB por tecla', 'Hot-swap'], price: 459.9, oldPrice: null, stock: 30 },
    { id: 'strike', name: 'Mouse Gamer Strike 26K', category: 'Gamer', img: 'img/mouse.svg', plate: 'plate-c3',
      specs: ['26.000 DPI', '59 g', '8 botões', 'Sem fio 2,4 GHz'], price: 249.9, oldPrice: 299.9, stock: 40 },
    { id: 'echo71', name: 'Headset Echo 7.1', category: 'Gamer', img: 'img/headset.svg', plate: 'plate-mix',
      specs: ['Surround 7.1 virtual', 'Drivers 50 mm', 'Microfone removível'], price: 389.9, oldPrice: null, stock: 25 }
  ];

  // Categorias montadas a partir dos produtos, na ordem preferida da loja
  const CATEGORY_ORDER = ['Notebooks', 'Computadores', 'Periféricos', 'Gamer'];
  function categories() {
    const found = [...new Set(PRODUCTS.map((p) => p.category))];
    found.sort((a, b) => (CATEGORY_ORDER.indexOf(a) + 1 || 99) - (CATEGORY_ORDER.indexOf(b) + 1 || 99));
    return ['Todos', ...found];
  }

  /* ---------- 3. Componentes reutilizáveis ---------- */

  // Card de serviço: recebe um objeto e devolve o HTML do card
  function ServiceCard(s) {
    return `
      <article class="service-card relief ${s.plate} tilt reveal">
        <div class="service-icon" aria-hidden="true">${ICONS[s.icon]}</div>
        <h3>${esc(s.title)}</h3>
        <p class="text-sm leading-relaxed text-muted">${esc(s.text)}</p>
        <ul class="check-list">${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        <button type="button" class="service-link" data-open-contact data-subject="${esc(s.subject)}">
          Solicitar orçamento ${ICONS.arrow}
        </button>
      </article>`;
  }

  // Card de produto: imagem, nome, especificações, preço, estoque e botão "Comprar"
  function ProductCard(p) {
    const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const out = p.stock === 0;
    const low = p.stock > 0 && p.stock <= 5;
    return `
      <article class="product-card relief ${esc(p.plate)} tilt" data-card>
        <div class="product-media">
          <span class="tag">${esc(p.category)}</span>
          ${off ? `<span class="discount">-${off}%</span>` : ''}
          <img src="${esc(p.img)}" alt="${esc(p.name)}" width="400" height="300" loading="lazy">
        </div>
        <div class="flex flex-1 flex-col gap-4 p-5">
          <h3 class="font-display text-[1.05rem] font-bold leading-snug">${esc(p.name)}</h3>
          <ul class="flex flex-wrap gap-1.5" aria-label="Especificações">
            ${p.specs.map((sp) => `<li class="spec">${esc(sp)}</li>`).join('')}
          </ul>
          <div class="mt-auto">
            ${p.oldPrice ? `<p class="price-old">${brl(p.oldPrice)}</p>` : '<p class="price-old" style="visibility:hidden">—</p>'}
            <p class="price">${brl(p.price)}</p>
            <p class="installments">ou 10x de ${brl(p.price / 10)} sem juros</p>
            ${out ? '<p class="stock out">Esgotado</p>' : low ? `<p class="stock">Restam ${p.stock} unidades</p>` : ''}
          </div>
          <button type="button" class="btn btn-primary w-full justify-center" data-buy="${esc(p.id)}"${out ? ' disabled' : ''}>
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.2l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L21 8H6.1"/></svg>
            <span>${out ? 'Esgotado' : 'Comprar'}</span>
          </button>
        </div>
      </article>`;
  }

  // Botão de filtro (chip)
  function Chip(label, active) {
    return `<button type="button" class="chip" data-filter="${esc(label)}" aria-pressed="${active}">${esc(label)}</button>`;
  }

  /* ---------- 4. Renderização ---------- */
  const servicesGrid = $('#services-grid');
  servicesGrid.innerHTML = SERVICES.map(ServiceCard).join('');

  let activeCategory = 'Todos';
  const filters = $('#product-filters');
  const track = $('#product-track');

  function renderFilters() {
    filters.innerHTML = categories().map((c) => Chip(c, c === activeCategory)).join('');
  }
  function renderProducts(keepScroll) {
    const list = activeCategory === 'Todos' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
    const left = track.scrollLeft;
    track.innerHTML = list.map(ProductCard).join('');
    track.scrollLeft = keepScroll ? left : 0;
    bindTilt(track);
    requestAnimationFrame(updateCarousel);
  }
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    activeCategory = btn.dataset.filter;
    renderFilters();
    renderProducts();
  });

  $('#year').textContent = new Date().getFullYear();

  /* ---------- 5. Tema claro/escuro ---------- */
  const root = document.documentElement;
  $('#theme-toggle').addEventListener('click', () => {
    const dark = !root.classList.contains('dark');
    root.classList.toggle('dark', dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('tcs-theme', dark ? 'dark' : 'light'); } catch (e) { /* armazenamento indisponível */ }
    toast(dark ? 'Tema escuro ativado' : 'Tema claro ativado');
  });

  /* ---------- 6. Cabeçalho e menu mobile ---------- */
  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = $('#menu-toggle');
  const menu = $('#mobile-menu');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a, button')) setMenu(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- 6b. Menu ativo ----------
     Cada seção tem antes dela um <span class="anchor"> com o id usado
     pelos links do menu. Ao rolar, o link da seção cujo início já
     passou da metade da tela fica destacado. */
  const navLinks = $$('.nav-link');
  const headerBar = $('.site-header > .wrap');
  const sections = $$('[data-section]').map((el) => ({ id: el.dataset.section, anchor: document.getElementById(el.dataset.section) }));

  function measureHeader() {
    root.style.setProperty('--header-h', headerBar.offsetHeight + 'px');
  }
  function updateActive() {
    const limit = window.innerHeight * 0.45;
    let active = sections[0].id;
    sections.forEach((s) => { if (s.anchor.getBoundingClientRect().top <= limit) active = s.id; });
    navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + active)));
  }
  let navTick = 0;
  window.addEventListener('scroll', () => {
    if (navTick) return;
    navTick = requestAnimationFrame(() => { navTick = 0; updateActive(); });
  }, { passive: true });
  window.addEventListener('resize', measureHeader);

  /* ---------- 7. Carrossel de produtos ---------- */
  const thumb = $('#progress-thumb');
  const status = $('#carousel-status');
  const prevBtn = $('#prev-btn');
  const nextBtn = $('#next-btn');

  function step() {
    const card = track.querySelector('[data-card]');
    if (!card) return track.clientWidth;
    return card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 28);
  }
  function updateCarousel() {
    const cards = track.querySelectorAll('[data-card]');
    const total = cards.length;
    const max = track.scrollWidth - track.clientWidth;
    const visible = Math.max(1, Math.round(track.clientWidth / step()));
    const first = Math.min(total - 1, Math.round(track.scrollLeft / step()));
    const last = Math.min(total, first + visible);
    status.textContent = total ? `${pad(first + 1)}–${pad(last)} de ${pad(total)}` : 'Nenhum produto';
    thumb.style.width = (max > 0 ? (track.clientWidth / track.scrollWidth) * 100 : 100) + '%';
    thumb.style.left = (max > 0 ? (track.scrollLeft / track.scrollWidth) * 100 : 0) + '%';
    prevBtn.disabled = nextBtn.disabled = max <= 4;
  }
  function go(dir) {
    const max = track.scrollWidth - track.clientWidth;
    if (dir > 0 && track.scrollLeft >= max - 4) track.scrollTo({ left: 0 });
    else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: max });
    else track.scrollBy({ left: dir * step() });
  }
  prevBtn.addEventListener('click', () => { go(-1); pauseFor(8000); });
  nextBtn.addEventListener('click', () => { go(1); pauseFor(8000); });
  track.addEventListener('scroll', () => requestAnimationFrame(updateCarousel), { passive: true });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  window.addEventListener('resize', updateCarousel);

  // Avanço automático: pausa com o mouse em cima, com foco ou fora da tela
  let hovering = false, inView = false, pausedUntil = 0;
  const pauseFor = (ms) => { pausedUntil = Date.now() + ms; };
  track.addEventListener('pointerenter', () => { hovering = true; });
  track.addEventListener('pointerleave', () => { hovering = false; });
  track.addEventListener('touchstart', () => pauseFor(10000), { passive: true });
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: .4 }).observe(track);
  if (!reduceMotion) {
    setInterval(() => {
      const focused = track.contains(document.activeElement);
      if (inView && !hovering && !focused && !document.hidden && Date.now() > pausedUntil) go(1);
    }, 4500);
  }

  /* ---------- 8. Notificações, carrinho e gaveta ---------- */
  function toast(message, tipo) {
    const box = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast' + (tipo === 'erro' ? ' erro' : '');
    el.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
    el.innerHTML = `<span class="toast-icon" aria-hidden="true">${tipo === 'erro' ? ICONS.alert : ICONS.check}</span><span>${message}</span>`;
    box.appendChild(el);
    while (box.children.length > 3) box.firstElementChild.remove();
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 350); }, tipo === 'erro' ? 5200 : 3200);
  }

  // O carrinho fica salvo no navegador (localStorage) como { id: quantidade },
  // então continua lá mesmo depois de fechar a página.
  const CART_KEY = 'tcs-cart';
  const MAX_QTY = 10;
  const cart = new Map();
  try {
    Object.entries(JSON.parse(localStorage.getItem(CART_KEY) || '{}'))
      .forEach(([id, q]) => { if (q > 0) cart.set(id, Math.min(MAX_QTY, q | 0)); });
  } catch (e) { /* carrinho vazio */ }

  const cartBadge = $('#cart-count');
  const cartBtn = $('#cart-btn');
  const drawer = $('#cart-drawer');
  const cartBody = $('#cart-body');
  const cartFoot = $('#cart-foot');
  const checkoutBtn = $('#checkout-btn');
  let lastOrder = null; // pedido recém-criado, mostrado na gaveta

  const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
  const cartCount = () => [...cart.values()].reduce((n, q) => n + q, 0);
  const cartTotal = () => [...cart].reduce((t, [id, q]) => t + (findProduct(id) ? findProduct(id).price * q : 0), 0);

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(Object.fromEntries(cart))); } catch (e) { /* sem armazenamento */ }
  }
  function updateBadge(bump) {
    const n = cartCount();
    cartBadge.hidden = n === 0;
    cartBadge.textContent = n;
    cartBtn.setAttribute('aria-label', `Carrinho: ${n} ${n === 1 ? 'item' : 'itens'}`);
    if (bump) { cartBadge.classList.remove('bump'); void cartBadge.offsetWidth; cartBadge.classList.add('bump'); }
  }
  // Ajusta a quantidade respeitando o limite e o estoque; devolve a quantidade final
  function setQty(id, qty) {
    const p = findProduct(id);
    const max = Math.min(MAX_QTY, p && p.stock != null ? p.stock : MAX_QTY);
    const final = Math.max(0, Math.min(max, qty));
    if (final) cart.set(id, final); else cart.delete(id);
    saveCart();
    updateBadge();
    renderCart();
    return final;
  }

  // Componentes da gaveta
  function CartItem(p, qty) {
    return `
      <div class="cart-item">
        <img src="${esc(p.img)}" alt="" width="64" height="52">
        <div class="min-w-0">
          <h3>${esc(p.name)}</h3>
          <p class="unit">${brl(p.price)} cada</p>
          <div class="flex flex-wrap items-center gap-3">
            <div class="qty" role="group" aria-label="Quantidade de ${esc(p.name)}">
              <button type="button" data-qty="-1" data-id="${esc(p.id)}" aria-label="Diminuir">−</button>
              <span>${qty}</span>
              <button type="button" data-qty="1" data-id="${esc(p.id)}" aria-label="Aumentar">+</button>
            </div>
            <button type="button" class="remove-btn mt-1.5" data-remove="${esc(p.id)}">Remover</button>
          </div>
        </div>
        <p class="line-total">${brl(p.price * qty)}</p>
      </div>`;
  }
  function OrderSuccess(o) {
    return `
      <div class="empty-state">
        <div class="success-ring" aria-hidden="true">${ICONS.check}</div>
        <strong>Pedido #${o.id} registrado</strong>
        <p>${o.itens} ${o.itens === 1 ? 'item' : 'itens'} · total ${brl(o.total)}</p>
        <p class="text-sm">Pedido de demonstração: nenhum pagamento foi cobrado.</p>
        <button type="button" class="btn btn-ghost mt-2" data-goto-products>Continuar comprando</button>
      </div>`;
  }

  function renderCart() {
    if (lastOrder) { cartBody.innerHTML = OrderSuccess(lastOrder); cartFoot.hidden = true; return; }
    const items = [...cart].map(([id, q]) => [findProduct(id), q]).filter(([p]) => p);
    if (!items.length) {
      cartFoot.hidden = true;
      cartBody.innerHTML = `
        <div class="empty-state">
          ${ICONS.bag}
          <strong>Seu carrinho está vazio</strong>
          <p class="text-sm">Escolha um equipamento no carrossel de produtos.</p>
          <button type="button" class="btn btn-ghost mt-2" data-goto-products>Ver produtos</button>
        </div>`;
      return;
    }
    cartFoot.hidden = false;
    cartBody.innerHTML = items.map(([p, q]) => CartItem(p, q)).join('');
    const total = cartTotal();
    $('#cart-total').textContent = brl(total);
    $('#cart-installments').textContent = `ou 10x de ${brl(total / 10)} sem juros`;
    $('#checkout-note').textContent = 'Pedido de demonstração: nenhum pagamento é cobrado.';
  }

  cartBody.addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) {
      const id = qtyBtn.dataset.id;
      const want = (cart.get(id) || 0) + Number(qtyBtn.dataset.qty);
      if (setQty(id, want) < want) toast('Você atingiu o limite disponível deste produto.', 'erro');
      return;
    }
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) { setQty(removeBtn.dataset.remove, 0); return; }
    if (e.target.closest('[data-goto-products]')) { closeDialog(drawer); location.hash = '#produtos'; }
  });

  cartBtn.addEventListener('click', () => {
    lastOrder = null;
    renderCart();
    openDialog(drawer);
  });

  // Botão "Comprar" nos cards (delegação de evento no trilho)
  track.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-buy]');
    if (!btn || btn.disabled || btn.classList.contains('is-done')) return;
    const p = findProduct(btn.dataset.buy);
    const before = cart.get(p.id) || 0;
    if (setQty(p.id, before + 1) === before) {
      toast(`Você já tem o máximo disponível de <strong>${esc(p.name)}</strong> no carrinho.`, 'erro');
      return;
    }
    updateBadge(true);

    const label = btn.querySelector('span');
    btn.classList.add('is-done');
    label.textContent = 'Adicionado';
    setTimeout(() => { btn.classList.remove('is-done'); label.textContent = 'Comprar'; }, 1600);

    toast(`<strong>${esc(p.name)}</strong> no carrinho · total ${brl(cartTotal())}`);
    pauseFor(6000);
  });

  // Finalizar pedido: site só com front-end, então o pedido é simulado.
  // Em uma loja real, aqui entraria um fetch() para a API de pedidos.
  function checkout() {
    const itens = cartCount();
    if (!itens) return;
    setBusy(checkoutBtn, true, 'Registrando pedido…');
    setTimeout(() => {
      const pedido = { id: Math.floor(10000 + Math.random() * 90000), itens, total: cartTotal() };
      cart.clear(); saveCart(); updateBadge();
      lastOrder = pedido;
      setBusy(checkoutBtn, false);
      renderCart();
      toast(`Pedido #${pedido.id} registrado · total ${brl(pedido.total)}`);
    }, 700);
  }
  checkoutBtn.addEventListener('click', checkout);

  // Ondulação em qualquer botão .btn (feedback ao toque)
  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn || reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.left = (e.clientX - r.left) + 'px';
    dot.style.top = (e.clientY - r.top) + 'px';
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  });

  /* ---------- 9. Janelas, formulários, contato, login e conta ---------- */

  // 9.1 Abrir e fechar qualquer <dialog> (contato e carrinho)
  function openDialog(d) {
    if (d.open) return;
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
  }
  function closeDialog(d) {
    if (!d || !d.open) return;
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
  }
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-contact]');
    if (opener) { openContact(opener.dataset.subject); return; }
    const closer = e.target.closest('[data-close]');
    if (closer) closeDialog(closer.closest('dialog'));
  });
  // clique fora do cartão (no fundo escurecido) fecha a janela
  $$('dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) closeDialog(d); }));

  // 9.2 Validação reutilizada por todos os formulários
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const RULES = {
    nome: (v) => v.trim().length >= 2,
    email: (v) => EMAIL.test(v.trim()),
    mensagem: (v) => v.trim().length >= 10
  };
  $$('.field-error').forEach((p) => { p.dataset.default = p.textContent; });

  function setFieldError(input, msg) {
    const field = input.closest('.field');
    if (!field) return;
    const box = field.querySelector('.field-error');
    field.classList.toggle('has-error', Boolean(msg));
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    if (box) { box.hidden = !msg; box.textContent = typeof msg === 'string' ? msg : box.dataset.default; }
  }
  function validateField(input) {
    const rule = RULES[input.name];
    if (!rule) return true;
    const ok = rule(input.value);
    setFieldError(input, !ok);
    return ok;
  }
  function validateForm(form) {
    const bad = $$('input, textarea', form).filter((i) => !validateField(i));
    if (bad.length) bad[0].focus();
    return bad.length === 0;
  }
  function formError(form, msg) {
    const box = $('.form-error', form);
    if (!box) return;
    box.hidden = !msg;
    box.textContent = msg || '';
  }
  function resetFormState(form) {
    $$('input, textarea', form).forEach((i) => setFieldError(i, false));
    formError(form, '');
  }
  function setBusy(btn, busy, label) {
    if (busy) {
      btn.dataset.label = btn.textContent;
      btn.textContent = label;
      btn.setAttribute('aria-busy', 'true');
    } else if (btn.dataset.label) {
      btn.textContent = btn.dataset.label;
      btn.removeAttribute('aria-busy');
      delete btn.dataset.label;
    }
  }
  document.addEventListener('input', (e) => {
    if (e.target.closest('.field.has-error')) validateField(e.target);
  });

  // 9.3 Contato: valida e mostra a confirmação (envio simulado, sem servidor)
  const contactModal = $('#contact-modal');
  const contactForm = $('#contact-form');
  const formWrap = $('#contact-form-wrap');
  const success = $('#contact-success');

  function openContact(subject) {
    formWrap.hidden = false;
    success.hidden = true;
    resetFormState(contactForm);
    if (subject) contactForm.elements.assunto.value = subject;
    openDialog(contactModal);
    setTimeout(() => ($$('input, textarea', contactForm).find((i) => !i.value) || contactForm.elements.nome).focus(), 60);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formError(contactForm, '');
    if (!validateForm(contactForm)) return;
    const dados = Object.fromEntries(new FormData(contactForm));
    const btn = $('button[type="submit"]', contactForm);

    // Envio simulado: em produção, aqui entraria um fetch() para a API da empresa
    setBusy(btn, true, 'Enviando…');
    setTimeout(() => {
      setBusy(btn, false);
      $('#success-name').textContent = firstName(dados.nome);
      formWrap.hidden = true;
      success.hidden = false;
      contactForm.reset();
      toast('Mensagem registrada. Retornamos em até 1 dia útil.');
    }, 700);
  });

  /* ---------- 10. Animações ---------- */

  // 10.1 Contadores do hero (contam de 0 até o valor final)
  function runCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const fmt = (v) => prefix + v.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const start = performance.now(), dur = 1800;
    (function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }
  $$('[data-count]').forEach(runCounter);

  // 10.2 Efeito de digitação no hero
  const typed = $('#typed');
  const words = ['trabalhar', 'estudar', 'criar', 'jogar', 'crescer'];
  if (!reduceMotion && typed) {
    let w = 0, c = words[0].length, deleting = true;
    setTimeout(function tick() {
      const word = words[w];
      c += deleting ? -1 : 1;
      typed.textContent = word.slice(0, c);
      let delay = deleting ? 55 : 95;
      if (!deleting && c === word.length) { deleting = true; delay = 1900; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 250; }
      setTimeout(tick, delay);
    }, 2200);
  }

  // 10.3 Parallax das camadas do hero acompanhando o mouse
  const stage = $('#stage');
  const hero = $('#inicio');
  if (stage && !reduceMotion) {
    const layers = $$('.layer', stage);
    let raf = 0;
    hero.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        layers.forEach((layer) => {
          const d = parseFloat(layer.dataset.depth);
          layer.style.transform = `translate3d(${x * d}px, ${y * d}px, 0) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
        });
      });
    });
    hero.addEventListener('pointerleave', () => layers.forEach((l) => { l.style.transform = ''; }));
  }

  // 10.4 Inclinação 3D dos cards (apenas com mouse)
  function bindTilt(scope) {
    if (reduceMotion) return;
    $$('.tilt', scope).forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // 10.5 Títulos que se "decodificam" ao entrar na tela
  const GLYPHS = '01<>/#$%&*+=ABCDEFXZ';
  function decode(el) {
    const final = el.dataset.text;
    let frame = 0;
    const total = 26;
    (function run() {
      const progress = frame / total;
      el.textContent = final.split('').map((ch, i) => {
        if (ch === ' ' || i / final.length < progress) return ch;
        return GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }).join('');
      if (frame++ < total) requestAnimationFrame(() => setTimeout(run, 22));
      else el.textContent = final;
    })();
  }

  // 10.6 Observador único: dispara a decodificação e a varredura de luz
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      seen.unobserve(el);
      if (el.hasAttribute('data-decode')) decode(el);
      if (el.classList.contains('reveal')) {
        el.classList.add('scan');
        el.addEventListener('animationend', () => el.classList.remove('scan'), { once: true });
      }
    });
  }, { threshold: .35 });

  $$('[data-decode]').forEach((el) => {
    el.dataset.text = el.textContent.trim();
    el.setAttribute('aria-label', el.dataset.text);
    if (!reduceMotion) seen.observe(el);
  });
  if (!reduceMotion) $$('.reveal').forEach((el) => seen.observe(el));

  /* ---------- Inicialização ---------- */
  renderFilters();
  renderProducts();
  bindTilt(document);
  measureHeader();
  updateActive();
  updateBadge();
  renderCart();
})();
