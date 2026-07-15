/**
 * Warung Kelontong Bawen - Client Script
 * Vanilla JavaScript implementation for high-speed, modern online minimarket experience.
 */

// ==================== CONFIGURATION ====================
// Ganti nomor WhatsApp pemilik warung di sini (Format internasional tanpa '+' atau spasi)
const OWNER_WA_NUMBER = '6281329241551'; 
const ADMIN_PIN = '1234'; // PIN Keamanan untuk masuk ke Panel Admin
const FREE_SHIPPING_MINIMUM = 50000;
const FLAT_SHIPPING_FEE = 5000;
// ========================================================

// --- INITIAL PRODUCT DATABASE ---
const INITIAL_PRODUCTS = [
  // Category: Beras
  {
    id: 'beras-01',
    name: 'Beras Premium Pandan Wangi 5 Kg',
    category: 'Beras',
    price: 72500,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
    unit: '5 Kg',
    bestSeller: true,
    stock: 15
  },
  {
    id: 'beras-02',
    name: 'Beras Merah Organik Premium 1 Kg',
    category: 'Beras',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=400',
    unit: '1 Kg',
    bestSeller: false,
    stock: 8
  },

  // Category: Minyak Goreng
  {
    id: 'minyak-01',
    name: 'Minyak Goreng Bimoli Spesial 2 Liter',
    category: 'Minyak Goreng',
    price: 34500,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400',
    unit: '2 Liter',
    bestSeller: true,
    stock: 20
  },
  {
    id: 'minyak-02',
    name: 'Minyak Goreng Filma Botol 1 Liter',
    category: 'Minyak Goreng',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1622484211148-717098492c90?auto=format&fit=crop&q=80&w=400',
    unit: '1 Liter',
    bestSeller: false,
    stock: 25
  },

  // Category: Telur
  {
    id: 'telur-01',
    name: 'Telur Ayam Negeri Fresh 1 Kg',
    category: 'Telur',
    price: 26500,
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=400',
    unit: '1 Kg (~16 Butir)',
    bestSeller: true,
    stock: 30
  },
  {
    id: 'telur-02',
    name: 'Telur Bebek Asin Rebus (Pcs)',
    category: 'Telur',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1498887960847-2a5e46312788?auto=format&fit=crop&q=80&w=400',
    unit: '1 Butir',
    bestSeller: false,
    stock: 50
  },

  // Category: Gula
  {
    id: 'gula-01',
    name: 'Gula Pasir Gulaku Putih Murni 1 Kg',
    category: 'Gula',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=400',
    unit: '1 Kg',
    bestSeller: true,
    stock: 40
  },
  {
    id: 'gula-02',
    name: 'Gula Jawa / Merah Batok Asli 500g',
    category: 'Gula',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1608475240212-be228f4cc140?auto=format&fit=crop&q=80&w=400',
    unit: '500 Gram',
    bestSeller: false,
    stock: 15
  },

  // Category: Mie Instan
  {
    id: 'mie-01',
    name: 'Indomie Goreng Spesial',
    category: 'Mie Instan',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',
    unit: '1 Bungkus',
    bestSeller: true,
    stock: 120
  },
  {
    id: 'mie-02',
    name: 'Indomie Kuah Rasa Ayam Bawang',
    category: 'Mie Instan',
    price: 3300,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400',
    unit: '1 Bungkus',
    bestSeller: false,
    stock: 90
  },
  {
    id: 'mie-03',
    name: 'Mie Sedaap Goreng Original',
    category: 'Mie Instan',
    price: 3400,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=400',
    unit: '1 Bungkus',
    bestSeller: false,
    stock: 80
  },

  // Category: Minuman
  {
    id: 'minuman-01',
    name: 'Teh Botol Sosro Kotak 450ml',
    category: 'Minuman',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400',
    unit: '450 ml',
    bestSeller: false,
    stock: 60
  },
  {
    id: 'minuman-02',
    name: 'Aqua Air Mineral Botol 600ml',
    category: 'Minuman',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1608885898957-a599fb1b4671?auto=format&fit=crop&q=80&w=400',
    unit: '600 ml',
    bestSeller: false,
    stock: 150
  },
  {
    id: 'minuman-03',
    name: 'Coca Cola Botol Segar 390ml',
    category: 'Minuman',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
    unit: '390 ml',
    bestSeller: false,
    stock: 45
  },

  // Category: Snack
  {
    id: 'snack-01',
    name: 'Chitato Sapi Panggang Medium 68g',
    category: 'Snack',
    price: 11500,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400',
    unit: '68 Gram',
    bestSeller: true,
    stock: 35
  },
  {
    id: 'snack-02',
    name: 'Kusuka Keripik Singkong Barbeque',
    category: 'Snack',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1599490659223-930b1410e64f?auto=format&fit=crop&q=80&w=400',
    unit: '180 Gram',
    bestSeller: false,
    stock: 20
  },
  {
    id: 'snack-03',
    name: 'Oreo Sandwich Cookies Double Stuff',
    category: 'Snack',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1558961312-503453e08a3b?auto=format&fit=crop&q=80&w=400',
    unit: '133 Gram',
    bestSeller: false,
    stock: 40
  },

  // Category: Sabun dan kebutuhan rumah tangga
  {
    id: 'sabun-01',
    name: 'Rinso Anti Noda Bubuk Classic',
    category: 'Sabun dan kebutuhan rumah tangga',
    price: 21000,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400',
    unit: '770 Gram',
    bestSeller: true,
    stock: 18
  },
  {
    id: 'sabun-02',
    name: 'Sunlight Pencuci Piring Jeruk Nipis',
    category: 'Sabun dan kebutuhan rumah tangga',
    price: 15500,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=400',
    unit: '750 ml',
    bestSeller: false,
    stock: 22
  },
  {
    id: 'sabun-03',
    name: 'Sabun Mandi Cair Lifebuoy Merah',
    category: 'Sabun dan kebutuhan rumah tangga',
    price: 23500,
    image: 'https://images.unsplash.com/photo-1607006342411-9a336f568619?auto=format&fit=crop&q=80&w=400',
    unit: '450 ml Refill',
    bestSeller: false,
    stock: 15
  }
];

