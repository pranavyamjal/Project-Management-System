import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Project from "../models/project.model.js";
import ApiResponse from "../utils/ApiResponse.js";


const createProject = asyncHandler(async (req, res) => {

    const {name, description} = req.body

    const project = await Project.create({
        name,
        description
    })  

    if(!project){
        throw new ApiError(400, "Project not created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Project created successfully")
    )

})

const getAllProjects = asyncHandler(async (req, res) => {

    const projects = await Project.findAll()

    if(!projects){
        throw new ApiError(400, "Projects not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, projects, "Projects fetched successfully")
    )

})

const getProjectById = asyncHandler(async (req, res) => {

    const project = await Project.findByPk(req.params.id)

    if(!project){
        throw new ApiError(400, "Project not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, project, "Project fetched successfully")
    )

})

const updateProject = asyncHandler(async (req, res) => {

    const {name, description} = req.body

    await Project.findByPk(req.params.id).then((project) => {
        project.name = name
        project.description = description
        project.save()
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Project updated successfully")
    )

})

const deleteProject = asyncHandler(async (req, res) => {

    await Project.findByPk(req.params.id).then((project) => {
        project.destroy()
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Project deleted successfully")
    )

})

const assignUserToProject = asyncHandler(async (req, res) => {

    await Project.findByPk(req.params.id).then((project) => {
        project.userId = req.user.id
        project.save()
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "User assigned to project successfully")
    )

})

const removeUserFromProject = asyncHandler(async (req, res) => {

    await Project.findByPk(req.params.id).then((project) => {
        project.userId = null
        project.save()
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "User removed from project successfully")
    )

})

const getProjectAssignedToUser = asyncHandler(async (req, res) => {

    const projects = await Project.findAll({
        where: {
            userId: req.user.id
        }
    })

    if(!projects){
        throw new ApiError(400, "Projects not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, projects, "Projects fetched successfully")
    )

})



export {createProject,
        getAllProjects,
        getProjectById,
        updateProject,
        deleteProject,
        assignUserToProject,
        removeUserFromProject,
        getProjectAssignedToUser

}