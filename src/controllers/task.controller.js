import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Task from "../models/task.model.js";
import ApiResponse from "../utils/ApiResponse.js";


const createTask = asyncHandler(async (req, res) => {

    const {name, description} = req.body

    const task = await Task.create({
        name,
        description,
        projectId: req.params.id
    })  

    if(!task){
        throw new ApiError(400, "Task not created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Task created successfully")
    )

})

const getAllTasks = asyncHandler(async (req, res) => {

    const tasks = await Task.findAll({
        where: {
            projectId: req.params.id
        }
    })

    if(!tasks){
        throw new ApiError(400, "Tasks not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tasks, "Tasks fetched successfully")
    )

})

const getTaskById = asyncHandler(async (req, res) => {

    const task = await Task.findByPk(req.params.id)

    if(!task){
        throw new ApiError(400, "Task not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, task, "Task fetched successfully")
    )

})

const updateTask = asyncHandler(async (req, res) => {

    const {name, description} = req.body

    await Task.findByPk(req.params.id).then((task) => {
        task.name = name
        task.description = description
        task.save()
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Task updated successfully")
    )

})

const deleteTask = asyncHandler(async (req, res) => {

    await Task.findByPk(req.params.id).then((task) => {
        task.destroy()
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Task deleted successfully")
    )

})

const toggleTaskStatus = asyncHandler(async (req, res) => {

    await Task.findByPk(req.params.id).then((task) => {
        task.status = task.status === "To Do" ? "In Progress" : "To Do"
        task.save()
    })

    return res
    .status(200)
    .json(    
        new ApiResponse(200, null, "Task status updated successfully")
    )
})


export {createTask,
        getAllTasks,
        getTaskById,
        updateTask,
        deleteTask,
        toggleTaskStatus
}