// --- APP STATE ---
let PRODUCTS = JSON.parse(localStorage.getItem('warung_bawen_products')) || JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let cart = JSON.parse(localStorage.getItem('warung_bawen_cart')) || [];
let selectedCategory = 'Semua';
let searchQuery = '';

// --- DOM ELEMENTS ---
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const categorySlider = document.getElementById('category-slider');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartToggleMobileBtn = document.getElementById('cart-toggle-mobile-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartBadge = document.getElementById('cart-badge');
const cartBadgeMobile = document.getElementById('cart-badge-mobile');
const cartCountText = document.getElementById('cart-count-text');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartEmptyState = document.getElementById('cart-empty-state');
const cartFilledState = document.getElementById('cart-filled-state');
const checkoutForm = document.getElementById('checkout-form');

// Prices & Summary in Cart
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTotal = document.getElementById('summary-total');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

// Admin Portal DOM Elements
const adminPortalBtn = document.getElementById('admin-portal-btn');
const adminOverlay = document.getElementById('admin-overlay');
const adminModal = document.getElementById('admin-modal');
const closeAdminBtn = document.getElementById('close-admin-btn');
const adminGate = document.getElementById('admin-gate');
const adminPinInput = document.getElementById('admin-pin-input');
const adminPinError = document.getElementById('admin-pin-error');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminMainContent = document.getElementById('admin-main-content');
const adminSearchInput = document.getElementById('admin-search-input');
const adminResetDataBtn = document.getElementById('admin-reset-data-btn');
const adminSaveAllBtn = document.getElementById('admin-save-all-btn');
const adminProductsList = document.getElementById('admin-products-list');

// --- HELPER FUNCTIONS ---
function formatRupiah(number) {
  return 'Rp ' + number.toLocaleString('id-ID');
}

function saveCart() {
  localStorage.setItem('warung_bawen_cart', JSON.stringify(cart));
  updateCartUI();
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl z-100 flex items-center space-x-2 animate-bounce';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span class="font-medium text-xs sm:text-sm whitespace-nowrap">${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

// --- RENDERING LOGIC ---

// Render category filter chips
function renderCategories() {
  const categories = ['Semua', ...new Set(PRODUCTS.map(p => p.category))];
  categorySlider.innerHTML = '';

  categories.forEach((cat, index) => {
    const isSelected = selectedCategory === cat;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
      isSelected 
        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 border-2 border-emerald-600' 
        : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
    }`;
    btn.innerText = getCategoryEmoji(cat) + ' ' + cat;
    btn.id = `cat-btn-${index}`;
    btn.addEventListener('click', () => {
      selectedCategory = cat;
      renderCategories();
      renderProducts();
    });
    categorySlider.appendChild(btn);
  });
}

function getCategoryEmoji(cat) {
  switch (cat) {
    case 'Semua': return '🏪';
    case 'Beras': return '🌾';
    case 'Minyak Goreng': return '🛢️';
    case 'Telur': return '🍳';
    case 'Gula': return '🍬';
    case 'Mie Instan': return '🍜';
    case 'Minuman': return '🥤';
    case 'Snack': return '🍿';
    case 'Sabun dan kebutuhan rumah tangga': return '🧼';
    default: return '📦';
  }
}

// Render product catalog
function renderProducts() {
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = '';

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="col-span-full py-16 text-center" id="empty-search-state">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i data-lucide="search-slash" class="w-8 h-8 text-gray-400"></i>
        </div>
        <p class="text-gray-500 font-medium">Ups! Produk tidak ditemukan</p>
        <p class="text-gray-400 text-sm mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  filteredProducts.forEach((product) => {
    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    const isOutOfStock = product.stock <= 0;

    const card = document.createElement('div');
    card.id = `product-card-${product.id}`;
    card.className = 'product-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col relative';

    // Best seller badge
    let badgeHTML = '';
    if (product.bestSeller && !isOutOfStock) {
      badgeHTML = `<span class="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded-md z-10 shadow-sm">TERLARIS</span>`;
    } else if (isOutOfStock) {
      badgeHTML = `<span class="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded-md z-10 shadow-sm">HABIS</span>`;
    }

    card.innerHTML = `
      ${badgeHTML}
      <div class="relative pt-[100%] bg-gray-50 overflow-hidden">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'opacity-55 grayscale-[30%]' : ''}"
          loading="lazy"
        />
      </div>
      <div class="p-4 flex-1 flex flex-col">
        <span class="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">${product.category}</span>
        <h3 class="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[40px] leading-tight mb-1">${product.name}</h3>
        <p class="text-xs text-gray-400 mb-3 flex items-center justify-between">
          <span>${product.unit}</span>
          <span>Stok: ${product.stock > 0 ? `<strong class="text-gray-700">${product.stock}</strong>` : '<span class="text-red-500 font-bold">Habis</span>'}</span>
        </p>
        
        <div class="mt-auto flex items-center justify-between">
          <span class="font-bold text-gray-900 text-base">${formatRupiah(product.price)}</span>
          
          <div class="flex items-center">
            ${isOutOfStock ? `
              <button 
                type="button"
                disabled
                class="bg-gray-100 text-gray-400 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 cursor-not-allowed border border-gray-250"
              >
                Stok Habis
              </button>
            ` : quantity > 0 ? `
              <div class="flex items-center bg-emerald-50 rounded-lg p-1 border border-emerald-100">
                <button 
                  type="button" 
                  id="btn-minus-${product.id}"
                  class="w-7 h-7 flex items-center justify-center bg-white border border-emerald-200 text-emerald-600 rounded-md font-bold hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                >
                  -
                </button>
                <span class="px-3 font-semibold text-emerald-800 text-sm w-6 text-center">${quantity}</span>
                <button 
                  type="button" 
                  id="btn-plus-${product.id}"
                  class="w-7 h-7 flex items-center justify-center bg-emerald-600 text-white rounded-md font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            ` : `
              <button 
                type="button"
                id="btn-add-${product.id}"
                class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                + Beli
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    productGrid.appendChild(card);

    // Event Listeners for quantity adjusters
    if (!isOutOfStock) {
      if (quantity > 0) {
        document.getElementById(`btn-minus-${product.id}`).addEventListener('click', () => {
          updateCartQuantity(product.id, -1);
        });
        document.getElementById(`btn-plus-${product.id}`).addEventListener('click', () => {
          updateCartQuantity(product.id, 1);
        });
      } else {
        document.getElementById(`btn-add-${product.id}`).addEventListener('click', () => {
          addToCart(product);
        });
      }
    }
  });

  lucide.createIcons();
}

// Update quantities in the shopping cart
function updateCartQuantity(productId, change) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    const currentQuantity = cart[itemIndex].quantity;
    
    // Check stock limit when increasing quantity
    if (change > 0 && currentQuantity + change > product.stock) {
      showToast(`Stok terbatas! Maksimal ${product.stock} pcs`);
      return;
    }

    cart[itemIndex].quantity += change;
    
    // Animate badge
    cartBadge.classList.add('cart-pulse');
    cartBadgeMobile.classList.add('cart-pulse');
    setTimeout(() => {
      cartBadge.classList.remove('cart-pulse');
      cartBadgeMobile.classList.remove('cart-pulse');
    }, 300);

    if (cart[itemIndex].quantity <= 0) {
      const item = cart[itemIndex];
      cart.splice(itemIndex, 1);
      showToast(`${item.name} dihapus dari keranjang`);
    }
    saveCart();
    renderProducts();
  }
}

// Add completely new item to the cart
function addToCart(product) {
  if (product.stock <= 0) {
    showToast("Maaf, stok produk ini sedang habis!");
    return;
  }

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    if (existing.quantity + 1 > product.stock) {
      showToast(`Stok terbatas! Maksimal ${product.stock} pcs`);
      return;
    }
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  // Animate badge
  cartBadge.classList.add('cart-pulse');
  cartBadgeMobile.classList.add('cart-pulse');
  setTimeout(() => {
    cartBadge.classList.remove('cart-pulse');
    cartBadgeMobile.classList.remove('cart-pulse');
  }, 300);

  showToast(`${product.name} berhasil ditambahkan!`);
  saveCart();
  renderProducts();
}

// Update Cart Sidebar Drawer Interface
function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Badges updating
  cartBadge.innerText = totalItems;
  cartBadgeMobile.innerText = totalItems;
  
  if (totalItems > 0) {
    cartBadge.classList.remove('hidden');
    cartBadgeMobile.classList.remove('hidden');
  } else {
    cartBadge.classList.add('hidden');
    cartBadgeMobile.classList.add('hidden');
  }

  cartCountText.innerText = `(${totalItems} Barang)`;

  if (cart.length === 0) {
    cartEmptyState.classList.remove('hidden');
    cartFilledState.classList.add('hidden');
  } else {
    cartEmptyState.classList.add('hidden');
    cartFilledState.classList.remove('hidden');

    // Render cart item rows
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemRow = document.createElement('div');
      itemRow.className = 'flex items-center gap-3 py-3 border-b border-gray-100 last:border-none';
      itemRow.id = `cart-row-${item.id}`;
      itemRow.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0" />
        <div class="flex-1 min-w-0 text-left">
          <h4 class="font-medium text-gray-800 text-xs line-clamp-1">${item.name}</h4>
          <span class="text-[10px] text-gray-400 uppercase tracking-wider block">${item.category} • ${item.unit}</span>
          <div class="flex items-center justify-between mt-1.5">
            <span class="font-bold text-emerald-600 text-xs">${formatRupiah(item.price)}</span>
            <div class="flex items-center gap-1.5">
              <button 
                type="button" 
                id="cart-minus-${item.id}"
                class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md font-bold text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer text-xs"
              >
                -
              </button>
              <span class="font-semibold text-xs text-gray-800 w-4 text-center">${item.quantity}</span>
              <button 
                type="button" 
                id="cart-plus-${item.id}"
                class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md font-bold text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer text-xs"
              >
                +
              </button>
              <button 
                type="button" 
                id="cart-remove-${item.id}"
                class="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition-colors ml-1 cursor-pointer"
                title="Hapus item"
              >
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      cartItemsContainer.appendChild(itemRow);

      // Listeners
      document.getElementById(`cart-minus-${item.id}`).addEventListener('click', () => updateCartQuantity(item.id, -1));
      document.getElementById(`cart-plus-${item.id}`).addEventListener('click', () => updateCartQuantity(item.id, 1));
      document.getElementById(`cart-remove-${item.id}`).addEventListener('click', () => {
        const itemIndex = cart.findIndex(i => i.id === item.id);
        if (itemIndex > -1) {
          const removedItem = cart[itemIndex];
          cart.splice(itemIndex, 1);
          showToast(`${removedItem.name} dihapus`);
          saveCart();
          renderProducts();
        }
      });
    });

    // Shipping calculations
    let shippingFee = FLAT_SHIPPING_FEE;
    if (subtotal >= FREE_SHIPPING_MINIMUM) {
      shippingFee = 0;
    }

    const grandTotal = subtotal + shippingFee;

    // Update prices
    summarySubtotal.innerText = formatRupiah(subtotal);
    summaryShipping.innerText = shippingFee === 0 ? 'GRATIS' : formatRupiah(shippingFee);
    if (shippingFee === 0) {
      summaryShipping.className = 'text-emerald-600 font-bold';
    } else {
      summaryShipping.className = 'text-gray-800 font-semibold';
    }
    summaryTotal.innerText = formatRupiah(grandTotal);

    // Free shipping progress bar
    if (subtotal >= FREE_SHIPPING_MINIMUM) {
      progressContainer.className = 'bg-emerald-50 border border-emerald-100 p-3 rounded-xl mb-4';
      progressFill.style.width = '100%';
      progressFill.className = 'h-full bg-emerald-500 rounded-full transition-all duration-300';
      progressText.innerHTML = `🎉 Selamat! Kamu mendapatkan <strong>GRATIS ONGKIR</strong> khusus area Bawen!`;
    } else {
      const remaining = FREE_SHIPPING_MINIMUM - subtotal;
      const pct = (subtotal / FREE_SHIPPING_MINIMUM) * 100;
      progressContainer.className = 'bg-amber-50 border border-amber-100 p-3 rounded-xl mb-4';
      progressFill.style.width = `${pct}%`;
      progressFill.className = 'h-full bg-amber-500 rounded-full transition-all duration-300';
      progressText.innerHTML = `Belanja <strong>${formatRupiah(remaining)}</strong> lagi untuk gratis ongkir!`;
    }

    lucide.createIcons();
  }
}

// --- DRAWER ACTIONS ---
function openCart() {
  cartDrawer.style.transform = 'translateX(0)';
  cartOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Stop background scroll
}

function closeCart() {
  cartDrawer.style.transform = 'translateX(100%)';
  cartOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

// --- ADMIN PORTAL ACTIONS ---
function openAdmin() {
  adminPinInput.value = '';
  adminPinError.classList.add('hidden');
  adminOverlay.classList.remove('hidden');
  adminOverlay.style.opacity = '1';
  adminModal.style.transform = 'scale(1)';
  
  // Initially show PIN gate
  adminGate.classList.remove('hidden');
  adminMainContent.classList.add('hidden');
  
  document.body.style.overflow = 'hidden';
  adminPinInput.focus();
}

function closeAdmin() {
  adminOverlay.classList.add('hidden');
  adminModal.style.transform = 'scale(0.95)';
  document.body.style.overflow = '';
}

function loginAdmin() {
  const pin = adminPinInput.value.trim();
  if (pin === ADMIN_PIN) {
    adminGate.classList.add('hidden');
    adminMainContent.classList.remove('hidden');
    renderAdminProducts();
  } else {
    adminPinError.classList.remove('hidden');
    adminPinInput.focus();
  }
}

// Render dynamic lists of products inside Admin Panel
function renderAdminProducts() {
  const query = adminSearchInput.value.toLowerCase().trim();
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));

  adminProductsList.innerHTML = '';

  if (filtered.length === 0) {
    adminProductsList.innerHTML = `
      <div class="py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
        <i data-lucide="info" class="w-8 h-8 text-gray-400 mx-auto mb-2"></i>
        <p class="font-medium text-sm">Tidak ada produk yang cocok</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  filtered.forEach(p => {
    const row = document.createElement('div');
    row.className = 'admin-product-row bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:grid md:grid-cols-12 gap-3.5 items-center';
    row.dataset.id = p.id;
    row.innerHTML = `
      <!-- Product Info/Thumbnail -->
      <div class="col-span-5 flex items-center gap-3 w-full">
        <img src="${p.image}" alt="${p.name}" class="w-11 h-11 object-cover rounded-xl border border-gray-100 flex-shrink-0" />
        <div class="min-w-0 flex-1 text-left">
          <input 
            type="text" 
            class="admin-name-input w-full font-semibold text-gray-800 text-xs sm:text-sm bg-gray-50 hover:bg-emerald-50 focus:bg-white border border-transparent hover:border-emerald-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 focus:outline-none transition-colors" 
            value="${p.name}"
            placeholder="Nama Produk"
          />
          <span class="text-[10px] text-gray-400 uppercase tracking-wider block px-2.5 mt-0.5">${p.category} • ${p.unit}</span>
        </div>
      </div>

      <!-- Kategori label -->
      <div class="col-span-2 text-right w-full md:w-auto hidden md:block">
        <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] tracking-wide uppercase">${p.category}</span>
      </div>

      <!-- Price Input -->
      <div class="col-span-2 flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
        <span class="text-xs text-gray-400 font-medium md:hidden">Harga:</span>
        <div class="relative max-w-[140px] md:max-w-none flex-1 md:flex-initial">
          <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">Rp</span>
          <input 
            type="number" 
            class="admin-price-input w-full text-right font-bold text-gray-800 text-xs sm:text-sm bg-gray-50 hover:bg-emerald-50 focus:bg-white border border-transparent hover:border-emerald-200 focus:border-emerald-500 rounded-lg pl-8 pr-2 py-1.5 focus:outline-none transition-colors" 
            value="${p.price}"
            min="0"
          />
        </div>
      </div>

      <!-- Stock Input -->
      <div class="col-span-2 flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
        <span class="text-xs text-gray-400 font-medium md:hidden">Stok:</span>
        <input 
          type="number" 
          class="admin-stock-input w-20 md:w-full text-center font-bold text-gray-800 text-xs sm:text-sm bg-gray-50 hover:bg-emerald-50 focus:bg-white border border-transparent hover:border-emerald-200 focus:border-emerald-500 rounded-lg px-2 py-1.5 focus:outline-none transition-colors" 
          value="${p.stock}"
          min="0"
          placeholder="Stok"
        />
      </div>

      <!-- Actions -->
      <div class="col-span-1 flex items-center justify-center gap-2 w-full md:w-auto border-t md:border-none pt-2.5 md:pt-0">
        <button 
          type="button"
          class="admin-save-row-btn bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
          title="Simpan produk ini"
        >
          <i data-lucide="check" class="w-3.5 h-3.5"></i>
          <span class="md:hidden">Simpan</span>
        </button>
      </div>
    `;

    adminProductsList.appendChild(row);

    // Save single row button action
    row.querySelector('.admin-save-row-btn').addEventListener('click', () => {
      const id = p.id;
      const name = row.querySelector('.admin-name-input').value.trim();
      const price = parseInt(row.querySelector('.admin-price-input').value) || 0;
      const stock = parseInt(row.querySelector('.admin-stock-input').value) || 0;

      if (!name) {
        showToast("Nama produk tidak boleh kosong!");
        return;
      }

      const prod = PRODUCTS.find(prod => prod.id === id);
      if (prod) {
        prod.name = name;
        prod.price = price;
        prod.stock = stock;
        
        // Sync with cart if stock drops below selected qty
        const cartItem = cart.find(c => c.id === id);
        if (cartItem && cartItem.quantity > stock) {
          cartItem.quantity = stock;
          if (stock <= 0) {
            cart = cart.filter(c => c.id !== id);
          }
          saveCart();
        }

        localStorage.setItem('warung_bawen_products', JSON.stringify(PRODUCTS));
        renderProducts();
        showToast(`Produk "${prod.name}" berhasil diupdate!`);
      }
    });
  });

  lucide.createIcons();
}

// Save all products inputs from table
function saveAllAdminProducts() {
  const rows = adminProductsList.querySelectorAll('.admin-product-row');
  let hasError = false;

  rows.forEach(row => {
    const id = row.dataset.id;
    const name = row.querySelector('.admin-name-input').value.trim();
    const price = parseInt(row.querySelector('.admin-price-input').value) || 0;
    const stock = parseInt(row.querySelector('.admin-stock-input').value) || 0;

    if (!name) {
      hasError = true;
      return;
    }

    const prod = PRODUCTS.find(p => p.id === id);
    if (prod) {
      prod.name = name;
      prod.price = price;
      prod.stock = stock;

      // Sync with cart if stock drops below selected qty
      const cartItem = cart.find(c => c.id === id);
      if (cartItem && cartItem.quantity > stock) {
        cartItem.quantity = stock;
        if (stock <= 0) {
          cart = cart.filter(c => c.id !== id);
        }
      }
    }
  });

  if (hasError) {
    showToast("Nama produk tidak boleh kosong!");
    return;
  }

  localStorage.setItem('warung_bawen_products', JSON.stringify(PRODUCTS));
  saveCart();
  renderProducts();
  renderAdminProducts();
  showToast("Semua perubahan berhasil disimpan!");
}

// Reset products to default initial ones
function resetAdminProducts() {
  if (confirm("Apakah Anda yakin ingin mengembalikan semua produk ke data awal? Semua perubahan nama, harga, dan stok Anda akan dihapus.")) {
    PRODUCTS = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('warung_bawen_products', JSON.stringify(PRODUCTS));
    
    // Clear cart or adjust to fit new defaults
    cart = [];
    saveCart();

    renderProducts();
    renderAdminProducts();
    showToast("Data produk berhasil di-reset!");
  }
}

// --- EVENT LISTENERS ---

// Open/Close Cart Drawer
cartToggleBtn.addEventListener('click', openCart);
cartToggleMobileBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Open/Close Admin Portal
adminPortalBtn.addEventListener('click', openAdmin);
closeAdminBtn.addEventListener('click', closeAdmin);
adminOverlay.addEventListener('click', (e) => {
  if (e.target === adminOverlay) closeAdmin();
});

// Admin Login
adminLoginBtn.addEventListener('click', loginAdmin);
adminPinInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loginAdmin();
});

// Admin Panel Top Bar actions
adminSearchInput.addEventListener('input', renderAdminProducts);
adminResetDataBtn.addEventListener('click', resetAdminProducts);
adminSaveAllBtn.addEventListener('click', saveAllAdminProducts);

// Search input behavior (Main store)
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  if (searchQuery.trim().length > 0) {
    clearSearchBtn.classList.remove('hidden');
  } else {
    clearSearchBtn.classList.add('hidden');
  }
  renderProducts();
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearSearchBtn.classList.add('hidden');
  renderProducts();
  searchInput.focus();
});

