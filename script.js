/**
 * Warung Kelontong Bawen - Client Script
 * Vanilla JavaScript implementation for high-speed, modern online minimarket experience.
 */

// ==================== CONFIGURATION ====================
// Ganti nomor WhatsApp pemilik warung di sini (Format internasional tanpa '+' atau spasi)
let OWNER_WA_NUMBER = localStorage.getItem('warung_bawen_wa_number') || '62895351287974'; 
let ADMIN_PIN = localStorage.getItem('warung_bawen_admin_pin') || 'Filiv2212@'; // PIN Keamanan untuk masuk ke Panel Admin
let FREE_SHIPPING_MINIMUM = parseInt(localStorage.getItem('warung_bawen_free_shipping_min')) || 50000;
let FLAT_SHIPPING_FEE = parseInt(localStorage.getItem('warung_bawen_flat_shipping_fee')) || 5000;
let EXTRA_SHIPPING_FEE_PER_KM = parseInt(localStorage.getItem('warung_bawen_extra_shipping_fee_per_km')) || 2000;

const BASE_CATEGORIES = [
  'Beras', 
  'Minyak Goreng', 
  'Telur', 
  'Gula', 
  'Mie Instan', 
  'Minuman', 
  'Snack', 
  'Sabun dan kebutuhan rumah tangga', 
  'Lain-lain'
];
const STORE_COORDS = { lat: -7.2474, lng: 110.4286 }; // Ngawan Lor, Bawen
let leafletMap = null;
let userMarker = null;
let storeMarker = null;
let mapInitialized = false;
let selectedUserCoords = null;
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
let cart = JSON.parse(sessionStorage.getItem('warung_bawen_cart')) || [];
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

// Floating Bottom Cart Bar Elements
const floatingCartBar = document.getElementById('floating-cart-bar');
const floatingCartCount = document.getElementById('floating-cart-count');
const floatingCartSubtotal = document.getElementById('floating-cart-subtotal');
const floatingCartShippingNote = document.getElementById('floating-cart-shipping-note');
const floatingCartActionBtn = document.getElementById('floating-cart-action-btn');

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
  sessionStorage.setItem('warung_bawen_cart', JSON.stringify(cart));
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

// Render dynamic dropdown options in admin panel
function renderAdminCategoryDropdown() {
  const select = document.getElementById('add-prod-category');
  if (!select) return;

  // Ambil kategori unik yang ada di produk saat ini
  const currentCategories = [...new Set(PRODUCTS.map(p => p.category))];

  // Gabungkan kategori dasar dengan kategori yang ada saat ini
  const allCategories = [...new Set([...BASE_CATEGORIES, ...currentCategories])];

  const prevValue = select.value;

  select.innerHTML = '';
  allCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.innerText = cat;
    if (cat === 'Beras' && !prevValue) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  // Tambahkan opsi bikin baru
  const optNew = document.createElement('option');
  optNew.value = '__new_category__';
  optNew.innerText = '+ Buat Kategori Baru...';
  select.appendChild(optNew);

  if (prevValue && (allCategories.includes(prevValue) || prevValue === '__new_category__')) {
    select.value = prevValue;
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
    
    if (floatingCartBar) {
      floatingCartBar.classList.add('translate-y-full');
      setTimeout(() => {
        if (cart.length === 0) {
          floatingCartBar.classList.add('hidden');
        }
      }, 300);
    }
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

    // Distance retrieval
    const distanceValEl = document.getElementById('checkout-distance-value');
    let distance = distanceValEl ? parseFloat(distanceValEl.value) : 1;

    // Shipping fee calculation rules
    const baseShipping = FLAT_SHIPPING_FEE;
    let extraCharge = 0;
    
    if (distance > 5) {
      const extraKm = Math.ceil(distance - 5);
      extraCharge = extraKm * EXTRA_SHIPPING_FEE_PER_KM;
    }
    
    let shippingDiscount = 0;
    let totalShipping = baseShipping + extraCharge;

    if (subtotal >= FREE_SHIPPING_MINIMUM) {
      // Diskon gratis ongkir harian (menghilangkan ongkir dasar)
      shippingDiscount = baseShipping;
      totalShipping = Math.max(0, totalShipping - shippingDiscount);
    }

    const grandTotal = subtotal + totalShipping;

    // Update prices elements
    const summaryDistanceDisplay = document.getElementById('summary-distance-display');
    const summaryShippingBase = document.getElementById('summary-shipping-base');
    const rowShippingExtra = document.getElementById('row-shipping-extra');
    const summaryShippingExtra = document.getElementById('summary-shipping-extra');
    const rowShippingDiscount = document.getElementById('row-shipping-discount');
    const summaryShippingDiscount = document.getElementById('summary-shipping-discount');

    if (summarySubtotal) summarySubtotal.innerText = formatRupiah(subtotal);
    if (summaryDistanceDisplay) summaryDistanceDisplay.innerText = `${distance} KM`;
    if (summaryShippingBase) summaryShippingBase.innerText = formatRupiah(baseShipping);
    
    if (rowShippingExtra) {
      if (extraCharge > 0) {
        rowShippingExtra.classList.remove('hidden');
        if (summaryShippingExtra) summaryShippingExtra.innerText = `+ ${formatRupiah(extraCharge)}`;
      } else {
        rowShippingExtra.classList.add('hidden');
      }
    }
    
    if (rowShippingDiscount) {
      if (shippingDiscount > 0) {
        rowShippingDiscount.classList.remove('hidden');
        if (summaryShippingDiscount) summaryShippingDiscount.innerText = `- ${formatRupiah(shippingDiscount)}`;
      } else {
        rowShippingDiscount.classList.add('hidden');
      }
    }
    
    if (summaryTotal) summaryTotal.innerText = formatRupiah(grandTotal);

    // Free shipping progress bar
    if (subtotal >= FREE_SHIPPING_MINIMUM) {
      progressContainer.className = 'bg-emerald-50 border border-emerald-100 p-3 rounded-xl mb-4';
      progressFill.style.width = '100%';
      progressFill.className = 'h-full bg-emerald-500 rounded-full transition-all duration-300';
      progressText.innerHTML = `🎉 Selamat! Kamu mendapatkan <strong>POTONGAN ONGKIR</strong> khusus area Bawen!`;
    } else {
      const remaining = FREE_SHIPPING_MINIMUM - subtotal;
      const pct = (subtotal / FREE_SHIPPING_MINIMUM) * 100;
      progressContainer.className = 'bg-amber-50 border border-amber-100 p-3 rounded-xl mb-4';
      progressFill.style.width = `${pct}%`;
      progressFill.className = 'h-full bg-amber-500 rounded-full transition-all duration-300';
      progressText.innerHTML = `Belanja <strong>${formatRupiah(remaining)}</strong> lagi untuk diskon ongkir ${formatRupiah(FLAT_SHIPPING_FEE)}!`;
    }

    // Update floating bottom cart bar
    if (floatingCartBar) {
      floatingCartBar.classList.remove('hidden');
      // Let it render first before sliding up
      setTimeout(() => {
        if (cart.length > 0) {
          floatingCartBar.classList.remove('translate-y-full');
        }
      }, 50);

      if (floatingCartCount) floatingCartCount.innerText = totalItems;
      if (floatingCartSubtotal) floatingCartSubtotal.innerText = formatRupiah(subtotal);

      if (floatingCartShippingNote) {
        if (subtotal >= FREE_SHIPPING_MINIMUM) {
          floatingCartShippingNote.innerHTML = `🎉 Selamat! Bebas Ongkir Dasar Bawen aktif!`;
          floatingCartShippingNote.className = 'text-[10px] font-bold text-emerald-600 leading-tight mt-0.5';
        } else {
          const remaining = FREE_SHIPPING_MINIMUM - subtotal;
          floatingCartShippingNote.innerHTML = `Tambah <strong>${formatRupiah(remaining)}</strong> lagi untuk Bebas Ongkir!`;
          floatingCartShippingNote.className = 'text-[10px] font-medium text-amber-600 leading-tight mt-0.5';
        }
      }
    }

    lucide.createIcons();
  }
}

