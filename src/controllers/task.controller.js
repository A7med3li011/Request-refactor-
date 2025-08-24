import DocumentModel from "../../DataBase/models/document.model.js";
import projectModel from "../../DataBase/models/project.model.js";
import tagModel from "../../DataBase/models/tags.model.js";
import taskModel from "../../DataBase/models/task.model.js";
import userModel from "../../DataBase/models/userModel.js";
import getMessage from "../locales/translator.js";
import { AppError } from "../utilities/AppError.js";
import { deleteFile } from "../utilities/deleteFile.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createTask = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const {
    project,
    tag,
    title,
    description,
    startDate,
    endDate,
    unit,
    priority,
    responsible,
    type,
    price,
    quantity,
  } = req.body;

  const [projectExist, tagExist, responsibleExist] = await Promise.all([
    projectModel.findById(project),
    tagModel.findById(tag),
    userModel.findById(responsible),
  ]);

  if (!projectExist)
    return next(new AppError(getMessage(lang, "project_notFound"), 404));
  if (!tagExist)
    return next(new AppError(getMessage(lang, "tag_notFound"), 404));
  if (!responsibleExist)
    return next(new AppError(getMessage(lang, "USERNOTFOUNDED"), 404));

  if (
    new Date(startDate) < new Date(projectExist.startDate) ||
    new Date(startDate) > new Date(projectExist.endDate)
  )
    return next(new AppError(getMessage(lang, "outside_startDate"), 400));
  if (
    new Date(endDate) > new Date(projectExist.endDate) ||
    new Date(endDate) < new Date(projectExist.startDate)
  )
    return next(new AppError(getMessage(lang, "outside_endDate"), 400));

  if (
    !projectExist.members.some(
      (member) => member.toString() === responsible.toString()
    )
  ) {
    return next(new AppError(getMessage(lang, "responsibility_notfound"), 400));
  }
  let obj = {
    title,
    description,
    unit,
    priority,
    createdBy: req.user._id,
    responsible,
    project,
    startDate,
    endDate,
  };

  if (type == "toq") {
    let totalCost = 0;
    const toqTasksInProject = await taskModel.find({
      project,
      type: "toq",
    });

    if (toqTasksInProject && toqTasksInProject.length) {
      totalCost = toqTasksInProject.reduce((acc, curr) => {
        return acc + curr.price * curr.quantity;
      }, 0);
    }
    totalCost += price * quantity;

    if (totalCost > projectExist.budget)
      return next(new AppError(getMessage(lang, "exceeded_buget"), 409));

    obj.price = price;
    obj.quantity = quantity;
    obj.total = price * quantity;
  }

  await taskModel.create(obj);
  res
    .status(201)
    .json({ success: true, message: getMessage(lang, "task_created") });
});
export const uploadFiles = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const { taskId } = req.body;

  if (!req.file)
    return next(new AppError(getMessage(lang, "doc_required"), 404));

  const taskExist = await taskModel.findById(taskId);

  if (!taskExist)
    return next(new AppError(getMessage(lang, "task_notFound"), 404));

  await DocumentModel.create({
    task: taskExist._id,
    link: req.file.filename,
    createdBy: req.user._id,
  });

  res
    .status(201)
    .json({ success: true, message: getMessage(lang, "doc_uploaded") });
});
export const addNote = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const { title, taskId } = req.body;

  const taskExist = await taskModel.findById(taskId);

  if (!taskExist)
    return next(new AppError(getMessage(lang, "task_notFound"), 404));

  const note = {
    createdBy: req.user._id,
    title,
    createdAt: Date.now(),
  };

  await taskModel.findByIdAndUpdate(taskId, {
    $push: { notes: note },
  });

  res
    .status(201)
    .json({ success: true, message: getMessage(lang, "note_added") });
});
export const getTasks = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const tasks = await tagModel.find();
});
export const getTaskbyId = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { id } = req.params;

  const task = await taskModel
    .findById(id)
    .populate("notes.createdBy", "name  profileImage")
    .populate("responsible", "name  profileImage")
    .populate("createdBy", "name role profileImage")
    .populate({
      path: "project",
      select: "name",
      populate: [
        {
          path: "owner",
          select: "name profileImage",
        },
        {
          path: "contractor",
          select: "name profileImage",
        },
        {
          path: "consultant",
          select: "name profileImage",
        },
      ],
    })
    .lean();

  if (!task) return next(new AppError(getMessage(lang, "task_notFound"), 404));

  const docs = await DocumentModel.find({ task: task._id })
    .select("link createdAt createdBy")
    .populate("createdBy", "name profileImage");
  console.log(docs);
  task.attachments = docs;
  res.status(200).json({ message: getMessage(lang, "task_Found"), data: task });
});
export const deleteTaskbyId = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { id } = req.params;

  const task = await taskModel.findByIdAndDelete(id);

  if (!task) return next(new AppError(getMessage(lang, "task_notFound"), 404));

  const allDocRealted = await DocumentModel.find({ task: task._id });
  if (allDocRealted && allDocRealted.length) {
    for (const doc of allDocRealted) {
      deleteFile("tasks", doc.link);
      await DocumentModel.findByIdAndDelete(doc._id);
    }
  }
  res
    .status(200)
    .json({ success: true, message: getMessage(lang, "task_deleted") });
});
export const deleteFilebyId = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { taskId, fileId } = req.params;

  const task = await taskModel.findByIdAndDelete(taskId);

  if (!task) return next(new AppError(getMessage(lang, "task_notFound"), 404));
  const doc = await DocumentModel.findByIdAndDelete(fileId);

  if (!doc) return next(new AppError(getMessage(lang, "doc_notfound"), 404));

  deleteFile("tasks", doc.link);
  await DocumentModel.findByIdAndDelete(doc._id);

  res
    .status(200)
    .json({ success: true, message: getMessage(lang, "doc_deleted") });
});
export const updateTaskbyId = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const {
    project,
    tag,
    title,
    description,
    startDate,
    endDate,
    unit,
    priority,
    responsible,
    type,
    price,
    quantity,
  } = req.body;

  const { id } = req.params;

  const taskExist = await taskModel.findById(id);

  if (!taskExist)
    return next(new AppError(getMessage(lang, "task_notFound"), 404));

  const [projectExist, tagExist, responsibleExist] = await Promise.all([
    projectModel.findById(project),
    tagModel.findById(tag),
    userModel.findById(responsible),
  ]);

  if (!projectExist)
    return next(new AppError(getMessage(lang, "project_notFound"), 404));
  if (!tagExist)
    return next(new AppError(getMessage(lang, "tag_notFound"), 404));
  if (!responsibleExist)
    return next(new AppError(getMessage(lang, "USERNOTFOUNDED"), 404));

  taskExist.project = project;
  taskExist.tag = tag;
  taskExist.responsible = responsible;
  taskExist.title = title;
  taskExist.description = description;
  taskExist.priority = priority;
  taskExist.unite = unit;
  if (
    new Date(startDate) < new Date(projectExist.startDate) ||
    new Date(startDate) > new Date(projectExist.endDate)
  )
    return next(new AppError(getMessage(lang, "outside_startDate"), 400));
  if (
    new Date(endDate) > new Date(projectExist.endDate) ||
    new Date(endDate) < new Date(projectExist.startDate)
  )
    return next(new AppError(getMessage(lang, "outside_endDate"), 400));

  if (
    !projectExist.members.some(
      (member) => member.toString() === responsible.toString()
    )
  ) {
    return next(new AppError(getMessage(lang, "responsibility_notfound"), 400));
  }
  taskExist.startDate = startDate;
  taskExist.endDate = endDate;

  if (type == "toq") {
    let totalCost = 0;
    const toqTasksInProject = await taskModel.find({
      project,
      type: "toq",
      _id: { $ne: id },
    });

    if (toqTasksInProject && toqTasksInProject.length) {
      totalCost = toqTasksInProject.reduce((acc, curr) => {
        return acc + curr.price * curr.quantity;
      }, 0);
    }
    totalCost += price * quantity;

    if (totalCost > projectExist.budget)
      return next(new AppError(getMessage(lang, "exceeded_buget"), 409));

    taskExist.price = price;
    taskExist.quantity = quantity;
    taskExist.total = price * quantity;
  }

  await taskExist.save();
  res.status(200).json({
    success: true,
    message: getMessage(lang, "task_updated"),
  });
});
export const UpdateexecutionTask = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const { id } = req.params;

  const { executed, approved, invoiced } = req.body;

  const taskExist = await taskModel.findById(id);

  if (!taskExist)
    return next(new AppError(getMessage(lang, "task_notFound"), 404));

  if (
    executed > taskExist.quantity ||
    approved > taskExist.quantity ||
    invoiced > taskExist.quantity
  ) {
    // console.log(executed, taskExist.executed);
    // console.log(approved, taskExist.approved);
    // console.log(invoiced, taskExist.invoiced);

    return next(new AppError(getMessage(lang, "invlaid_quantity"), 400));
  }
  const projectExist = await projectModel.findById(taskExist.project);
  if (!projectExist)
    return next(new AppError(getMessage(lang, "project_notFound"), 404));

  if (
    taskExist.executed != executed &&
    projectExist?.contractor?.toString() != req.user._id.toString()
  )
    return next(new AppError(getMessage(lang, "executed_err"), 403));
  if (
    taskExist.approved != approved &&
    projectExist?.consultant?.toString() != req.user._id.toString()
  )
    return next(new AppError(getMessage(lang, "approved_err"), 403));
  if (
    taskExist.invoiced != invoiced &&
    projectExist?.owner?.toString() != req.user._id.toString()
  )
    return next(new AppError(getMessage(lang, "invoiced_err"), 403));

  taskExist.executed = executed;
  taskExist.approved = approved;
  taskExist.invoiced = invoiced;
  await taskExist.save();

  return res
    .status(200)
    .json({ success: true, message: getMessage(lang, "task_updated") });
});
