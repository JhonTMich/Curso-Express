function validEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function validName(name) {
    return typeof name === 'string' && name.length >= 3;
}

function uniqueId(id, users) {
    return typeof id === 'number' && !users.some(user => user.id === id);
}

function validateUser(newUser, users) {
    const {name, email, id} = newUser;

    if (!newUser || Object.keys(newUser).length === 0)
        return { isValid: false, error: 'No llegaron datos' }

    if (!validName(name))
        return { isValid: false, error: 'El nombre no cumple con los requisitos' };

    if (!validEmail(email))
        return { isValid: false, error: 'El correo indicado no es correcto' };

    if (!uniqueId(id, users))
        return { isValid: false, error: 'El ID de usuario ya existe' };

    return { isValid: true };
}

module.exports = { validateUser, validEmail, validName, uniqueId };