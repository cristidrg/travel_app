const {
    Users
} = require('../Data');

const {
    generateToken,
} = require('../security/Jwt');

const {
    ServerError
} = require('../Errors');

const {
    hash,
    compare
} = require('../security/Password');

const add = async (name, email, username, password, role) => {
    const hashedPassword = await hash(password);
    const user = new Users({
        name,
        email,
        username,
        password: hashedPassword,
        role
    });
    await user.save();
};

const authenticate = async (username, password) => {

    const user = await Users.findOne({ username });
    if (user === null) {
        throw new ServerError(`Utilizatorul inregistrat cu ${username} nu exista!`, 404);
    }
    
    if (await compare(password, user.password)) {
        return await generateToken({
            userId: user._id,
            userRole: user.role
        });
    } 
    throw new ServerError("Combinatia de username si parola nu este buna!", 404);
};

const get_all = async () => {
    return await Users.find();
}

module.exports = {
    add,
    authenticate,
    get_all
}