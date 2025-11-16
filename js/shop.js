// Shop functionality for Mensthetic
class MenstheticShop {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('mensthetic-cart')) || {};
        this.updateCartDisplay();
    }

    addToCart(productId, productName, price) {
        if (this.cart[productId]) {
            this.cart[productId].quantity += 1;
        } else {
            this.cart[productId] = {
                id: productId,
                name: productName,
                price: price,
                quantity: 1
            };
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddedNotification(productName);
        
        // Analytics tracking
        if (window.menstheticAnalytics) {
            window.menstheticAnalytics.trackEvent('product_added_to_cart', {
                product_id: productId,
                product_name: productName,
                price: price
            });
        }
    }

    removeFromCart(productId) {
        if (this.cart[productId]) {
            this.cart[productId].quantity -= 1;
            if (this.cart[productId].quantity <= 0) {
                delete this.cart[productId];
            }
        }
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            delete this.cart[productId];
        } else {
            this.cart[productId].quantity = quantity;
        }
        this.saveCart();
        this.updateCartDisplay();
    }

    clearCart() {
        this.cart = {};
        this.saveCart();
        this.updateCartDisplay();
    }

    saveCart() {
        localStorage.setItem('mensthetic-cart', JSON.stringify(this.cart));
    }

    getCartCount() {
        return Object.values(this.cart).reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal() {
        return Object.values(this.cart).reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartDisplay() {
        // Update cart count in navigation
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.getCartCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }

        // Update cart items display
        this.renderCartItems();
        
        // Update totals
        const cartTotal = document.getElementById('cart-total');
        const checkoutTotal = document.getElementById('checkout-total');
        const total = this.getCartTotal();
        
        if (cartTotal) cartTotal.textContent = `${total}€`;
        if (checkoutTotal) checkoutTotal.textContent = `${total}€`;
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const checkoutItemsContainer = document.getElementById('checkout-items');
        
        if (!cartItemsContainer) return;

        const cartItems = Object.values(this.cart);
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Ihr Warenkorb ist leer</div>';
            if (checkoutItemsContainer) {
                checkoutItemsContainer.innerHTML = '<div class="cart-empty">Keine Artikel im Warenkorb</div>';
            }
            return;
        }

        // Render cart items
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="shop.removeFromCart('${item.id}')">-</button>
                        <span style="margin: 0 var(--menst-s-2); font-weight: 600;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="shop.addToCart('${item.id}', '${item.name}', ${item.price})">+</button>
                    </div>
                </div>
                <div class="cart-item-price">${item.price * item.quantity}€</div>
            </div>
        `).join('');

        // Render checkout items
        if (checkoutItemsContainer) {
            checkoutItemsContainer.innerHTML = cartItems.map(item => `
                <div class="checkout-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>${item.price * item.quantity}€</span>
                </div>
            `).join('');
        }
    }

    showAddedNotification(productName) {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <strong>${productName}</strong> wurde zum Warenkorb hinzugefügt
                <button onclick="toggleCart()" style="margin-left: var(--menst-s-4); padding: var(--menst-s-2) var(--menst-s-3); background: var(--menst-accent); color: white; border: none; border-radius: var(--menst-r-sm); cursor: pointer;">
                    Warenkorb anzeigen
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--menst-success);
            color: white;
            padding: var(--menst-s-4);
            border-radius: var(--menst-r-md);
            box-shadow: var(--menst-shadow-2);
            z-index: 10001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    async submitOrder(formData) {
        const orderData = {
            items: Object.values(this.cart),
            total: this.getCartTotal(),
            customer: formData,
            timestamp: new Date().toISOString(),
            orderId: 'MENST-' + Date.now()
        };

        try {
            // Submit to analytics/backend
            if (window.menstheticAnalytics) {
                await window.menstheticAnalytics.submitOrder(orderData);
            }

            // For now, we'll just show a success message
            // In a real implementation, you'd send this to your backend
            
            return orderData;
        } catch (error) {
            // Error submitting order - propagate to caller
            throw error;
        }
    }
}

// Initialize shop
const shop = new MenstheticShop();

// Global functions for onclick handlers
function addToCart(productId, productName, price) {
    shop.addToCart(productId, productName, price);
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    if (sidebar && overlay) {
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        } else {
            sidebar.classList.add('open');
            overlay.classList.add('open');
        }
    }
}

function openCheckout() {
    if (shop.getCartCount() === 0) {
        alert('Ihr Warenkorb ist leer!');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    const overlay = document.getElementById('checkout-overlay');
    
    if (modal && overlay) {
        modal.classList.add('open');
        overlay.classList.add('open');
        shop.renderCartItems(); // Update checkout items
    }
    
    // Close cart sidebar
    toggleCart();
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    const overlay = document.getElementById('checkout-overlay');
    
    if (modal && overlay) {
        modal.classList.remove('open');
        overlay.classList.remove('open');
    }
}

// Handle checkout form submission
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const customerData = Object.fromEntries(formData.entries());
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.textContent = 'Bestellung wird verarbeitet...';
                submitBtn.disabled = true;
                
                const order = await shop.submitOrder(customerData);
                
                // Show success message
                alert(`Vielen Dank für Ihre Bestellung!\n\nBestellnummer: ${order.orderId}\n\nSie erhalten in Kürze eine Bestätigung per E-Mail.`);
                
                // Clear cart and close modal
                shop.clearCart();
                closeCheckout();
                this.reset();
                
                // Analytics tracking
                if (window.menstheticAnalytics) {
                    window.menstheticAnalytics.trackEvent('order_completed', {
                        order_id: order.orderId,
                        total: order.total,
                        items_count: order.items.length
                    });
                }
                
            } catch (error) {
                alert('Es gab einen Fehler bei der Bestellung. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.');
                // Checkout error occurred
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Handle escape key to close modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cart-sidebar');
        const checkoutModal = document.getElementById('checkout-modal');
        
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            toggleCart();
        }
        
        if (checkoutModal && checkoutModal.classList.contains('open')) {
            closeCheckout();
        }
    }
});

// Export for potential use in other scripts
window.MenstheticShop = MenstheticShop;
window.shop = shop;