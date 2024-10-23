const parser = require('./parser')
const users = require('./users')

const user = {
    id: 8,
    name: 'e.lebasov',
    pass: 'Sextremes1!',
    path: 'gk_active'
}



const main = () => {
    parser(user)

}

main()