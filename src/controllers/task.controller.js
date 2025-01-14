import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js"
import Task from "../models/task.model.js";
import ApiResponse from "../utils/ApiResponse.js";


const createTask = asyncHandler(async (req, res) => {

    const {title, status} = req.body
    const {projectId} = req.params.id

    if(!title || !status || !projectId){
        throw new ApiError(400, "Missing required fields")
    }

    if(status !== "To Do" && status !== "In Progress" && status !== "Done"){
        throw new ApiError(400, "Invalid status (Only To Do, In Progress and Done are allowed)")
    }

    if(!projectId){
        throw new ApiError(400, "Project ID is required")
    }

    const task = await Task.create({
        title: title,
        status: status,
        projectId: projectId
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

    const {title, status} = req.body

    if(status !== "To Do" && status !== "In Progress" && status !== "Done"){
        throw new ApiError(400, "Invalid status (Only To Do, In Progress and Done are allowed)")
    }

    if(!title || !status){
        throw new ApiError(400, "Missing required fields")
    }



    await Task.findByPk(req.params.id).then((task) => {
        task.title = title
        task.status = status
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

    const {taskId} = req.params.id
    const {task} = req.body

    if(!taskId){
        throw new ApiError(400, "Task ID is required")
    }

    if(!task){
        throw new ApiError(400, "Task is required")
    }

    if(task.status !== "To Do" && task.status !== "In Progress" && task.status !== "Done"){
        throw new ApiError(400, "Invalid status (Only To Do, In Progress and Done are allowed)")
    }




    await Task.findByPk(taskId).then((task) => {
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