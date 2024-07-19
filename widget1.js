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

});
