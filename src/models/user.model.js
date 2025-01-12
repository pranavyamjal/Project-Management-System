import { DataTypes } from 'sequelize';
import sequelize from '../db/index.db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Project from './project.model.js';

const User = sequelize.define(
  'User', 
  {
    id: 
    {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },


    username: 
    {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
  
    email: 
    {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },


  password: 
  {
    type: DataTypes.STRING,
    allowNull: false,
  },

  accessToken:
  {
    type: DataTypes.STRING,
    allowNull: false
  },

  refreshToken:{
    type: DataTypes.STRING,
    allowNull: false
  }

  
});

User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


// Association with Project model / Relationship

User.belongsToMany(Project, { foreignKey: 'userId' });





// Generate Access Token
User.prototype.generateAccessToken = function () {
  const token = jwt.sign({ id: this.id, username: this.username, email: this.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  return token;
};

// Generate Refresh Token
User.prototype.generateRefreshToken = function () {
  const refreshToken = jwt.sign({ id: this.id, username: this.username }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Refresh token is typically valid for longer (e.g., 7 days)
  });
  return refreshToken;
};




export default User;
