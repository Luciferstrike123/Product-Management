module.exports = (req, find) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];
    if(req.query.status){
        find.status = req.query.status
    }
    if(req.query.status){
        const index = filterStatus.findIndex(item => item.status == req.query.status)
        filterStatus[index].class = "active"
    }
    else {
        const index = filterStatus.findIndex(item => item.status == "")
        filterStatus[index].class = "active"
    } 
    return filterStatus
}