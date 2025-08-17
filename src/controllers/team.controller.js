import projectModel from "../../DataBase/models/project.model.js";
import teamModel from "../../DataBase/models/team.model.js";
import userModel from "../../DataBase/models/userModel.js";
import vocationModel from "../../DataBase/models/vocations.model.js";
import getMessage from "../locales/translator.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";
import bcrypt from "bcrypt";
export const createTeamMember = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const { name, email, password, phone, vocation, rights, projects } = req.body;

  const userExist = await userModel.findOne({
    $or: [{ email: email.toLowerCase() }, { phone }],
  });
  if (userExist) {
    const errorKey =
      userExist.email === email.toLowerCase() ? "EMAILEXIST" : "PhoneExist";
    return next(new AppError(getMessage(lang, errorKey), 409));
  }

  const vocationExist = await vocationModel.findById(vocation);
  if (!vocationExist) {
    return next(new AppError(getMessage(lang, "vocation_notFound"), 404));
  }

  for (const project of projects) {
    const projectExist = await projectModel.findById(project);
    if (!projectExist) {
      return next(new AppError(getMessage(lang, "project_notFound"), 404));
    }
  }

  const hashedPassword = await bcrypt.hash(password, +process.env.SLAT);
  const newUser = await userModel.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    rights,
    role: "user",
  });

  const newMember = {
    userId: newUser._id,
    vocation: vocationExist._id,
    projects: projects,
  };

  const masterUserHasTeam = await teamModel.findOne({
    createdBy: req.user._id,
  });

  if (masterUserHasTeam) {
    masterUserHasTeam.memebers.push(newMember);
    await masterUserHasTeam.save();
    for (const project of projects) {
      const projectExist = await projectModel.findByIdAndUpdate(project, {
        $push: { members: newUser._id },
      });
    }
    return res.status(201).json({
      status: "success",
      message: getMessage(lang, "CREATEUSER"),
    });
  } else {
    const newTeam = await teamModel.create({
      createdBy: req.user._id,
      memebers: [newMember],
    });

    for (const project of projects) {
      const projectExist = await projectModel.findByIdAndUpdate(project, {
        $push: { members: newUser._id },
      });
    }

    return res.status(201).json({
      status: "success",
      message: getMessage(lang, "CREATEUSER"),
    });
  }
});

export const getTeamMembers = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const userExits = await userModel.findById(req.user._id);
  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const team = await teamModel
    .findOne({ createdBy: req.user._id })
    .populate({
      path: "memebers.userId",
      select: "name email role rights image profileImage",
    })
    .populate({
      path: "memebers.vocation",
      select: "title title_ar",
    })
    .populate({
      path: "memebers.projects",
      select: "title",
    });

  res.status(200).json({
    succeess: true,
    message: getMessage(lang, "team_found"),
    data: team,
  });
});

export const deleteTeamMember = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const { id } = req.params;
  const userExits = await userModel.findOne({ _id: id, role: "user" });

  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  //remove from projects
  const realtedProjects = await teamModel.findOne({
    createdBy: req.user._id,
  });
  const filterPojects = realtedProjects?.memebers?.filter(
    (ele) => ele?.userId?.toString() === id
  );
  const projectIds = filterPojects?.flatMap((member) => member?.projects);

  if (projectIds && projectIds.length) {
    await projectModel.updateMany(
      { _id: { $in: projectIds } },
      { $pull: { members: id } }
    );
  }

  //remove from teams
  const popMember = realtedProjects?.memebers?.filter(
    (ele) => ele?.userId?.toString() !== id
  );

  await teamModel.findOneAndUpdate(
    { createdBy: req.user._id },
    {
      $set: { memebers: popMember },
    }
  );

  // remove from userCollection

  await userModel.findByIdAndDelete(id);
  res
    .status(200)
    .json({ succeess: true, message: getMessage(lang, "user_deleted") });
});


