// Change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path= formChangeStatus.getAttribute("data-path");

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent= button.getAttribute("data-status");
            const id= button.getAttribute("data-id");
            
            let statusChange= statusCurrent == "not_delivery" ? "delivered" : "not_delivery";

            const action= path + `/${statusChange}/${id}?_method-PATCH`;
            formChangeStatus.action= action;

            formChangeStatus.submit();
        });
    });
}
// End Change Status


// Change verify
const buttonChangeVerify = document.querySelectorAll("[button-change-verify]");
if(buttonChangeVerify.length > 0) {
    const formChangeVerify = document.querySelector("#form-change-verify");
    const path= formChangeVerify.getAttribute("data-path");

    buttonChangeVerify.forEach(button => {
        button.addEventListener("click", () => {
            const verifyCurrent= button.getAttribute("data-verify");
            const id= button.getAttribute("data-id");
            
            let verifyChange= verifyCurrent == "not_verify" ? "verified" : "not_verify";

            const action= path + `/${verifyChange}/${id}?_method-PATCH`;
            formChangeVerify.action= action;

            formChangeVerify.submit();
        });
    });
}
// End Change Verify


// Delete item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0){
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path= formDeleteItem.getAttribute("data-path");
    buttonsDelete.forEach(button => {
        button.addEventListener("click", () =>{
            const isConfirm = confirm("Bạn có chắc muốn xóa người dùng này?");
            if(isConfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.action= action;
                formDeleteItem.submit();
            }
        });
    });
}
// End delete item