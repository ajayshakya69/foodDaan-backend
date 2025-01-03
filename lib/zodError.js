
const zodError = (error) => {
    const errormsg = `${error.errors[0].path[0]}: ${error.errors[0].message}`;
    return errormsg;

}

module.exports = zodError;