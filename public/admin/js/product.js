//Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("data-path")
    //console.log(path)

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")

            let changeStatus = (currentStatus == "active")? "inactive" : "active"

            const action = path + `/${changeStatus}/${id}?_method=PATCH`
            formChangeStatus.action = action
            formChangeStatus.submit()
        })
    })
}
//End Change Status

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsID = checkboxMulti.querySelectorAll("input[name='id']")
    
    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {
            inputsID.forEach(input => {
                input.checked = true
            })
        }
        else {
            inputsID.forEach(input => {
                input.checked = false
            })
        }
    })
    
    inputsID.forEach(input => {
        input.addEventListener("click", () => {
            inputCheckAll.checked = Array.from(inputsID).every(i => i.checked)
        })
    })
}
// End Checkbox Multi

//Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault()

        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const checkedInput = checkboxMulti.querySelectorAll("input[name='id']:checked")

        //Delete Many Items
        const typeChange = e.target.elements.type.value
        if(typeChange=="delete-all"){
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?")
            if(!isConfirm){
                return
            }
        }
        
        if(checkedInput.length > 0) {
            let ids = []
            checkedInput.forEach((input, index) => {
                if(typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    ids[index] = `${input.value}-${position}`
                }
                else
                    ids[index] = input.value
            })
            const inputIds = formChangeMulti.querySelector("input[name='ids']")
            inputIds.value = ids.join(", ")
            formChangeMulti.submit()
        }
        else {
            alert("Please select one!!!")
        }
    })
}
//End Form Change Multi

//Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]")
if(buttonDelete.length > 0){
    const formDeleteItem = document.querySelector("#form-delete-item")
    const path = formDeleteItem.getAttribute("data-path")

    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này")
            if(isConfirm) {
                const id = button.getAttribute("data-id")
                const action = path + `/${id}?_method=DELETE`
                formDeleteItem.action = action
                formDeleteItem.submit()
            }
        })
    })
}
//End Delete Item