// --- DRAWER ACTIONS ---
function openCart() {
  cartDrawer.classList.remove('translate-x-full');
  cartDrawer.classList.add('translate-x-0');
  cartDrawer.style.transform = 'translateX(0)'; // Force style fallback to fix any rendering / blur issue in iframe
  cartOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Stop background scroll
}

function closeCart() {
  cartDrawer.classList.add('translate-x-full');
  cartDrawer.classList.remove('translate-x-0');
  cartDrawer.style.transform = 'translateX(100%)'; // Force style fallback
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
  
  // Inisialisasi dropdown kategori saat admin dibuka
  renderAdminCategoryDropdown();
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
    renderAdminCategoryDropdown(); // Pastikan dropdown diperbarui setelah login
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
      <div class="col-span-5 flex items-center gap-3 w-full text-left">
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
      <div class="col-span-2 flex items-center justify-between md:justify-end gap-2 w-full md:w-auto text-left">
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
      <div class="col-span-2 flex items-center justify-between md:justify-end gap-2 w-full md:w-auto text-left">
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
      <div class="col-span-1 flex items-center justify-center gap-1.5 w-full md:w-auto border-t md:border-none pt-2.5 md:pt-0">
        <button 
          type="button"
          class="admin-save-row-btn bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white p-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center cursor-pointer"
          title="Simpan produk ini"
        >
          <i data-lucide="check" class="w-4 h-4"></i>
        </button>
        <button 
          type="button"
          class="admin-delete-row-btn bg-red-50 hover:bg-red-600 text-red-600 hover:text-white p-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center cursor-pointer"
          title="Hapus produk ini"
        >
          <i data-lucide="trash-2" class="w-4 h-4"></i>
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

    // Delete single row action
    row.querySelector('.admin-delete-row-btn').addEventListener('click', () => {
      const id = p.id;
      if (confirm(`Apakah Anda yakin ingin menghapus produk "${p.name}"?`)) {
        PRODUCTS = PRODUCTS.filter(prod => prod.id !== id);
        cart = cart.filter(c => c.id !== id);
        localStorage.setItem('warung_bawen_products', JSON.stringify(PRODUCTS));
        saveCart();
        renderProducts();
        renderAdminProducts();
        showToast(`Produk "${p.name}" berhasil dihapus!`);
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

if (floatingCartActionBtn) {
  floatingCartActionBtn.addEventListener('click', openCart);
}

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

// Admin Tabs Switching
const adminTabList = document.getElementById('admin-tab-list');
const adminTabAdd = document.getElementById('admin-tab-add');
const adminListTabContent = document.getElementById('admin-list-tab-content');
const adminAddTabContent = document.getElementById('admin-add-tab-content');

const adminTabSettings = document.getElementById('admin-tab-settings');
const adminTabRecap = document.getElementById('admin-tab-recap');
const adminSettingsTabContent = document.getElementById('admin-settings-tab-content');
const adminRecapTabContent = document.getElementById('admin-recap-tab-content');

function setActiveTab(activeBtn, activeContent) {
  const tabs = [
    { btn: adminTabList, content: adminListTabContent },
    { btn: adminTabAdd, content: adminAddTabContent },
    { btn: adminTabSettings, content: adminSettingsTabContent },
    { btn: adminTabRecap, content: adminRecapTabContent }
  ];

  tabs.forEach(t => {
    if (t.btn && t.content) {
      if (t.btn === activeBtn) {
        t.btn.className = "border-b-2 border-emerald-600 text-emerald-600 font-bold text-xs sm:text-sm py-3 px-1 transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0";
        t.content.classList.remove('hidden');
      } else {
        t.btn.className = "border-b-2 border-transparent text-gray-400 hover:text-gray-600 font-semibold text-xs sm:text-sm py-3 px-1 transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0";
        t.content.classList.add('hidden');
      }
    }
  });
}

if (adminTabList) {
  adminTabList.addEventListener('click', () => {
    setActiveTab(adminTabList, adminListTabContent);
    renderAdminProducts();
  });
}
if (adminTabAdd) {
  adminTabAdd.addEventListener('click', () => {
    setActiveTab(adminTabAdd, adminAddTabContent);
  });
}
if (adminTabSettings) {
  adminTabSettings.addEventListener('click', () => {
    setActiveTab(adminTabSettings, adminSettingsTabContent);
    loadAdminSettingsFormValues();
  });
}
if (adminTabRecap) {
  adminTabRecap.addEventListener('click', () => {
    setActiveTab(adminTabRecap, adminRecapTabContent);
    renderSalesReport();
  });
}

// Add New Product Form Submit with upload photo and custom categories support
let uploadedImageBase64 = "";

const fileInput = document.getElementById('add-prod-file-input');
const fileNameContainer = document.getElementById('add-prod-file-name-container');
const fileNameSpan = document.getElementById('add-prod-file-name');

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit to prevent localStorage overflow
        showToast("Ukuran foto maksimal 2MB!");
        fileInput.value = "";
        if (fileNameContainer) fileNameContainer.classList.add('hidden');
        uploadedImageBase64 = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedImageBase64 = event.target.result;
        if (fileNameSpan) fileNameSpan.innerText = file.name;
        if (fileNameContainer) fileNameContainer.classList.remove('hidden');
        showToast("Foto berhasil dipilih!");
      };
      reader.readAsDataURL(file);
    } else {
      uploadedImageBase64 = "";
      if (fileNameContainer) fileNameContainer.classList.add('hidden');
    }
  });
}

