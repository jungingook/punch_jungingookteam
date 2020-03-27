foo.someFonction().then( function(result){
    // ... 어떤 로직이 수행된다.
    goo.anotherFunction().then( function(result2){
        // ... 어떤 로직이 수행된다.
    }).catch( function(err){
        console.log(err);
    })
})

//위 예제는 promise를 제대로 상요하지 못한 예입니다.
//rpomise를 사용하여then()과 catch()메서드를 사용하고 있지만 , 콜백지옥은 여전합니다.
foo.someFonction().then( function(result){
    // ...어떤 로직이 수행된다.
    return goo.anotherFunction()
}).then( function(result2){
    // ... 어떤 로직이 수행된다.
}).catch( function(err){
    console.log(err);
})

//수정된 코드는 promise를 사용하면 비동기 동작을 단순화 시킬 수 있다느 것을 염두한 코드입니다. 
// 훨씬 깔끔해진 것을 환인할 수 있습니다.

