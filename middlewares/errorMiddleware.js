//errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if(process.env.NODE_ENV === 'developement')
    sendErrorForDev(res, err);
  else
    sendErrorForProd(res, err);
};

const sendErrorForDev= (res, err)=>{  
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd= (res, err)=>{
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = errorMiddleware;


// notices
//built-in properties of the Error object (such as message and stack) aren't included automatically when the object is converted to JSON, so that we need to explicitly add them
