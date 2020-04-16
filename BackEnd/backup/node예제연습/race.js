var promise1 = new Promise( function(resolve, reject){
    setTimeout(resolve, 2000, "promise1");
});
var promise2 = new Promise( function(resolve, reject){
    setTimeout(resolve, 1000, "promise2");
});

Promise.race([promise1, promise2])
.then( function(value){
    console.log(value);
})