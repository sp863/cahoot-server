const { default: mongoose } = require("mongoose");
const Message = require("../../models/Message");
const Project = require("../../models/Project");
const Room = require("../../models/Room");
const { getFileUrl } = require("../../aws/s3");
const { Translate } = require("@google-cloud/translate").v2;

exports.createRoom = async (req, res, next) => {
  const { belongsToProject, users } = req.body;

  const newRoom = new Room({
    belongsToProject,
    users,
  });

  const project = await Project.findById(belongsToProject);

  if (!project) return res.status(409).send({ result: "failure" });

  project.rooms.push(newRoom);

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  await newRoom.save({ session: mongoSession });
  await project.save({ session: mongoSession });

  await mongoSession.commitTransaction();
  mongoSession.endSession();

  return res.send(newRoom._id);
};

exports.getRoom = async (req, res, next) => {
  const { room_id } = req.params;

  const room = await Room.findById(room_id)
    .populate("users")
    .populate("chats")
    .lean();

  const filteredUsers = room.users.map((user) => {
    return {
      name: user.name,
      email: user.email,
      imageKey: user.profileImageKey,
    };
  });

  for (const user of filteredUsers) {
    const url = await getFileUrl(user.imageKey);
    user.imageUrl = url;
  }

  room.users = filteredUsers;

  if (!room) return res.status(409).send({ result: "failure" });

  return res.send(room);
};

exports.getRoomsByUsers = async (req, res, next) => {
  const { rooms, user_id, members } = req.query;
  const filteredRooms = [];

  for (const room_id of rooms) {
    const room = await Room.findById(room_id).populate("users").lean();

    if (!room) return res.status(409).send({ result: "failure" });
    room.users = room.users.map((user) => user._id.toString());
    filteredRooms.push(room);
  }

  const otherMembers = members.filter((member) => member !== user_id);
  const roomsByMembers = otherMembers.map((member) => {
    for (const room of filteredRooms) {
      if (room.users.includes(user_id) && room.users.includes(member)) {
        return room._id.toString();
      }
    }
  });

  return res.send(roomsByMembers);
};

exports.updateChat = async (chatData) => {
  const room = await Room.findById(chatData.room);

  const newMessage = new Message({
    sentBy: {
      name: chatData.sentBy.name,
      email: chatData.sentBy.email,
      imageUrl: chatData.sentBy.imageUrl,
    },
    message: chatData.message,
    sent: chatData.sent,
  });

  room.chats.push(newMessage);

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  await newMessage.save({ session: mongoSession });
  await room.save({ session: mongoSession });

  await mongoSession.commitTransaction();
  mongoSession.endSession();
};

exports.translateMessage = async (req, res, next) => {
  const { message_id } = req.params;
  const message = await Message.findById(message_id).lean();

  if (!message) return res.status(409).send({ result: "failure" });

  const translate = new Translate();
  const target = "ko";
  const [translation] = await translate.translate(message.message, target);

  res.send(translation);
};
