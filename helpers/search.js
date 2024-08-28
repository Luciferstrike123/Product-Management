module.exports = (req, find) => {
    let keyword = ""
    if(req.query.keyword){
        keyword = req.query.keyword
        
        const regex = new RegExp(keyword, "i")
        find.title = regex
    }
    return keyword
}