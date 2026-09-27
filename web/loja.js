// =====================================================
// PRODUTOS
// =====================================================

const products = [
    {
        id: 1,
        name: "Camiseta Premium Oversized",
        category: "roupas",
        image: "over.jpg",
        price: 39.90,
        minimum: 10
    },

    {
        id: 2,
        name: "Kit 3 Camisetas Básicas",
        category: "kits",
        image: "3camisa.jpg",
        price: 89.90,
        minimum: 5
    },

    {
        id: 3,
        name: "Perfume Importado Noir",
        category: "perfumes",
        image: "noir.jpg",
        price: 54.90,
        minimum: 6
    },

    {
        id: 4,
        name: "Perfume Importado Blue",
        category: "perfumes",
        image: "blue.jpg",
        price: 59.90,
        minimum: 6
    },

    {
        id: 5,
        name: "Moletom Street Premium",
        category: "roupas",
        image: "moletom.jpg",
        price: 79.90,
        minimum: 5
    },

    {
        id: 6,
        name: "Boné Street Original",
        category: "acessorios",
        image: "bone.jpg",
        price: 29.90,
        minimum: 10
    },

    {
        id: 7,
        name: "Kit Revendedor 10 Peças",
        category: "kits",
        image: "10blusa.jpg",
        price: 299.90,
        minimum: 1
    },

    {
        id: 8,
        name: "Óculos Fashion",
        category: "acessorios",
        image: "oculos.jpg",
        price: 34.90,
        minimum: 10
    },

    {
        id: 9,
        name: "Camiseta Basic Premium",
        category: "roupas",
        image: "camisa.jpg",
        price: 34.90,
        minimum: 10
    },

    {
        id: 10,
        name: "Kit 5 Perfumes",
        category: "kits",
        image: "5perfume.jpg",
        price: 229.90,
        minimum: 1
    },

    {
        id: 11,
        name: "Perfume Importado Gold",
        category: "perfumes",
        image: "gold.jpg",
        price: 64.90,
        minimum: 6
    },

    {
        id: 12,
        name: "Shoulder Bag Street",
        category: "acessorios",
        image: "bag.jpg",
        price: 39.90,
        minimum: 10
    }
];


// =====================================================
// VARIÁVEIS
// =====================================================

let cart = [];

let currentCategory = "todos";


// =====================================================
// ELEMENTOS
// =====================================================

const productsEl =
    document.getElementById("products");

const searchInput =
    document.getElementById("searchInput");

const resultInfo =
    document.getElementById("resultInfo");

const cartCount =
    document.getElementById("cartCount");

const cartPanel =
    document.getElementById("cartPanel");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const overlay =
    document.getElementById("overlay");

const toast =
    document.getElementById("toast");


// =====================================================
// FORMATA DINHEIRO
// =====================================================

