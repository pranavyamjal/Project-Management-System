import { DataTypes } from 'sequelize';
import sequelize from '../db/index.db.js';

const Task = sequelize.define(
    'Task', 
    {
  
        id: 
        {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },


        title: 
        {
            type: DataTypes.STRING,
            allowNull: false,
        },


        status: 
        {
            type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
            defaultValue: 'To Do',
            allowNull: false,
        },


        projectId: 
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: 
            {
                model: 'Projects', // Table name
                key: 'id',
            },
  },
});

export default Task;
