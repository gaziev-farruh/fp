document.addEventListener("DOMContentLoaded", function () {
    const basket = document.getElementById("basket");
    const addToBasketButtons = document.querySelectorAll(".add-to-basket");
    const modal = document.getElementById("basket-modal");
    const closeModalBtn = modal.querySelector(".close-btn");
    const basketItemsContainer = modal.querySelector(".basket-items");
    const basketTotal = modal.querySelector(".basket-total");
    const basketCount = document.getElementById("basket-count");

    let basketData = [];

    addToBasketButtons.forEach(button => {
        button.addEventListener("click", function () {
            const menuItem = this.closest(".menu-item");
            const menuContent = menuItem.querySelector(".menu-content");
            const menuImage = menuItem.querySelector(".menu-img");

            const itemId = menuContent.dataset.id;
            const itemName = menuContent.dataset.name;
            const itemPrice = menuContent.dataset.price;
            const itemImage = menuImage ? menuImage.src : "";

            if (itemId && itemName && itemPrice) {
                addToBasket(itemId, itemName, itemPrice, itemImage);
            } else {
                console.error("Некоторые data-атрибуты отсутствуют у товара");
            }
        });
    });

    function updateBasketCount() {
        let totalItems = basketData.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            basketCount.textContent = totalItems;
            basketCount.style.visibility = "visible";
        } else {
            basketCount.style.visibility = "hidden";
        }
    }
    function addToBasket(id, name, price, image) {
        let existingItem = basketData.find(item => item.id == id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            basketData.push({ id, name, price: parseInt(price), image, quantity: 1 });
        }
        updateBasketUI();
        }

    function updateQuantity(id, change) {
        let item = basketData.find(item => item.id == id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                basketData = basketData.filter(i => i.id != id);
            }
            updateBasketUI();
        }
        }

    function removeItem(id) {
        basketData = basketData.filter(item => item.id != id);
        updateBasketUI();
        }

    function updateBasketUI() {
        basketItemsContainer.innerHTML = "";
        let total = 0;
    
        basketData.forEach(item => {
        total += item.price * item.quantity;

        // Клонируем шаблон
        const template = document.getElementById("basket-item-template").content.cloneNode(true);
        const basketItem = template.querySelector(".basket-item");

        // Устанавливаем данные
        basketItem.querySelector(".basket-item-img").src = item.image;
        basketItem.querySelector(".basket-item-img").alt = item.name;
        basketItem.querySelector(".basket-item-name").textContent = item.name;
        basketItem.querySelector(".basket-item-quantity").textContent = item.quantity;
        basketItem.querySelector(".basket-item-price").textContent = `${item.price * item.quantity}₸`;

        // Получаем кнопки
        const decreaseButton = basketItem.querySelector(".decrease-quantity");
        const increaseButton = basketItem.querySelector(".increase-quantity");
        const removeButton = basketItem.querySelector(".remove-item");

        // Устанавливаем data-id
        decreaseButton.dataset.id = item.id;
        increaseButton.dataset.id = item.id;
        removeButton.dataset.id = item.id;

        // Добавляем в контейнер корзины
        basketItemsContainer.appendChild(basketItem);
    });

    basketTotal.textContent = `Итого: ${total}₸`;
    
        document.querySelectorAll(".increase-quantity").forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                updateQuantity(this.dataset.id, 1);
            });
        });
        document.querySelectorAll(".decrease-quantity").forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                updateQuantity(this.dataset.id, -1);
            });
        });
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                removeItem(this.dataset.id);
            });
        });
        updateBasketCount();
    }
    basket.addEventListener("click", function () {
        modal.style.transform = "translateX(0)";
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    });

    closeModalBtn.addEventListener("click", closeModal);

    document.addEventListener("click", function (event) {
        if (!modal.contains(event.target) && !basket.contains(event.target)) {
            closeModal();
        }
    });
    function closeModal() {
        modal.style.transform = "translateX(100%)";
        setTimeout(() => modal.style.display = "none", 300);
        document.body.style.overflow = "auto";
    }
});

// `updateBasketCount`
function animateBasketCount() {
    basketCount.classList.add("basket-count-pop");
    setTimeout(() => basketCount.classList.remove("basket-count-pop"), 300);
}

function updateBasketCount() {
    let totalItems = basketData.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
        basketCount.textContent = totalItems;
        basketCount.style.visibility = "visible";
        animateBasketCount();
    } else {
        basketCount.style.visibility = "hidden";
    }
}