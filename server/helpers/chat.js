import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId } from "mongodb";
import user from "./user.js";

export default {
    newResponse: (prompt, { openai }, userId,tokenCount) => {
         
        return new Promise(async (resolve, reject) => {
            // Calculate the number of characters
            let res = null
            let chatId = new ObjectId().toHexString()
            try {
                
                await db.collection(collections.CHAT).createIndex({ user: 1 }, { unique: true })
                let token={
                }
               /console.log("before update query tc"+tokenCount)
                token = await db.collection(collections.USER).updateOne({
                    _id: userId
                }, {
                    $set: {
                        tokenCount: tokenCount
                    }
                })
                console.log("after update query tc")
                res = await db.collection(collections.CHAT).insertOne({
                    user: userId.toString(),
                    
                    data: [{
                        chatId,
                        chats: [{
                            prompt,
                            content: openai
                        }]
                    }],
                    
                })
            } catch (err) {
                console.log("ERRR"+err)
                if (err?.code === 11000) {
                    res = await db.collection(collections.CHAT).updateOne({
                        user: userId.toString(),
                    }, {
                        $push: {
                            data: {
                                chatId,
                                chats: [{
                                    prompt,
                                    content: openai
                                }]
                            }
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    reject(err)
                }
            } finally {
                if (res) {
                    res.chatId = chatId
                    resolve(res)
                } else {
                    reject({ text: "DB gets something wrong" })
                }
            }
        })
    },
    updateChat: (chatId, prompt, { openai }, userId,tokenCount) => {
        return new Promise(async (resolve, reject) => {
            let token={
            }
           console.log("before update query tc"+tokenCount)
            token = await db.collection(collections.USER).updateOne({
                _id: userId
            }, {
                $set: {
                    tokenCount: tokenCount
                }
            })
            let res = await db.collection(collections.CHAT).updateOne({
                user: userId.toString(),
                'data.chatId': chatId
            }, {
                $push: {
                    'data.$.chats': {
                        prompt,
                        content: openai
                    }
                }
            },{
                $set: {
                    tokenCount: tokenCount
                }
            }).catch((err) => {
                reject(err)
            })

            if (res) {
                resolve(res)
            } else {
                reject({ text: "DB gets something wrong" })
            }
        })
    },
    getChat: (userId, chatId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $match: {
                        'data.chatId': chatId
                    }
                }, {
                    $project: {
                        _id: 0,
                        chat: '$data.chats'
                    }
                }
            ]).toArray().catch((err) => [
                reject(err)
            ])

            if (res && Array.isArray(res) && res[0]?.chat) {
                resolve(res[0].chat)
            } else {
                reject({ status: 404 })
            }
        })
    },
    getHistory: (userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $project: {
                        _id: 0,
                        chatId: '$data.chatId',
                        prompt: {
                            $arrayElemAt: ['$data.chats.prompt', 0]
                        }
                    }
                }, {
                    $limit: 10
                }, {
                    $sort: {
                        chatId: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })

            if (Array.isArray(res)) {
                resolve(res)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
    deleteAllChat: (userId) => {
        return new Promise((resolve, reject) => {
            db.collection(collections.CHAT).deleteOne({
                user: userId.toString()
            }).then((res) => {
                if (res?.deletedCount > 0) {
                    resolve(res)
                } else {
                    reject({ text: 'DB Getting Some Error' })
                }
            }).catch((err) => {
                reject(err)
            })
        })
    },
    getTokenSize:(userId)=>{
        return new Promise(async (resolve, reject) => {
            try {
              const userData = await db.collection(collections.USER).findOne({
              _id:new ObjectId(userId)
              });
          
              if (userData) {
                const token = userData.tokenCount;
                console.log("FOUND TOKEN"+token)
                resolve(token); // Resolve with the token if found
              } else {
                reject("User not found"); // Reject if user data not found
                console.log("Not FOUND TOKEN")
              }
            } catch (error) {
                console.log("Not FOUND TOKEN catch block"+error)
              reject(error); // Reject if any error occurs during database operation
            }
          });
    }
}