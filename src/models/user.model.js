import { DataTypes } from 'sequelize';
import sequelize from '../db/index.db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Project from './project.model.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, 
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },

    accessToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
    },
  }
);

// Method to compare password (for login)
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Relationship with Project model
User.belongsToMany(Project, { through: 'UserProjects', foreignKey: 'userId' });
Project.belongsToMany(User, { through: 'UserProjects', foreignKey: 'projectId' });

// Generate Access Token
User.prototype.generateAccessToken = function () {
  const accessToken = jwt.sign(
    { id: this.id, username: this.username, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return accessToken;
};

// Generate Refresh Token
User.prototype.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { id: this.id, username: this.username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return refreshToken;
};

export default User;
