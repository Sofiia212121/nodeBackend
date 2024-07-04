function getUsersList() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if (true) {
                reject(new Error('Bad request'));
            }

            const users = [1, 2, 3];
            resolve(users);
        }, 3000);
    });
}

// old variant
/*
    getUsersList().then(users => {
        console.log(users);
    }).catch(error => {
        console.log(error.message);
    });
*/

// anon async self-invoking function
(async () => {
    // modern variant
    let users = [];

    try {
        users = await getUsersList();
    } catch (e) {
        console.log(e.message);
    }

    console.log(users);
})();


async function doSomething() {
    return 1;
}

doSomething().then(result => {
    console.log(result);
})