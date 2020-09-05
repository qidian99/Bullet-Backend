const aggregateBulletsInRoom = async (parent, {
  roomId
}, {
  user
}) => {
  const currentUser = await getCurrentUser(user);
  const currentRoom = await getCurrentRoom(roomId);

  if (currentRoom.public === false && !currentRoom.users.includes(currentUser._id)) {
    throw new Error("Room retrieval failed: room is private.");
  }

  // Aggregate bullets by source

  const aggregate = await Bullet.aggregate([{
    $match: {
      roomId: ObjectId(roomId),
    }
  },
  // {
  // 	$lookup: {
  // 		from: "rooms",
  // 		localField: "roomId",
  // 		foreignField: "_id",
  // 		as: "rooms"
  // 	}
  // },
  // {
  // 	"$unwind": "$rooms"
  // },
  {
    $group: {
      _id: {
        source: "$source"
      },
      updatedAt: {
        $max: "$updatedAt"
      },
      bullets: {
        $push: {
          _id: "$_id",
          tags: "$tags",
          userId: "$userId",
          timestamp: "$timestamp",
          content: "$content",
          createdAt: "$createdAt:",
          updatedAt: "$updatedAt",
        }
      },
    }
  },
  {
    $project: {
      source: "$_id.source",
      updatedAt: "$updatedAt",
      bullets: "$bullets",
    }
  },
  {
    $sort: {
      updatedAt: -1
    }
  },
  ])

  // console.log(aggregate);

  return aggregate;
}
