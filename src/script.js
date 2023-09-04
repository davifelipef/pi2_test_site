document.addEventListener('DOMContentLoaded', function() {
    let cartList = []; 
    let cartCount = 0; 
    let dataArray = [];
    const listContainer = document.getElementById('listContainer');
    const cartIcon = document.getElementById('cart');
    const cartItemsList = document.getElementById('cartItemsList');

    window.onload = function() {
        const selectElement = document.getElementById('foodList');
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const selectedOptionId = selectedOption.id;
        fetchDataAndPopulateList(selectedOptionId);
    }

    document.getElementById('foodList').addEventListener('change', function() {
        const selectElement = document.getElementById('foodList');
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const selectedOptionId = selectedOption.id;
        fetchDataAndPopulateList(selectedOptionId);
    });

    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', () => {
        const selectedOptionIndex = listContainer.selectedIndex;
        const selectedOptionData = dataArray[selectedOptionIndex];
        const carbsValue = document.getElementById('carbs').textContent; // Get the existing value

        // Create an object to represent the cart item with the name and existing carbs value
        const cartItem = {
            item: selectedOptionData.item,
            carbValue: carbsValue,
        };

        cartList.push(cartItem);
        console.log(cartList); // log de debug
        cartCount++;
        updateCartDisplay();
    });

    
    cartIcon.addEventListener('click', () => {
        const modal = document.getElementById('cartModal');
        if (modal.style.display === 'block') {
            closeCartModal();
        } else {
            openCartModal();
        }
    });

    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        closeCartModal();
    });

    function openCartModal() {
        const modal = document.getElementById('cartModal');
        modal.style.display = 'block';

        // Clear the cart items list before populating it
        cartItemsList.innerHTML = '';

        populateCartItems();
    }

    function closeCartModal() {
        const modal = document.getElementById('cartModal');
        modal.style.display = 'none';
    }

    function updateCartDisplay() {
        // Atualiza a contagem de itens do carrinho
        const cartItemsElement = document.querySelector('.cartItems');
        cartItemsElement.textContent = cartCount;
    }

    function populateCartItems() {
        cartItemsList.innerHTML = ''; // Clear the previous items
        let totalCHO = 0; // Initialize a variable to keep track of the total CHO
    
        cartList.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            const choValue = parseInt(item.carbValue); // Parse the CHO value as an integer
            totalCHO += choValue; // Add it to the total
            cartItemDiv.textContent = `${item.item}: ${item.carbValue}`; // Use the carbValue from the cart item
            cartItemsList.appendChild(cartItemDiv);
    
            // Add vertical space after the last item (not after the total)
            if (index === cartList.length - 1) {
                cartItemDiv.style.marginBottom = '1.5em'; // Adjust the 'em' value for your desired spacing
            }
        });
    
        // Create a div for the total CHO and add it to the modal
        const totalDiv = document.createElement('div');
        totalDiv.textContent = `Total: ${totalCHO} CHO`;
        cartItemsList.appendChild(totalDiv);
    }    

    async function fetchDataAndPopulateList(selectedOptionId) {
        try {
            let csvFilePath = '';
            // Determina o acesso ao caminho do arquivo CSV dependendo da opção selecionada
            switch (selectedOptionId) {
                case 'tb1': // Tabela padrão
                    csvFilePath = './res/tabela_de_alimentos.csv';
                    break;
                case 'tb2': // Cantina escolar
                    csvFilePath = './res/tabela_cantina_escolar.csv';
                    break;
                case 'tb3': // Cantina italiana
                    csvFilePath = './res/tabela_cantina_italiana.csv';
                    break;
                case 'tb4': // Casamento
                    csvFilePath = './res/tabela_casamento.csv';
                    break;
                case 'tb5': // Churrascaria
                    csvFilePath = './res/tabela_churrascaria.csv';
                    break;
                case 'tb6': // Comida árabe
                    csvFilePath = './res/tabela_comida_arabe.csv';
                    break;
                case 'tb7': // Comida japonesa
                    csvFilePath = './res/tabela_comida_japonesa.csv';
                    break;
                case 'tb8': // Culinária alemã
                    csvFilePath = './res/tabela_culinaria_alema.csv';
                    break;
                case 'tb9': // Doces
                    csvFilePath = './res/tabela_doces.csv';
                    break;
                case 'tb10': // Festa de aniversário
                    csvFilePath = './res/tabela_festa_aniversario.csv';
                    break;
                case 'tb11': // Festa junina
                    csvFilePath = './res/tabela_festa_junina.csv';
                    break;
                case 'tb12': // Natal
                    csvFilePath = './res/tabela_natal.csv';
                    break;
                case 'tb13': // Páscoa
                    csvFilePath = './res/tabela_pascoa.csv';
                    break;
                case 'tb14': // Pizza 
                    csvFilePath = './res/tabela_pizzas.csv';
                    break;
                case 'tb15': // Sorvetes
                    csvFilePath = './res/tabela_sorvetes.csv';
                    break;
                default:
                    console.log('Opção desconhecida selecionada.');
                    return; // Sai da função se for selecionada uma opção desconhecida
            }

            const response = await fetch(csvFilePath);
            const data = await response.text();
            const lines = data.split('\n');
            dataArray = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                const items = parseCSVLine(line);

                if (items.length > 0) {
                    const item = items[0];
                    const measure = items[1];
                    const weight = items[2];
                    const carb = items[3];
                    dataArray.push({ item, measure, weight, carb });
                }
            }

            listContainer.innerHTML = '';
            dataArray.forEach(itemData => {
                const option = document.createElement('option');
                option.textContent = `${itemData.item}`;
                listContainer.appendChild(option);
            });

            const carbsParagraph = document.getElementById('carbs');
            const inputWeight = document.getElementById('i_weight');
            listContainer.addEventListener('change', () => {
                const selectedOptionIndex = listContainer.selectedIndex;
                const selectedOptionData = dataArray[selectedOptionIndex];
                let result = (inputWeight.value * parseFloat(selectedOptionData.carb)) / parseFloat(selectedOptionData.weight);
                result = Math.ceil(result);
                carbsParagraph.textContent = `${result} CHO`;
            });

            inputWeight.addEventListener('input', () => {
                const selectedOptionIndex = listContainer.selectedIndex;
                const selectedOptionData = dataArray[selectedOptionIndex];
                let result = (inputWeight.value * parseFloat(selectedOptionData.carb)) / parseFloat(selectedOptionData.weight);
                result = Math.ceil(result);
                carbsParagraph.textContent = `${result} CHO`;
            });            

        } catch (error) {
            console.error('Erro buscando ou carregando os dados:' + error);
        }
    }

    function parseCSVLine(line) {
        const items = [];
        let currentItem = '';
        let withinQuotes = false;

        for (const char of line) {
            if (char === ',' && !withinQuotes) {
                items.push(currentItem.trim());
                currentItem = '';
            } else if (char === '"') {
                withinQuotes = !withinQuotes;
            } else {
                currentItem += char;
            }
        }
        items.push(currentItem.trim());
        return items;
    }

});