function money(value) {

    return value.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


// =====================================================
// NOME DA CATEGORIA
// =====================================================

function categoryName(category) {

    const names = {

        roupas: "ROUPAS",

        perfumes: "PERFUMES",

        acessorios: "ACESSÓRIOS",

        kits: "KITS"

    };

    return names[category] || "PRODUTO";
}


// =====================================================
// MOSTRAR PRODUTOS
// =====================================================

function renderProducts() {

    const search =
        searchInput.value
        .toLowerCase()
        .trim();


    const filtered =
        products.filter(function(product) {

            const matchesCategory =
                currentCategory === "todos" ||
                product.category === currentCategory;


            const matchesSearch =
                product.name
                .toLowerCase()
                .includes(search);


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    resultInfo.textContent =
        filtered.length + " produto(s)";


    if (filtered.length === 0) {

        productsEl.innerHTML = `
            <div class="empty">
                Nenhum produto encontrado.
            </div>
        `;

        return;
    }


    productsEl.innerHTML =
        filtered.map(function(product) {

            return `

                <article class="product-card">

                    <div class="product-image">
    ${
        product.image
        ? `<img src="${product.image}" alt="${product.name}">`
        : product.icon
    }
</div>


                    <div class="product-body">

                        <div class="product-category">
                            ${categoryName(product.category)}
                        </div>


                        <div class="product-name">
                            ${product.name}
                        </div>


                        <div class="product-price">

                            ${money(product.price)}

                            <span class="unit">
                                / un.
                            </span>

                        </div>


                        <div class="minimum">

                            Quantidade mínima:
                            ${product.minimum}
                            un.

                        </div>


                        <button
                            class="add-btn"
                            onclick="addToCart(${product.id})"
                        >
                            ADICIONAR AO CARRINHO
                        </button>

                    </div>

                </article>

            `;

        }).join("");

}


// =====================================================
// ADICIONAR AO CARRINHO
// =====================================================

function addToCart(id) {

    const product =
        products.find(function(product) {

            return product.id === id;

        });


    const existing =
        cart.find(function(item) {

            return item.id === id;

        });


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    updateCart();


    showToast(
        product.name +
        " adicionado ao carrinho."
    );

}


// =====================================================
// REMOVER DO CARRINHO
// =====================================================

function removeFromCart(id) {

    cart =
        cart.filter(function(item) {

            return item.id !== id;

        });


    updateCart();

}


// =====================================================
// ATUALIZAR CARRINHO
// =====================================================

function updateCart() {

    const totalItems =
        cart.reduce(function(sum, item) {

            return sum + item.quantity;

        }, 0);


    const total =
        cart.reduce(function(sum, item) {

            return sum +
                item.price *
                item.quantity;

        }, 0);


    cartCount.textContent =
        totalItems;


    cartTotal.textContent =
        money(total);


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty">

                Seu carrinho está vazio.

                <br><br>

                Adicione produtos
                do catálogo.

            </div>

        `;

        return;
    }


    cartItems.innerHTML =
        cart.map(function(item) {

            return `

                <div class="cart-item">

                    <div class="cart-thumb">
                        ${item.icon}
                    </div>


                    <div>

                        <strong>
                            ${item.name}
                        </strong>

                        <small>
                            ${item.quantity}
                            ×
                            ${money(item.price)}
                        </small>

                    </div>


                    <button
                        class="remove"
                        onclick="removeFromCart(${item.id})"
                    >
                        REMOVER
                    </button>

                </div>

            `;

        }).join("");

}


// =====================================================
// ABRIR CARRINHO
// =====================================================

function openCart() {

    cartPanel.classList.add("open");

    overlay.classList.add("show");

}


// =====================================================
// FECHAR CARRINHO
// =====================================================

function closeCart() {

    cartPanel.classList.remove("open");

    overlay.classList.remove("show");

}


// =====================================================
// NOTIFICAÇÃO
// =====================================================

function showToast(text) {

    toast.textContent = text;

    toast.classList.add("show");


    setTimeout(function() {

        toast.classList.remove("show");

    }, 2200);

}


// =====================================================
// CATEGORIAS
// =====================================================

function setCategory(category) {

    currentCategory = category;


    document
        .querySelectorAll("[data-category]")
        .forEach(function(button) {

            button.classList.toggle(
                "active",
                button.dataset.category === category
            );

        });


    renderProducts();

}


// =====================================================
// BOTÕES DE CATEGORIA
// =====================================================

document
    .querySelectorAll(
        ".menu-item, .category-chip"
    )
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                setCategory(
                    button.dataset.category
                );

            }
        );

    });


// =====================================================
// PESQUISA
// =====================================================

searchInput.addEventListener(
    "input",
    renderProducts
);


// =====================================================
// ABRIR CARRINHO
// =====================================================

document
    .getElementById("cartButton")
    .addEventListener(
        "click",
        openCart
    );


// =====================================================
// FECHAR CARRINHO
// =====================================================

document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


overlay.addEventListener(
    "click",
    closeCart
);


// =====================================================
// BOTÃO VER PRODUTOS
// =====================================================

document
    .getElementById("heroButton")
    .addEventListener(
        "click",
        function() {

            document
                .querySelector(".section")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


// =====================================================
// FINALIZAR PEDIDO
// =====================================================

document
    .getElementById("finishButton")
    .addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                showToast(
                    "Adicione pelo menos um produto ao carrinho."
                );

                return;
            }


            localStorage.setItem("importTechCart", JSON.stringify(cart));
            window.location.href = "checkout-cadastro.html";

        }
    );


// =====================================================
// PAINEL DO PROPRIETÁRIO
// =====================================================
const ownerButton = document.getElementById("ownerButton");
if (ownerButton) {
    const role = sessionStorage.getItem("it_role");
    if (role === "owner") {
        ownerButton.textContent = "GESTÃO";
        ownerButton.style.display = "inline-flex";
        ownerButton.addEventListener("click", function() {
            window.location.href = "owner.html";
        });
    } else {
        // Usuários normais não possuem acesso ao painel do proprietário.
        ownerButton.style.display = "none";
    }
}


// =====================================================
// SAIR
// =====================================================

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function() {

            window.location.href =
                "index.html";

        }
    );


// =====================================================
// INICIAR
// =====================================================

renderProducts();

updateCart();