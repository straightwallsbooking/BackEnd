import { ReE } from './response';
// import { RETURN_CODE } from '../../constant';

const jwt = require('jsonwebtoken');


const withAuth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    ReE(
      res,
       'Unauthorized: No token provided' , null,
      401
    );
  } else {
    jwt.verify(token, "Our secret", (err, decoded) => {
      if (err) {
        ReE(
          res,
           'Unauthorized: Invalid token' ,null,
          401
        );
      } else {
        req.id = decoded.id;
        req.email = decoded.email;
        req.name = decoded.name 
        next();
      }
    });
  }
};

export default withAuth;