// Listen to category dropdown change
const addProdCategorySelect = document.getElementById('add-prod-category');
const newCategoryInputContainer = document.getElementById('new-category-input-container');
const addProdNewCategoryInput = document.getElementById('add-prod-new-category');

if (addProdCategorySelect) {
  addProdCategorySelect.addEventListener('change', () => {
    if (addProdCategorySelect.value === '__new_category__') {
      newCategoryInputContainer?.classList.remove('hidden');
      addProdNewCategoryInput?.focus();
      addProdNewCategoryInput?.setAttribute('required', 'true');
    } else {
      newCategoryInputContainer?.classList.add('hidden');
      addProdNewCategoryInput?.removeAttribute('required');
    }
  });
}

const adminAddProductForm = document.getElementById('admin-add-product-form');
if (adminAddProductForm) {
  adminAddProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('add-prod-name').value.trim();
    let category = document.getElementById('add-prod-category').value;
    const unit = document.getElementById('add-prod-unit').value.trim();
    const price = parseInt(document.getElementById('add-prod-price').value) || 0;
    const stock = parseInt(document.getElementById('add-prod-stock').value) || 0;
    let image = document.getElementById('add-prod-image').value.trim();
    const bestSeller = document.getElementById('add-prod-bestseller').checked;

    if (!name || !unit) {
      showToast("Nama dan Unit harus diisi!");
      return;
    }

    if (category === '__new_category__') {
      const newCat = addProdNewCategoryInput.value.trim();
      if (!newCat) {
        showToast("Ketik nama kategori baru Anda!");
        return;
      }
      category = newCat;
    }

    if (uploadedImageBase64) {
      image = uploadedImageBase64;
    }

    if (!image) {
      // default fallbacks depending on category
      const catLower = category.toLowerCase();
      if (catLower.includes('beras')) image = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400';
      else if (catLower.includes('minyak')) image = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400';
      else if (catLower.includes('telur')) image = 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=400';
      else if (catLower.includes('gula')) image = 'https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=400';
      else image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400';
    }

    const randomId = 'custom-' + Date.now();
    const newProduct = {
      id: randomId,
      name,
      category,
      price,
      image,
      unit,
      bestSeller,
      stock
    };

    PRODUCTS.unshift(newProduct);
    localStorage.setItem('warung_bawen_products', JSON.stringify(PRODUCTS));

    // Reset uploaded state & UI indicators
    uploadedImageBase64 = "";
    if (fileNameContainer) fileNameContainer.classList.add('hidden');
    newCategoryInputContainer?.classList.add('hidden');
    addProdNewCategoryInput?.removeAttribute('required');

    adminAddProductForm.reset();
    renderCategories();
    renderAdminCategoryDropdown();
    renderProducts();
    renderAdminProducts();
    showToast(`Produk "${name}" berhasil ditambahkan!`);
    
    // Switch tab back to List
    adminTabList.click();
  });
}

// Quick Distance selection buttons
const quickDistBtns = document.querySelectorAll('.btn-quick-dist');
const distanceValInput = document.getElementById('checkout-distance-value');
const distanceDisplayInput = document.getElementById('checkout-distance-display-input');

quickDistBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Reset other buttons' styles
    quickDistBtns.forEach(b => {
      b.className = "btn-quick-dist bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 border border-gray-200/60 hover:border-emerald-200 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer";
    });
    // Active button style
    btn.className = "btn-quick-dist bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer";
    
    const dist = parseFloat(btn.getAttribute('data-dist')) || 1.0;
    const label = btn.getAttribute('data-label') || '';
    
    if (distanceValInput) distanceValInput.value = dist;
    if (distanceDisplayInput) distanceDisplayInput.value = `${dist.toFixed(1)} KM (${label})`;
    
    updateCartUI();
  });
});

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

  // Distance retrieve
  const distanceValEl = document.getElementById('checkout-distance-value');
  let distance = distanceValEl ? parseFloat(distanceValEl.value) : 1;

  const baseShipping = FLAT_SHIPPING_FEE;
  let extraCharge = 0;
  if (distance > 5) {
    const extraKm = Math.ceil(distance - 5);
    extraCharge = extraKm * EXTRA_SHIPPING_FEE_PER_KM;
  }
  let shippingDiscount = 0;
  let totalShipping = baseShipping + extraCharge;

  if (subtotal >= FREE_SHIPPING_MINIMUM) {
    shippingDiscount = baseShipping;
    totalShipping = Math.max(0, totalShipping - shippingDiscount);
  }

  const grandTotal = subtotal + totalShipping;
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Record order to Local Storage for admin recap
  const orders = JSON.parse(localStorage.getItem('warung_bawen_orders') || '[]');
  const newOrder = {
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    buyerName,
    buyerAddress,
    buyerPayment,
    buyerNotes,
    items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
    distance,
    subtotal,
    shippingFee: totalShipping,
    discount: shippingDiscount,
    grandTotal
  };
  orders.push(newOrder);
  localStorage.setItem('warung_bawen_orders', JSON.stringify(orders));

  // Generate Google Maps URL if buyer picked a location on map
  let mapLinkLine = '';
  if (selectedUserCoords) {
    mapLinkLine = `\n*Peta Lokasi Rumah:* https://www.google.com/maps?q=${selectedUserCoords.lat},${selectedUserCoords.lng}\n*Rute dari Toko:* https://www.google.com/maps/dir/-7.2474,110.4286/${selectedUserCoords.lat},${selectedUserCoords.lng}`;
  }

  // Format the WhatsApp text
  const waMessage = `*PESANAN WARUNG KELONTONG BAWEN*
----------------------------------------
*Hari/Tanggal:* ${today}
*Nama Pembeli:* ${buyerName}
*Alamat Kirim:* ${buyerAddress}${mapLinkLine}
*Jarak Kirim:* ${distance} KM
*Metode Bayar:* ${buyerPayment}
*Catatan:* ${buyerNotes}

*DAFTAR BELANJAAN:*
${itemsListMessage}
----------------------------------------
*Subtotal Belanja:* ${formatRupiah(subtotal)}
*Ongkir Dasar (≤ 5 KM):* ${formatRupiah(baseShipping)}
*Tambahan Jarak (> 5 KM):* ${extraCharge > 0 ? '+' + formatRupiah(extraCharge) : 'Rp 0'}
*Potongan Belanja:* ${shippingDiscount > 0 ? '-' + formatRupiah(shippingDiscount) : 'Rp 0'}
*TOTAL ONGKIR:* ${totalShipping === 0 ? 'GRATIS ONGKIR' : formatRupiah(totalShipping)}
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
  selectedUserCoords = null; // Reset map coordinates for next session

  showToast('Pesanan siap! Mengalihkan ke WhatsApp...');
  
  // Open WhatsApp in a new tab
  setTimeout(() => {
    window.open(waLink, '_blank');
  }, 1000);
});

// ==================== INTERACTIVE MAPS & GEOLOCATION (OPENSTREETMAP) ====================

// Calculate distance via Haversine formula
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Update UI and distance based on coordinates
function updateLocationFromCoords(lat, lng, knownAddressName = null) {
  selectedUserCoords = { lat, lng };
  const mapStatusTextElement = document.getElementById('map-status-text');
  const addressTextareaElement = document.getElementById('checkout-address');

  // Calculate straight line distance
  const straightDistance = getHaversineDistance(STORE_COORDS.lat, STORE_COORDS.lng, lat, lng);
  // Scale straight line distance by 1.3 to estimate actual driving road distance
  let roadDistance = Math.round((straightDistance * 1.3) * 10) / 10;
  if (roadDistance < 0.5) roadDistance = 0.5; // Minimum 0.5 KM

  // Update inputs
  const distanceValEl = document.getElementById('checkout-distance-value');
  const distanceDisplayEl = document.getElementById('checkout-distance-display-input');
  if (distanceValEl) distanceValEl.value = roadDistance;
  if (distanceDisplayEl) {
    distanceDisplayEl.value = `${roadDistance.toFixed(1)} KM (Dihitung dari Peta)`;
  }
  
  // Unselect all quick-region buttons
  const qDistBtns = document.querySelectorAll('.btn-quick-dist');
  qDistBtns.forEach(b => {
    b.className = "btn-quick-dist bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 border border-gray-200/60 hover:border-emerald-200 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer";
  });

  // Live recalculate shipping prices & grand total
  updateCartUI();

  if (mapStatusTextElement) {
    mapStatusTextElement.innerText = `Jarak terpilih: ${roadDistance} KM. Mengambil detail alamat...`;
  }

  if (knownAddressName) {
    if (addressTextareaElement) addressTextareaElement.value = knownAddressName;
    if (mapStatusTextElement) {
      mapStatusTextElement.innerText = `Jarak terpilih: ${roadDistance} KM. Alamat diupdate!`;
    }
  } else {
    // Reverse geocode to get a readable address name using free OpenStreetMap Nominatim API
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    fetch(url, {
      headers: {
        'Accept-Language': 'id'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.display_name) {
          let formattedAddr = data.display_name;
          if (addressTextareaElement) {
            addressTextareaElement.value = formattedAddr;
            // Highlight changes briefly to indicate auto-completion
            addressTextareaElement.classList.add('bg-emerald-50');
            setTimeout(() => addressTextareaElement.classList.remove('bg-emerald-50'), 1000);
          }
          if (mapStatusTextElement) {
            mapStatusTextElement.innerText = `Jarak terpilih: ${roadDistance} KM. Alamat berhasil diupdate!`;
          }
        } else {
          if (mapStatusTextElement) {
            mapStatusTextElement.innerText = `Jarak terpilih: ${roadDistance} KM.`;
          }
        }
      })
      .catch(err => {
        console.error('Reverse geocode error:', err);
        if (mapStatusTextElement) {
          mapStatusTextElement.innerText = `Jarak terpilih: ${roadDistance} KM.`;
        }
      });
  }
}

// Search for address in the map search field
function searchMapAddress() {
  const queryInput = document.getElementById('map-search-input');
  if (!queryInput) return;

  const query = queryInput.value.trim();
  if (!query) {
    showToast('Silakan masukkan nama jalan atau desa!');
    return;
  }

  const mapStatusTextElement = document.getElementById('map-status-text');
  if (mapStatusTextElement) mapStatusTextElement.innerText = 'Mencari lokasi...';

  // Add region context to make search highly relevant to the store's area
  const fullQuery = query.toLowerCase().includes('bawen') ? query : `${query}, Bawen, Kabupaten Semarang`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&limit=1`;

  fetch(url)
    .then(res => res.json())
    .then(results => {
      if (results && results.length > 0) {
        const place = results[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        if (leafletMap && userMarker) {
          leafletMap.setView([lat, lng], 15);
          userMarker.setLatLng([lat, lng]);
          updateLocationFromCoords(lat, lng, place.display_name);
        }
      } else {
        if (mapStatusTextElement) mapStatusTextElement.innerText = 'Lokasi tidak ditemukan. Coba ketik dengan kata kunci lain.';
        showToast('Lokasi tidak ditemukan! Coba nama jalan atau kelurahan.');
      }
    })
    .catch(err => {
      console.error('Geocode search error:', err);
      if (mapStatusTextElement) mapStatusTextElement.innerText = 'Gagal menghubungi server pencarian.';
    });
}

