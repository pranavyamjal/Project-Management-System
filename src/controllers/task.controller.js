import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js"
import Task from "../models/task.model.js";
import ApiResponse from "../utils/ApiResponse.js";


const createTask = asyncHandler(async (req, res) => {

    const {title, status} = req.body
<<<<<<< HEAD
    const projectId = req.params.id
=======
    const {projectId} = req.params.id
>>>>>>> 53e17ee20859de535edfc030e7750c0f6359eb4d

    console.log(projectId);
    console.log(req.params);
    console.log(req.body);

    if(!title || !status){
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
        new ApiResponse(200, task, "Task -created successfully")
    )

})

const getAllTasks = asyncHandler(async (req, res) => {

    const tasks = await Task.findAll()

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

    if(status !== 'To Do' && status !== 'In Progress' && status !== 'Done'){
        throw new ApiError(400, "Invalid status (Only To Do, In Progress and Done are allowed)")
    }

    if(!title || !status){
        throw new ApiError(400, "Missing required fields")
    }



    const updatedTask =  await Task.findByPk(req.params.id);
    updatedTask.title = title || task.title;
    updatedTask.status = status || task.status;
    await updatedTask.save();

    if(!updatedTask){
        throw new ApiError(400, "Task not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTask, "Task updated successfully")
    )

})

const deleteTask = asyncHandler(async (req, res) => {

<<<<<<< HEAD
    const taskId = req.params.id
=======
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
>>>>>>> 53e17ee20859de535edfc030e7750c0f6359eb4d

    if(!taskId){
        throw new ApiError(400, "Task ID is required")
    }

    const deletedTask = await Task.findByPk(req.params.id);
                        await deletedTask.destroy();

    if(!deletedTask){
        throw new ApiError(400, "Task not found")
    }


    if(!deletedTask){
        throw new ApiError(400, "Task not found")
    }


    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedTask, "Task deleted successfully")
    )

})

const toggleTaskStatus = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const { status: newStatus } = req.body;  // Extract the new status from request body

    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    // Validate the new status
    const validStatuses = ["To Do", "In Progress", "Done"];
    if (!validStatuses.includes(newStatus)) {
        throw new ApiError(400, "Invalid status. Only 'To Do', 'In Progress', and 'Done' are allowed.");
    }

    // Find the task by ID
    const task = await Task.findByPk(taskId);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Update task status
    task.status = newStatus;
    await task.save();

    // Return the updated task in the response
    return res.status(200).json(
        new ApiResponse(200, task, "Task status updated successfully")
    );
});



export {createTask,
        getAllTasks,
        getTaskById,
        updateTask,
        deleteTask,
        toggleTaskStatus
}