const containerCards = document.getElementById('containerCards')
let currentUser = JSON.parse(localStorage.getItem('currentUser'))
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount;
if (!Array.isArray(cart)) {
    cart = [];
}
if (!currentUser) {
    setTimeout(() => {
        window.location.href = '../pages/login.html';
    }, 1000);
    // alert('You are not logged in. Please log in.');
    showToast("You are not logged in. Please log in.", "error");
} else {
    const userName = document.querySelectorAll('.userName')
    cartCount = document.querySelectorAll('.cartCount')
    const logOut = document.querySelectorAll('.logOut')

    if (cartCount.length > 0) {
        cartCount.forEach(button => {
            button.innerHTML = cart.length
        })
    }

    if (userName.length > 0) {
        userName.forEach(button => {
            button.innerHTML = currentUser.name
        })
    }



    const btn = document.querySelector("button.mobile-menu-button");
    const menu = document.querySelector(".mobile-menu");

    btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });
    if (logOut.length > 0) {
        logOut.forEach(button => {
            button.addEventListener("click", () => {
                localStorage.removeItem('currentUser')
                window.location.href = '../pages/login.html';
            });
        })
    }
}

let products = []

const spinner = document.getElementById('spinner');
async function fetchProduct() {

    try {
        containerCards.classList.remove('hidden')
        spinner.classList.add('hidden')
        const response = await fetch('https://dummyjson.com/products')
        const data = await response.json()
        products = data?.products
        spinner.classList.add('hidden');
        containerCards.classList.remove('hidden');

        products.map((product) => {

            const productList = `
   <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col  max-w-[375px]  w-full  h-full">
    <div class="relative">
        <img src="${product.images[0]}" alt="${product.title}" class="w-full h-48 object-cover" />
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-50"></div>
        <span class="absolute top-2 right-2 bg-[#10B981] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            ${product.availabilityStatus}
        </span>
        <span class="absolute bottom-2 left-2 bg-[#F59E0B] text-white px-3 py-1 rounded-full text-xs font-semibold">
            ${product.discountPercentage}% OFF
        </span>
    </div>
    <div class="p-6 flex-grow">
        <div class="flex justify-between items-start mb-2">
            <h2 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">${product.title}</h2>
        </div>
        <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-blue-500">$${product.price}</span>
            <div class="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <i class="fas fa-star text-accent mr-1"></i>
                <span class="text-gray-700 font-semibold">${product.rating}</span>
                <span class="text-gray-500 text-sm ml-1">(${product.reviews.length} reviews)</span>
            </div>
        </div>
        <div class="flex justify-between items-center mb-4 text-sm text-gray-600">
            <span class="flex items-center"><i class="fas fa-box text-[#3B82F6] mr-2"></i> Stock: ${product.stock}</span>
            <span class="flex items-center"><i class="fas fa-weight-hanging text-[#3B82F6] mr-2"></i> Weight: ${product.weight}</span>
        </div>
        <div class="flex justify-between items-center mb-4 text-sm text-gray-600">
            <span class="flex items-center"><i class="fas fa-truck text-[#3B82F6] mr-2"></i> ${product.shippingInformation}</span>
            <span class="flex items-center"><i class="fas fa-tag text-[#3B82F6] mr-2"></i> ${product.category}</span>
        </div>
    </div>
    <div class="px-6 py-3 mt-auto">
        <button onclick="addToCart(${product.id})" id="buttonCart" class="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center">
            <i class="fas fa-cart-plus mr-2"></i>
            <span id="${product.id}" class="cartAddDelete">Add to Cart</span>
        </button>
    </div>
</div>
            `;
            containerCards.innerHTML += productList
            const cartAddDelete = document.getElementById(product.id) || ""
            let cartProduct = cart.find((item) => item.id === product.id)
            if (cartProduct) {
                cartAddDelete.innerText = "Remove from Cart";
            } else {
                cartAddDelete.innerText = "Add to Cart";
            }
        })
    } catch (error) {
        console.log(error);
    }
}
fetchProduct()
console.log(products, "productListproductListproductList");
function showToast(message, type) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "center",
        className: "text-white font-semibold px-6 py-3 w-96 rounded-lg",
        backgroundColor: type === "success" ? "#10B981" : "#EF4444",
    }).showToast();
}
function addToCart(productId) {
    const cartAddDeletee = document.getElementById(productId) || ""

    console.log(productId, "product");
    let product = products.find((item) => item.id === productId)
    let cartProduct = cart.find((item) => item.id === product.id)
    let cartProductIndex = cart.findIndex((item) => item.id === product.id);

    if (cartProduct) {
        cart.splice(cartProductIndex, 1)
        localStorage.setItem('cart', JSON.stringify(cart))
        cartCount.forEach(button => {
            button.innerHTML = cart.length
        })
        cartAddDeletee.innerText = "Add to Cart";
        showToast("Item removed from cart", "error");
    } else {
        cart.push(product)
        localStorage.setItem('cart', JSON.stringify(cart))

        cartCount.forEach(button => {
            button.innerHTML = cart.length
        })
        cartAddDeletee.innerText = "Remove from Cart";
        showToast("Item added to cart", "success");
    }

}
let cartContainer = document.getElementById('cartContainer')
let totalAmount = document.getElementById('totalAmount')
let subTotal = document.getElementById('subTotal')
let cartTable = document.getElementById('cartTable')
let orderSummary = document.getElementById('orderSummary')
let emptyCart = document.getElementById('emptyCart')
function getCartItem() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden')
        cartTable.classList.add('hidden')
        orderSummary.classList.add('hidden')
    }
    cart.forEach((item, index) => {
        const cartProducts = `
                         <div class="flex items-center space-x-4 py-4 border-b">
                                <img class="w-16 h-16 object-cover rounded-md"
                                    src="${item.images[0]}"
                                    alt="${item.title}">
                                <div class="flex-grow">
                                    <h3 class="text-lg font-semibold text-gray-900">${item.title}</h3>
                                    <p class="text-sm text-gray-600">Category: ${item.category}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-lg font-bold text-blue-600">$${item.price}</p>
                                    <button onclick="deleteProductCart(${index})"
                                        class="text-red-600 hover:text-red-800 transition duration-150 ease-in-out text-sm mt-1">
                                        <i class="fas fa-trash mr-1"></i> Remove
                                    </button>
                                </div>
                            </div>
`;
        cartContainer.innerHTML += cartProducts

    })

}

getCartItem()
calculateTotal()
function calculateTotal() {
    const total = cart.reduce((acc, item) => acc + item.price, 0)
    totalAmount.innerHTML = `$ ${Math.ceil(total) + 15}`
    subTotal.innerHTML = Math.ceil(total)
}

function deleteProductCart(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            cartCount.forEach(button => button.innerHTML = cart.length);
            cartContainer.innerHTML = '';
            getCartItem();
            calculateTotal();
            Swal.fire('Deleted!', 'Item has been removed from the cart.', 'success');
        }
    });
}