// Initialize Leaflet Map
function initLeafletMap() {
  if (mapInitialized) {
    // Invalidate map layout size to force proper dimensions in iframes
    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 150);
    return;
  }

  const mapElement = document.getElementById('checkout-map');
  if (!mapElement) return;

  const mapStatusTextElement = document.getElementById('map-status-text');

  try {
    // Center at Bawen Store
    leafletMap = L.map('checkout-map').setView([STORE_COORDS.lat, STORE_COORDS.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Color marker icons
    const storeIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const userIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Store marker setup
    storeMarker = L.marker([STORE_COORDS.lat, STORE_COORDS.lng], { icon: storeIcon }).addTo(leafletMap);
    storeMarker.bindPopup('<b class="text-xs text-emerald-700">Warung Kelontong Bawen (Toko)</b><br><span class="text-[10px] text-gray-500">Ngawan Lor RT 02 RW 05 Bawen</span>').openPopup();

    // User marker setup
    userMarker = L.marker([STORE_COORDS.lat - 0.003, STORE_COORDS.lng + 0.003], {
      icon: userIcon,
      draggable: true
    }).addTo(leafletMap);
    userMarker.bindPopup('<b class="text-xs text-blue-700">Rumah Anda (Geser Saya!)</b>').openPopup();

    // Handle drag end events
    userMarker.on('dragend', function () {
      const pos = userMarker.getLatLng();
      updateLocationFromCoords(pos.lat, pos.lng);
    });

    // Handle direct clicks on map
    leafletMap.on('click', function (e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      userMarker.setLatLng([lat, lng]);
      updateLocationFromCoords(lat, lng);
    });

    mapInitialized = true;
    if (mapStatusTextElement) mapStatusTextElement.innerText = 'Peta berhasil dimuat! Silakan geser pin biru atau ketik alamat.';
    
    // Invalidate map sizing to prevent clipping inside dynamic frames
    setTimeout(() => {
      leafletMap.invalidateSize();
    }, 250);

  } catch (error) {
    console.error('Error initializing Leaflet map:', error);
    if (mapStatusTextElement) mapStatusTextElement.innerText = 'Gagal memuat peta. Silakan isi alamat secara manual.';
  }
}

// Get HTML5 Geolocation
function getGPSLocation() {
  const mapStatusTextElement = document.getElementById('map-status-text');
  
  if (!navigator.geolocation) {
    showToast('Perangkat Anda tidak mendukung GPS / Geolocation!');
    return;
  }

  showToast('Sedang mencari sinyal GPS Anda...');
  if (mapStatusTextElement) mapStatusTextElement.innerText = 'Mencari sinyal GPS Anda...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Make map visible
      const mapContainerElement = document.getElementById('map-picker-container');
      if (mapContainerElement) {
        mapContainerElement.classList.remove('hidden');
        initLeafletMap();
      }

      // Center map and user pin
      if (leafletMap && userMarker) {
        leafletMap.setView([lat, lng], 16);
        userMarker.setLatLng([lat, lng]);
      }

      // Calculate distance and geocode address name
      updateLocationFromCoords(lat, lng);
      showToast('Lokasi GPS berhasil didapatkan!');
    },
    (error) => {
      console.error('GPS Error:', error);
      let errMsg = 'Gagal mengambil GPS.';
      if (error.code === error.PERMISSION_DENIED) {
        errMsg = 'Izin akses GPS ditolak oleh sistem.';
      }
      showToast(errMsg);
      if (mapStatusTextElement) {
        mapStatusTextElement.innerText = errMsg + ' Silakan pilih lokasi secara manual lewat peta.';
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Setup Maps and GPS Listeners
const btnGetGps = document.getElementById('btn-get-gps');
const btnToggleMap = document.getElementById('btn-toggle-map');
const btnCloseMap = document.getElementById('btn-close-map');
const btnMapSearch = document.getElementById('btn-map-search');
const mapSearchInput = document.getElementById('map-search-input');
const mapContainer = document.getElementById('map-picker-container');

if (btnGetGps) {
  btnGetGps.addEventListener('click', getGPSLocation);
}

if (btnToggleMap) {
  btnToggleMap.addEventListener('click', () => {
    if (mapContainer) {
      if (mapContainer.classList.contains('hidden')) {
        mapContainer.classList.remove('hidden');
        initLeafletMap();
        showToast('Membuka peta lokasi...');
      } else {
        mapContainer.classList.add('hidden');
      }
    }
  });
}

if (btnCloseMap) {
  btnCloseMap.addEventListener('click', () => {
    mapContainer?.classList.add('hidden');
  });
}

if (btnMapSearch) {
  btnMapSearch.addEventListener('click', searchMapAddress);
}

if (mapSearchInput) {
  mapSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchMapAddress();
    }
  });
}

