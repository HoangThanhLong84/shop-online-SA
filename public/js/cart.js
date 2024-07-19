// Update quantity product
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if(inputsQuantity.length > 0){
    inputsQuantity.forEach(input =>{
        input.addEventListener("change", (e) => {
            const productId = input.getAttribute("product-id");
            const quantity = parseInt(input.value);
            if(quantity > 1){
                window.location.href = `/cart/update/${productId}/${quantity}`;
            }
            
        });
    });
}

const inputsQuantity2 = document.querySelectorAll("button[name='addQuantity']");
inputsQuantity2.forEach(button =>{
    button.addEventListener("click", (e) => {
        const productId = button.getAttribute("product-id");
        var quantity = parseInt(button.value)+1;

        
        window.location.href = `/cart/update/${productId}/${quantity}`;
        
    });
});


const inputsQuantity3 = document.querySelectorAll("button[name='subQuantity']");
inputsQuantity3.forEach(button =>{
    button.addEventListener("click", (e) => {
        const productId = button.getAttribute("product-id");
        var quantity = parseInt(button.value)-1;

        if(quantity > 0){
            window.location.href = `/cart/update/${productId}/${quantity}`;
        }
    });
});

// End update quantity product