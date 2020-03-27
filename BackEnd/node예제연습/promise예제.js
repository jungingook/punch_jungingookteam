var test = function(bool){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            if(bool){
                resolve("fuilfilled 상태입니다. then으로 연결됩니다.");
            }
            else{
                reject("rejected 상태입니다. catch로 연결됩니다.");
            }
        }, 1000);
    });
};

test(true)
.then(function(result){
    console.log("1) " + result);
    return test(true);
})
.then( function(result){
    console.log("2) " + result);
    return test(false);
})
.then( function(result){
    console.log("3) " + result);
    return test(true);
})
.catch(function(result){
    console.log("4) " + result);
    return test(true);
})
.then( function(result){
    console.log("5) " + result);
    return test(true);
})