// Checkout & Submit WhatsApp Order
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const buyerName = document.getElementById('checkout-name').value.trim();
  const buyerAddress = document.getElementById('checkout-address').value.trim();
  const buyerPayment = document.getElementById('checkout-payment').value;
  const buyerNotes = document.getElementById('checkout-notes').value.trim() || 'Tidak ada catatan';

  if (!buyerName || !buyerAddress) {
    alert('Harap isi Nama Lengkap dan Alamat Lengkap Pengiriman!');
    return;
  }

  // Calculate items, prices, and check stock availability
  let subtotal = 0;
  let itemsListMessage = '';
  let hasStockError = false;

  // Final check of stock availability before allowing checkout
  cart.forEach((item) => {
    const origProduct = PRODUCTS.find(p => p.id === item.id);
    if (!origProduct || origProduct.stock < item.quantity) {
      alert(`Maaf, stok untuk "${item.name}" tidak mencukupi atau telah berubah. Silakan sesuaikan keranjang belanja Anda.`);
      hasStockError = true;
    }
  });

  if (hasStockError) {
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    itemsListMessage += `${index + 1}. *${item.name}* (${item.quantity}x) - ${formatRupiah(itemTotal)}\n`;

    // Deduct purchased quantities from stock
    const prod = PRODUCTS.find(p => p.id === item.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  // Save the new stocks back to local storage
  localStorage.setItem('warung_bawen_products', JSON.stringify(PRODUCTS));

  const shippingFee = subtotal >= FREE_SHIPPING_MINIMUM ? 0 : FLAT_SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Format the WhatsApp text
  const waMessage = `*PESANAN WARUNG KELONTONG BAWEN*
----------------------------------------
*Hari/Tanggal:* ${today}
*Nama Pembeli:* ${buyerName}
*Alamat Kirim:* ${buyerAddress}
*Metode Bayar:* ${buyerPayment}
*Catatan:* ${buyerNotes}

*DAFTAR BELANJAAN:*
${itemsListMessage}
----------------------------------------
*Subtotal:* ${formatRupiah(subtotal)}
*Ongkos Kirim:* ${shippingFee === 0 ? 'GRATIS ONGKIR' : formatRupiah(shippingFee)}
*TOTAL BAYAR:* *${formatRupiah(grandTotal)}*

_Mohon segera diproses ya Kak, barang dikirim ke alamat saya di atas. Terima kasih!_`;

  // Encode text for WhatsApp API
  const encodedText = encodeURIComponent(waMessage);
  const waLink = `https://api.whatsapp.com/send?phone=${OWNER_WA_NUMBER}&text=${encodedText}`;

  // Clear cart and redirect
  cart = [];
  saveCart();
  renderProducts();
  closeCart();
  checkoutForm.reset();

  showToast('Pesanan siap! Mengalihkan ke WhatsApp...');
  
  // Open WhatsApp in a new tab
  setTimeout(() => {
    window.open(waLink, '_blank');
  }, 1000);
});

// --- INITIALIZER ---
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  updateCartUI();
});
