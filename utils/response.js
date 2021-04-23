export const ReS = (res,msg,data,code) =>{
    return res.status(code).json({
        message:msg,
        data,
    })
}
export const ReE = (res,msg,data,code) =>{
    return res.status(code).json({
        message:msg,
        data,
    })
}
export const ReCD = (res, type, token, httpOnly) => {
    return res.cookie(type, token, { httpOnly });
  };