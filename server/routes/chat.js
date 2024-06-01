import { Router } from "express";
import dotnet from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import user from '../helpers/user.js'
import jwt from 'jsonwebtoken'
import chat from "../helpers/chat.js";
import { get_encoding, encoding_for_model, Tiktoken } from "tiktoken";

dotnet.config()

let router = Router()
//Checks if session is active for the user if yes, it redirects to the chat window instead of login/signup
const CheckUser = async (req, res, next) => {
    jwt.verify(req.cookies?.userToken, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
        if (decoded) {
            let userData = null

            try {
                userData = await user.checkUserFound(decoded)
            } catch (err) {
                if (err?.notExists) {
                    res.clearCookie('userToken')
                        .status(405).json({
                            status: 405,
                            message: err?.text
                        })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: err
                    })
                }
            } finally {
                if (userData) {
                    req.body.userId = userData._id
                    next()
                }
            }

        } else {
            res.status(405).json({
                status: 405,
                message: 'Not Logged'
            })
        }
    })
}

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

router.get('/', (req, res) => {
    res.send("Welcome to chatGPT clone application")
})
// Add the new message to the chat and also updates token usage, does not allow to enter message if user has excedded the token limit
router.post('/', CheckUser, async (req, res) => {
    const { prompt, userId } = req.body

    let response = {}

    try {
        let limit=0;
        console.log("USERIS:"+userId);
        limit = await chat.getTokenSize(userId);
        if(limit == null)
            limit=0;
        console.log(limit)
        if(limit<5000){
            response.openai = await openai.createCompletion({
                model: "gpt-3.5-turbo-instruct",
                prompt: prompt,
                temperature: 0.6, 
                max_tokens: 500, 
              });
            
            if (response?.openai?.data?.choices?.[0]?.text) {
                response.openai = response.openai.data.choices[0].text
                let index = 0
                for (let c of response['openai']) {
                    if (index <= 1) {
                        if (c == '\n') {
                            response.openai = response.openai.slice(1, response.openai.length)
                        }
                    } else {
                        break;
                    }
                    index++
                }    
                const encoder = encoding_for_model("gpt-3.5-turbo");
                const tokens = encoder.encode(prompt+response);
                encoder.free();
                let tokenCount = tokens.length+limit
                response.db = await chat.newResponse(prompt, response, userId,tokenCount)
                
               
            }
        }
        else{
            res.status(200).json({status:200, message: "Token Limit exceeded!"});
        }
        
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response?.openai) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    _id: response.db['chatId'],
                    content: response.openai
                }
            })
        }
    }
})
//updates the conversation, adds new message to the window 
router.put('/', CheckUser, async (req, res) => {
    const { prompt, userId, chatId } = req.body

    let response = {}

    try {
        let limit = await chat.getTokenSize(userId);
        response.openai = await openai.createCompletion({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            temperature: 0.6, 
            max_tokens: 500, 
          });
        console.log("I am inside this")
        if (response?.openai?.data?.choices?.[0]?.text) {
            response.openai = response.openai.data.choices[0].text
            let index = 0
            for (let c of response['openai']) {
                if (index <= 1) {
                    if (c == '\n') {
                        response.openai = response.openai.slice(1, response.openai.length)
                    }
                } else {
                    break;
                }
                index++
            }
            if(limit == null)
                limit =0;
            const encoder = encoding_for_model("gpt-3.5-turbo");
                console.log("before calling token counter line 98 rotes chat");
                
                const tokens = encoder.encode(prompt+response);
                encoder.free();
                console.log("hiiii"+tokens.length);
                let tokenCount = tokens.length+limit
                
            response.db = await chat.updateChat(chatId, prompt, response, userId,tokenCount);
            
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response?.openai) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    content: response.openai
                }
            })
        }
    }
})

router.get('/saved', CheckUser, async (req, res) => {
    const { userId } = req.body
    const { chatId = null } = req.query

    let response = null

    try {
        response = await chat.getChat(userId, chatId)
    } catch (err) {
        if (err?.status === 404) {
            res.status(404).json({
                status: 404,
                message: 'Not found'
            })
        } else {
            res.status(500).json({
                status: 500,
                message: err
            })
        }
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: response
            })
        }
    }
})
//store messages history
router.get('/history', CheckUser, async (req, res) => {
    const { userId } = req.body

    let response = null

    try {
        response = await chat.getHistory(userId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: "Success",
                data: response
            })
        }
    }
})
//counts number of tokens used
router.get('/tokenUsage', CheckUser, async (req, res) => {
    const { userId } = req.body
    console.log("req body"+userId)
    console.log("SUER ID: "+userId);

    let response = null

    try {
        response = await chat.getTokenSize(userId);
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: "Success",
                data: response
            })
        }
    }
})
//Deletes all conversations if user clicks on delete conversation
router.delete('/all', CheckUser, async (req, res) => {
    const { userId } = req.body

    let response = null

    try {
        response = await chat.deleteAllChat(userId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success'
            })
        }
    }
})

export default router