// ==================== CUSTOMER REVIEWS SYSTEM ====================
const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Ibu Siti Rahayu',
    rating: 5,
    comment: 'Sangat puas belanja di sini! Beras premiumnya pulen dan wangi banget. Harganya murah, langsung diantar cepat ke depan rumah. COD jadi aman sekali.',
    date: '10 Juli 2026',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Pak Budi Santoso',
    rating: 5,
    comment: 'Pengiriman sangat kilat, sabun dan mie instan lengkap semua. Penjual sangat ramah melayani di WhatsApp. Recommended banget buat warga Bawen!',
    date: '12 Juli 2026',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Mbak Dewi Lestari',
    rating: 5,
    comment: 'Biasa beli beras dan minyak goreng bulanan di sini. Selalu fresh, timbangan pas dan jujur. Terima kasih banyak Warung Kelontong Bawen.',
    date: '13 Juli 2026',
    verified: true
  }
];

let CUSTOM_REVIEWS = JSON.parse(localStorage.getItem('warung_bawen_reviews'));
if (!CUSTOM_REVIEWS) {
  CUSTOM_REVIEWS = INITIAL_REVIEWS;
  localStorage.setItem('warung_bawen_reviews', JSON.stringify(CUSTOM_REVIEWS));
}

// Render stars utility
function generateStarsHtml(rating) {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHtml += `<i data-lucide="star" class="w-3.5 h-3.5 text-amber-400 fill-current"></i>`;
    } else {
      starsHtml += `<i data-lucide="star" class="w-3.5 h-3.5 text-gray-200"></i>`;
    }
  }
  return starsHtml;
}

