import { DataTypes } from 'sequelize';
import sequelize from '../db/index.db.js';

const Project = sequelize.define(
    'Project', 
    {
        id: 
        {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: 
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
  
        description: 
        {
            type: DataTypes.TEXT,
            allowNull: true,
        },

    });

export default Project;
