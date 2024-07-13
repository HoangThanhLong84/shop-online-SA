module.exports.generateRandomString = (length) => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
    let result="";
    for(let i=0; i< length; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}