// Render reviews list & calculation
function renderReviews() {
  const listContainer = document.getElementById('reviews-list-container');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  // Sort: newer reviews first
  const sortedReviews = [...CUSTOM_REVIEWS].reverse();

  sortedReviews.forEach(rev => {
    const dateStr = rev.date;
    const initialLetter = rev.author ? rev.author.charAt(0).toUpperCase() : 'P';
    
    // Generate avatar color based on name initials
    const colors = ['bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-teal-100 text-teal-700'];
    const colorIndex = (rev.author ? rev.author.charCodeAt(0) : 0) % colors.length;
    const avatarColorClass = colors[colorIndex];

    const reviewCard = document.createElement('div');
    reviewCard.className = 'bg-gray-50/50 border border-gray-100 p-4 rounded-2xl space-y-2.5 hover:border-gray-200/80 transition-all';
    reviewCard.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-full ${avatarColorClass} font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
            ${initialLetter}
          </div>
          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs font-bold text-gray-800">${rev.author}</span>
              ${rev.verified ? `
                <span class="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                  <i data-lucide="badge-check" class="w-2.5 h-2.5 fill-current text-emerald-600"></i>
                  Terverifikasi
                </span>
              ` : ''}
            </div>
            <span class="text-[9px] text-gray-400 font-medium">${dateStr}</span>
          </div>
        </div>
        
        <!-- Stars rating -->
        <div class="flex gap-0.5">
          ${generateStarsHtml(rev.rating)}
        </div>
      </div>
      
      <p class="text-xs text-gray-600 leading-relaxed font-medium pl-1">${rev.comment}</p>
    `;
    listContainer.appendChild(reviewCard);
  });

  // Calculate stats
  const totalCount = CUSTOM_REVIEWS.length;
  document.getElementById('total-reviews-count').innerText = `Berdasarkan ${totalCount} ulasan pelanggan`;

  let sumRating = 0;
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  CUSTOM_REVIEWS.forEach(rev => {
    sumRating += rev.rating;
    if (ratingDistribution[rev.rating] !== undefined) {
      ratingDistribution[rev.rating]++;
    }
  });

  const avgRating = totalCount > 0 ? Math.round((sumRating / totalCount) * 10) / 10 : 0;
  document.getElementById('avg-rating-big').innerText = avgRating.toFixed(1);

  // Update big average stars container
  const avgStarsContainer = document.getElementById('avg-stars-container');
  if (avgStarsContainer) {
    avgStarsContainer.innerHTML = '';
    const roundedAvg = Math.round(avgRating);
    for (let i = 1; i <= 5; i++) {
      const starIcon = document.createElement('i');
      starIcon.setAttribute('data-lucide', 'star');
      if (i <= roundedAvg) {
        starIcon.className = 'w-4 h-4 text-amber-400 fill-current';
      } else {
        starIcon.className = 'w-4 h-4 text-gray-200';
      }
      avgStarsContainer.appendChild(starIcon);
    }
  }

  // Update bar and count displays for stars
  for (let r = 1; r <= 5; r++) {
    const count = ratingDistribution[r];
    const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    
    const countEl = document.getElementById(`count-${r}-star`);
    const barEl = document.getElementById(`bar-${r}-star`);

    if (countEl) countEl.innerText = count;
    if (barEl) barEl.style.width = `${pct}%`;
  }

  // Reload lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Setup reviews panel listener
const btnToggleReviewForm = document.getElementById('btn-toggle-review-form');
const reviewFormContainer = document.getElementById('review-form-container');
const btnCancelReview = document.getElementById('btn-cancel-review');
const addReviewForm = document.getElementById('add-review-form');
const starRatingSelector = document.getElementById('star-rating-selector');
const reviewRatingValueInput = document.getElementById('review-rating-value');
const starRatingText = document.getElementById('star-rating-text');

if (btnToggleReviewForm && reviewFormContainer) {
  btnToggleReviewForm.addEventListener('click', () => {
    reviewFormContainer.classList.toggle('hidden');
    if (!reviewFormContainer.classList.contains('hidden')) {
      document.getElementById('review-author').focus();
    }
  });
}

if (btnCancelReview && reviewFormContainer) {
  btnCancelReview.addEventListener('click', () => {
    reviewFormContainer.classList.add('hidden');
    addReviewForm.reset();
    resetStarRatingInput();
  });
}

// Handles rating input click interaction
if (starRatingSelector) {
  const ratingTexts = {
    1: 'Kecewa (1/5)',
    2: 'Kurang Puas (2/5)',
    3: 'Biasa Saja (3/5)',
    4: 'Puas (4/5)',
    5: 'Sangat Puas (5/5)'
  };

  const starButtons = starRatingSelector.querySelectorAll('button');
  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedRating = parseInt(btn.getAttribute('data-rating')) || 5;
      reviewRatingValueInput.value = selectedRating;
      if (starRatingText) starRatingText.innerText = ratingTexts[selectedRating];

      // Re-style stars
      starButtons.forEach(starBtn => {
        const rVal = parseInt(starBtn.getAttribute('data-rating'));
        const starIcon = starBtn.querySelector('i');
        if (starIcon) {
          if (rVal <= selectedRating) {
            starIcon.classList.add('fill-current', 'text-amber-400');
            starIcon.classList.remove('text-gray-200');
          } else {
            starIcon.classList.remove('fill-current', 'text-amber-400');
            starIcon.classList.add('text-gray-200');
          }
        }
      });
    });
  });
}

function resetStarRatingInput() {
  if (reviewRatingValueInput) reviewRatingValueInput.value = '5';
  if (starRatingText) starRatingText.innerText = 'Sangat Puas (5/5)';
  if (starRatingSelector) {
    const starButtons = starRatingSelector.querySelectorAll('button');
    starButtons.forEach(starBtn => {
      const starIcon = starBtn.querySelector('i');
      if (starIcon) {
        starIcon.classList.add('fill-current', 'text-amber-400');
        starIcon.classList.remove('text-gray-200');
      }
    });
  }
}

// Review form submit
if (addReviewForm) {
  addReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const author = document.getElementById('review-author').value.trim();
    const comment = document.getElementById('review-comment').value.trim();
    const rating = parseInt(reviewRatingValueInput.value) || 5;

    if (!author || !comment) {
      showToast('Harap lengkapi semua isian formulir ulasan!');
      return;
    }

    const todayOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = new Date().toLocaleDateString('id-ID', todayOptions);

    const newReview = {
      id: 'rev-' + Date.now(),
      author: author,
      rating: rating,
      comment: comment,
      date: dateFormatted,
      verified: false
    };

    CUSTOM_REVIEWS.push(newReview);
    localStorage.setItem('warung_bawen_reviews', JSON.stringify(CUSTOM_REVIEWS));

    // Reset, close and re-render
    addReviewForm.reset();
    resetStarRatingInput();
    reviewFormContainer.classList.add('hidden');
    
    renderReviews();
    showToast('Terima kasih! Ulasan Anda berhasil dikirim.');
  });
}

// --- ADMIN SETTINGS & SALES RECAP FUNCTIONS ---
function loadAdminSettingsFormValues() {
  const waInput = document.getElementById('settings-wa-number');
  const flatFeeInput = document.getElementById('settings-flat-fee');
  const extraFeeInput = document.getElementById('settings-extra-fee');
  const freeMinInput = document.getElementById('settings-free-min');
  const pinInput = document.getElementById('settings-pin');

  if (waInput) waInput.value = OWNER_WA_NUMBER;
  if (flatFeeInput) flatFeeInput.value = FLAT_SHIPPING_FEE;
  if (extraFeeInput) extraFeeInput.value = EXTRA_SHIPPING_FEE_PER_KM;
  if (freeMinInput) freeMinInput.value = FREE_SHIPPING_MINIMUM;
  if (pinInput) pinInput.value = ADMIN_PIN;
}

const adminSettingsForm = document.getElementById('admin-settings-form');
if (adminSettingsForm) {
  adminSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const waVal = document.getElementById('settings-wa-number').value.trim();
    const flatFeeVal = parseInt(document.getElementById('settings-flat-fee').value) || 0;
    const extraFeeVal = parseInt(document.getElementById('settings-extra-fee').value) || 0;
    const freeMinVal = parseInt(document.getElementById('settings-free-min').value) || 0;
    const pinVal = document.getElementById('settings-pin').value.trim();

    if (!waVal || !pinVal) {
      showToast('Harap isi semua kolom!');
      return;
    }

    OWNER_WA_NUMBER = waVal;
    FLAT_SHIPPING_FEE = flatFeeVal;
    EXTRA_SHIPPING_FEE_PER_KM = extraFeeVal;
    FREE_SHIPPING_MINIMUM = freeMinVal;
    ADMIN_PIN = pinVal;

    localStorage.setItem('warung_bawen_wa_number', waVal);
    localStorage.setItem('warung_bawen_flat_shipping_fee', flatFeeVal);
    localStorage.setItem('warung_bawen_extra_shipping_fee_per_km', extraFeeVal);
    localStorage.setItem('warung_bawen_free_shipping_min', freeMinVal);
    localStorage.setItem('warung_bawen_admin_pin', pinVal);

    showToast('Konfigurasi toko berhasil diperbarui!');
    updateCartUI();
  });
}

function renderSalesReport() {
  const period = document.getElementById('recap-period-select')?.value || 'today';
  const orders = JSON.parse(localStorage.getItem('warung_bawen_orders') || '[]');
  
  const now = new Date();
  
  // Filter based on period
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp);
    if (isNaN(orderDate.getTime())) return false;

    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (period === 'today') {
      return orderDate.toDateString() === now.toDateString();
    } else if (period === 'week') {
      return diffDays <= 7;
    } else if (period === 'month') {
      return diffDays <= 30;
    }
    return true; // 'all'
  });

  // Calculate statistics
  let totalRevenue = 0;
  let totalOrders = filteredOrders.length;
  
  filteredOrders.forEach(order => {
    totalRevenue += order.grandTotal;
  });

  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Render stats
  const statRevenueEl = document.getElementById('recap-stat-revenue');
  const statOrdersEl = document.getElementById('recap-stat-orders');
  const statAvgEl = document.getElementById('recap-stat-avg');

  if (statRevenueEl) statRevenueEl.innerText = formatRupiah(totalRevenue);
  if (statOrdersEl) statOrdersEl.innerText = totalOrders;
  if (statAvgEl) statAvgEl.innerText = formatRupiah(avgOrderValue);

  // Render rows
  const rowsContainer = document.getElementById('recap-orders-rows');
  const emptyState = document.getElementById('recap-empty-state');
  
  if (rowsContainer) {
    rowsContainer.innerHTML = '';
    
    if (filteredOrders.length === 0) {
      emptyState?.classList.remove('hidden');
    } else {
      emptyState?.classList.add('hidden');
      
      // Sort orders descending by timestamp
      filteredOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      filteredOrders.forEach(order => {
        const orderDate = new Date(order.timestamp);
        const dateStr = orderDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const timeStr = orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        // Items preview
        const itemsPreview = order.items.map(it => `${it.name} (${it.quantity}x)`).join(', ');

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50/60 transition-colors border-b border-gray-50';
        tr.innerHTML = `
          <td class="py-3 px-3 text-left">
            <div class="font-bold text-gray-700">${order.id}</div>
            <div class="text-[9px] text-gray-400 font-medium">${dateStr} • ${timeStr}</div>
          </td>
          <td class="py-3 px-3 font-semibold text-gray-700 text-left">${order.buyerName}</td>
          <td class="py-3 px-3 text-gray-500 max-w-[200px] truncate text-left" title="${itemsPreview}">${itemsPreview}</td>
          <td class="py-3 px-3 text-right">
            <div class="text-gray-600 font-medium">Ongkir: ${formatRupiah(order.shippingFee)}</div>
            ${order.discount > 0 ? `<div class="text-emerald-600 text-[10px] font-bold">Diskon: -${formatRupiah(order.discount)}</div>` : ''}
          </td>
          <td class="py-3 px-3 text-right font-extrabold text-emerald-700">${formatRupiah(order.grandTotal)}</td>
          <td class="py-3 px-3 text-center">
            <button 
              type="button" 
              class="btn-delete-order text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center mx-auto" 
              data-id="${order.id}"
              title="Hapus Transaksi"
            >
              <i data-lucide="trash" class="w-4 h-4"></i>
            </button>
          </td>
        `;
        rowsContainer.appendChild(tr);
      });
      
      // Add delete buttons listeners
      rowsContainer.querySelectorAll('.btn-delete-order').forEach(btn => {
        btn.addEventListener('click', () => {
          const orderId = btn.getAttribute('data-id');
          if (confirm(`Apakah Anda yakin ingin menghapus transaksi ${orderId}?`)) {
            let allOrders = JSON.parse(localStorage.getItem('warung_bawen_orders') || '[]');
            allOrders = allOrders.filter(o => o.id !== orderId);
            localStorage.setItem('warung_bawen_orders', JSON.stringify(allOrders));
            showToast(`Transaksi ${orderId} dihapus`);
            renderSalesReport();
          }
        });
      });
    }
  }

  lucide.createIcons();
}

const recapPeriodSelect = document.getElementById('recap-period-select');
if (recapPeriodSelect) {
  recapPeriodSelect.addEventListener('change', renderSalesReport);
}

const btnClearRecap = document.getElementById('btn-clear-recap');
if (btnClearRecap) {
  btnClearRecap.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus SELURUH riwayat transaksi penjualan? Tindakan ini tidak dapat dibatalkan!')) {
      localStorage.removeItem('warung_bawen_orders');
      showToast('Seluruh riwayat penjualan telah dihapus');
      renderSalesReport();
    }
  });
}

// --- INITIALIZER ---
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  updateCartUI();
  renderReviews();
});
