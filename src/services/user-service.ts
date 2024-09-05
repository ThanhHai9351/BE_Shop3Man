import User, { IUser } from "../models/user";
import { JwtProvider } from "../providers/jwt-provider";
import bcrypt from 'bcrypt'

const createUserService = (data: IUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const passwordNew = await bcrypt.hash(data.password,10);
      const userNew = {
        name: data.name,
        email: data.email,
        role:data.role,
        password : passwordNew,
        address : data.address,
        dob: data.dob
      }
      const createUser = await User.create(userNew);

      resolve({
        status: "OK",
        message: "User created successfully!",
        data: createUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const loginService = (email:string, password:string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const checkUser = await User.findOne({ email });
        if(!checkUser)
        {
            resolve({
                status: "Error",
                message: "User not found!",
              });
              return;
        }

        const isMatch = await bcrypt.compare(password,checkUser.password);
        if (!isMatch) {
            resolve({
                status: "Error",
                message: "Password not match!",
              });
              return;
        }

        const data = { _id: checkUser._id, email: checkUser.email,name: checkUser.name, role: checkUser.role };

        const accessToken = await JwtProvider.generateToken(data,process.env.ACCESS_TOKEN!,'24h');
        const refreshToken = await JwtProvider.generateToken(data,process.env.REFRESH_TOKEN!,'30 days');
        resolve({
          status: "OK",
          message: "User created successfully!",
          accessToken: accessToken,
          refreshToken:refreshToken
        });
      } catch (e) {
        reject(e);
      }
    });
};

const getUserFromToken = (token:string) => {
    return new Promise(async (resolve, reject) => {
      try {
       const data : any = await JwtProvider.verifyToken(token,process.env.ACCESS_TOKEN!)
       if(!data)
       {
        resolve({
            status: "Error",
            message: "Token isvalid! Not found User!",
          });
          return;
       }

       const user = await User.findById(data._id)
        resolve({
          status: "OK",
          message: "Get user successfully!",
          data: user
        });
      } catch (e) {
        reject(e);
      }
    });
};

const UserService = { createUserService,loginService,getUserFromToken };

export default UserService;
