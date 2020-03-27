var promise1 = new Promise( function(resolve, reject){
    setTimeout(resolve, 2000, "promise11111");
});
var promise2 = new Promise( function(resolve, reject){
    setTimeout(resolve, 1000, "promise22222");
});

Promise.all([promise1, promise2]).then( function(value){
    console.log(value);
})