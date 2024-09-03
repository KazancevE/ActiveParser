const parser = require('./parser')
const users = require('./users')

const main = () => {
    try {
        users.forEach(async el => {
            await parser(el)
            // await window.location.reload(true)
            await console.log(el.name);
        })
        console.log("First");
        // clearInterval()
    } catch (error) {
    console.log(error)
    }
}

main()