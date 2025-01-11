import { DataTypes } from 'sequelize';
import sequelize from '../db/index.db.js';
import Task from './task.model.js';

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

// Association with Task model / Relationship
Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

export default Project;
