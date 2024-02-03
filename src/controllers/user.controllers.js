import User from "../models/user.model.js";

export const homepage = (req, res, next) => {
  res.send("HomePage ");
};

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const alreadyRegistredUser = await User.findOne({ email: email });

  if(alreadyRegistredUser){
    
  }
  res.send(req.body);
};
