
function asynchandler(fn){
    return function(req,res,next){
        return Promise.resolve(fn(req,res,next))
               .catch(next)
    };
};



function globalErrorHandler (err,req,res,next){

    const statusCode = res.statusCode!=200?res.statusCode:500;


console.log(err)

    res.status(statusCode).json({errormessage:err.message})

}


module.exports ={
    asynchandler,
    globalErrorHandler
}