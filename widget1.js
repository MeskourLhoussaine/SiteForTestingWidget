document.addEventListener("DOMContentLoaded", function() {
    // Création du bouton
    var button = document.createElement("button");
    button.id = "toggleButton";
    button.style.display = "inline-flex"; // Définir l'affichage en inline-flex

    // Création de l'élément d'image pour le logo
    var logo = document.createElement("img");
    logo.src = "https://i.ibb.co/gFZGbV3/Logopng.png"; // Chemin vers votre image de logo
    logo.alt = "PayPik Logo";
    logo.width = "20"; // Définir la largeur du logo (ajuster si nécessaire)
    logo.style.marginRight = "10px"; // Ajouter une marge entre l'image et le texte du bouton

    // Ajouter d'abord le logo au bouton
    button.appendChild(logo);

    // Définir le texte du bouton
    button.appendChild(document.createTextNode("Payer avec PayPik"));

    // Ajouter le bouton au conteneur désiré
    var container = document.getElementById("content-behind-iframe");
    container.appendChild(button);

    // Écouteur d'événements de clic pour le bouton
    button.addEventListener("click", function() {
        // Récupération de l'élément de script
        var scriptElement = document.getElementById('paypik');

        // Récupération des attributs nécessaires pour la requête
        var accessKey = scriptElement.getAttribute('data-access_key');
        var marchandId = scriptElement.getAttribute('data-merchant_id');
        var orderId = scriptElement.getAttribute('data-order_id');
        var orderDescription = scriptElement.getAttribute('data-order_description');
        var productsIds = scriptElement.getAttribute('data-products_ids');
        var amount = scriptElement.getAttribute('data-amount');
        var currency = scriptElement.getAttribute('data-currency');
        var hmac = scriptElement.getAttribute('data-hmac');
        var redirectUrl = scriptElement.getAttribute('data-redirect_url');

        // Récupération de l'URL actuelle
        var currentURL = window.location.href;
        console.log(currentURL);

        // Affichage de la valeur HMAC dans la console
        console.log("HMAC: " + hmac);

        // Construction de l'URL pour la requête vers le serveur local
        var url = `http://localhost:8080/api/merchants/permission?hostname=${encodeURIComponent(currentURL)}&accessKey=${encodeURIComponent(accessKey)}&merchantId=${encodeURIComponent(marchandId)}&orderId=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(amount)}&currency=${encodeURIComponent(currency)}&hmac=${encodeURIComponent(hmac)}`;

        // Effectuer la requête fetch vers le serveur local
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    loadError();
                    throw new Error('Réponse du réseau non valide');
                }
                return response.json(); // Retourner les données JSON de la réponse
            })
            .then(data => {
                console.log('Réponse Permission:', data);
                if (data === true && data.status !== 400) {
                    loadWidget(accessKey, currentURL, marchandId, orderId, orderDescription, productsIds, amount, currency, hmac, redirectUrl);
                } else {
                    loadError(); // Redirection vers la page d'erreur en cas de problème
                }
            })
            .catch(error => console.error('Erreur lors de la récupération des données depuis le serveur local:', error));
    });

    // Fonction pour charger la page d'erreur
    function loadError() {
        var iframe = document.getElementById("myiframe");
        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.id = "myiframe";
            iframe.src = 'https://anasanasri.github.io/errorpermission/';
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            container.appendChild(iframe);
        } else {
            iframe.style.display = "block";
        }
    }

    // Fonction pour charger le widget de paiement
    function loadWidget(accessKey, currentURL, marchandId, orderId, orderDescription, productsIds, amount, currency, hmac, redirectUrl) {
        var iframe = document.getElementById("myiframe");
        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.id = "myiframe";
            iframe.src = `https://meskourlhoussaine.github.io/paiement-widget-CI-CD/?access_key=${encodeURIComponent(accessKey)}&host=${encodeURIComponent(currentURL)}&marchand_id=${encodeURIComponent(marchandId)}&order_id=${encodeURIComponent(orderId)}&order_description=${encodeURIComponent(orderDescription)}&products_ids=${encodeURIComponent(productsIds)}&amount=${encodeURIComponent(amount)}&currency=${encodeURIComponent(currency)}&hmac=${encodeURIComponent(hmac)}&redirect_url=${encodeURIComponent(redirectUrl)}`;
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            container.appendChild(iframe);
        } else {
            iframe.style.display = "block";
        }
    }

    // Écouteur d'événements pour gérer les messages reçus depuis le widget
    window.addEventListener("message", function(event) {
        if (event.data === "closeWidget") {
            document.getElementById("myiframe").style.display = "none";
        }
    });

    // Injection dynamique des styles CSS
    var styles = `
    #toggleButton {
        background-color: #5BC084;
        color: white;
        border-radius: 10px;
        border: round 1px solid;
        padding: 10px 20px;
        cursor: pointer;
        /* Ajoutez d'autres styles souhaités */
    }
    #toggleButton:hover {
        background-color: #3E8D5E;
    }
    `;

    var styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Initialiser le panier
    const cart = [];
    const cartSummary = document.querySelector('.cart-summary'); // Assurez-vous que la classe est correctement assignée

    // Fonction pour mettre à jour le résumé du panier
    function updateCartSummary() {
        let totalAmount = 0;
        cartSummary.innerHTML = ''; // Réinitialiser le résumé du panier

        cart.forEach(item => {
            totalAmount += item.price;
            cartSummary.innerHTML += `
                <li class="grid grid-cols-6 gap-2 border-b-1">
                    <div class="col-span-1 self-center">
                        <img src="${item.image}" alt="Produit" class="rounded w-full">
                    </div>
                    <div class="flex flex-col col-span-3 pt-2">
                        <span class="text-gray-600 text-md font-semi-bold">${item.name}</span>
                        <span class="text-gray-400 text-sm inline-block pt-2">Produit</span>
                    </div>
                    <div class="col-span-2 pt-3">
                        <div class="flex items-center space-x-2 text-sm justify-between">
                            <span class="text-gray-400">1 x ${item.price.toFixed(2)} DH</span>
                            <span class="text-emerald-400 font-semibold inline-block">${item.price.toFixed(2)} DH</span>
                        </div>
                    </div>
                </li>
            `;
        });

        // Afficher le total
        document.querySelector('.cart-total').textContent = totalAmount.toFixed(2);
    }

    // Événement pour ajouter au panier
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const image = this.getAttribute('src');
            const price = parseFloat(this.getAttribute('data-price'));

            // Ajouter l'article au panier
            cart.push({ id, name, image, price });

            // Mettre à jour le résumé du panier
            updateCartSummary();
        });
    });
});
