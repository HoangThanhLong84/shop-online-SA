const buttonsStatus = document.querySelectorAll("[button-status");
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}

// Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (a) => {
        a.preventDefault();
        const keyword = a.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
    let url = new URL(window.location.href);

    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);

            window.location.href = url.href;
        });
    });
}
// End Pagination

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsID = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        console.log(inputCheckAll.checked);
        if (inputCheckAll.checked) {
            inputsID.forEach(input => {
                input.checked = true;
            });
        } else {
            inputsID.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputsID.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

            if (countChecked == inputsID.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
// End Checkbox Multi

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;

        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");
            if (!isConfirm) {
                return;
            }
        }

        console.log(typeChange);

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });

            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi!");
        }
    });
}
// End Form Change Multi

// Show Alert
const showAlert= document.querySelector("[show-alert]");
if(showAlert){
    const time= parseInt(showAlert.getAttribute("data-time"));
    const closeAlert= showAlert.querySelector("[close-alert]");
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
// End Show Alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(file){
            uploadImagePreview.src= URL.createObjectURL(file);
        }
    });
}
// End Upload Image

// Sort
const sort= document.querySelector("[sort]");
if(sort){
    let url= new URL(window.location.href);
    const sortSelect= sort.querySelector("[sort-select]");
    const sortClear= document.querySelector("[sort-clear]");

    sortSelect.addEventListener("change", (e) => {
        const value= e.target.value;
        const [sortKey, sortValue] = value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href= url.href;
    });

    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey", sortKey);
        url.searchParams.delete("sortValue", sortValue);
        window.location.href= url.href;
    });
    const sortKey= url.searchParams.get("sortKey");
    const sortValue= url.searchParams.get("sortValue");
    if(sortKey && sortValue){
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSeclected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSeclected.selected= true;
    }
}
// End Sort

let avatar = document.querySelector(".avatar"), 
    notification = document.querySelector(".notification");
dropMenu(avatar)
dropMenu(notification)
function dropMenu(selector)
{
   selector.addEventListener("click",()=>{
        let dropDownMenu = selector.querySelector(".dropdown-menu");
        dropDownMenu.classList.contains("active") ?  dropDownMenu.classList.remove("active") :  dropDownMenu.classList.add("active") ;
   })
}