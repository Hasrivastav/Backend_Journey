import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    
    const userId = req.user?._id

    try {
        // Subscriber count
        const countSubs = await Subscription.countDocuments(
                {
                    channel: new mongoose.Types.ObjectId(userId)
                },
        ) 

        // total video views, total video likes & total videos fetched from this pipeline.
        const videosInfo = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },
            {
                $project: {
                    _id: 0,
                    likes: {
                        $size: "$likes"
                    },
                    views: "$views",
                    videos: 1
                }
            },
            {
                $group: {
                    _id: null,
                    totalLikes: {
                        $sum: "$likes"
                    },
                    totalViews: {
                        $sum: "$views"
                    },
                    totalvideos: {
                        $sum: 1
                    }
                }
            }
        ]);

        console.log("videosInfo :", videosInfo)

        const channelStats = {
            subscriberCount : `${countSubs}` || 0,
            totalLikesCount: videosInfo[0]?.totalLikes || 0,
            totalViewsCount: videosInfo[0]?.totalViews || 0,
            totalVideosCount: videosInfo[0]?.totalvideos || 0
        };

        console.log("channelStats :", channelStats)
        
        return res
            .status(200)
            .json(
                new ApiResponse(200, {channelStats}, "Dashboard created successfully.")
            )
    } 
    catch (error) {
        new ApiError(500, "Getting error in fetching the dashboard stats.")
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const { userId } = req.user?._id;

   const channelVideos = await Video.aggregate([
      {
         $match: {
            owner: new mongoose.Types.ObjectId(userId),
         },
      },
      {
         $lookup: {
            from: "likes",
            foreignField: "videos",
            localField: "_id",
            as: "likes",
         },
      },
      {
         $addFields: {
            createdAt: {
               $dateToParts: {
                  $date: "$createdAt",
               },
            },
            likesCount: {
               $size: "$likes",
            },
         },
      },
      {
         $project: {
            _id: 1,
            title: 1,
            description: 1,
            duration: 1,
            "videoFile.url": 1,
            "thumbnail.url": 1,
            createdAt: {
               day: 1,
               month: 1,
               year: 1,
            },
            isPublished: 1,
            likesCount: 1,
         },
      },
   ]);

   if (!channelVideos) {
      throw new ApiErrors(500, "Failed To fetch Channel Videos");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            201,
            channelVideos,
            "channel stats fetched successfully"
         )
      );
})

export {
    getChannelStats, 
    getChannelVideos
    }