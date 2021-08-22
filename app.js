const express = require('express')

const app = express()

app.use(express.json())

const {sequelize, User, Post} = require('./models')

//CREATE A USER
app.post('/users', async (req, res) => {
    const {
        body: {
            name,
            email,
            role
        }
    } = req

    try {
        const newUser = await User.create({
            name,
            email,
            role
        })

        return res.status(201).json(newUser)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong!', err: error})
    }
})

//GET ALL USERS
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll()
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong!', err: error})
    }
})

//GET USER BY ID
app.get('/users/:uuid', async (req, res) => {
    const {
        params: {
            uuid
        }
    } = req
    try {
        const user = await User.findOne({
            where: {uuid},
            include: 'posts'
        })
        return res.status(200).json(user)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong!'})
    }
})

//DELETE A USER
app.delete('/user/delete/:uuid', async (req, res) => {
    const {
        params: {
            uuid
        }
    } = req
    try {
        const user = await User.findOne({where: {uuid}})
        await user.destroy()
        return res.status(201).json({massage: 'User deleted.'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong!', err: error})
    }
})

//UPDATE A USER
app.put('/user/update/:uuid', async (req, res) => {
    const {
        params: {
            uuid
        },
        body: {
            name,
            email,
            role
        }
    } = req
    try {
        const updatedUser = await User.findOne({where: {uuid}})
        updatedUser.name = name
        updatedUser.email = email
        updatedUser.role = role

        await updatedUser.save()
        return res.status(200).json(updatedUser)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong!', err: error})
    }
})

//CREATE POST
app.post('/post', async (req, res) => {
    const {
        body: {
            body,
            userUuid
        }
    } = req
    try {
        const user = await User.findOne({where: {uuid:userUuid}})
        console.log(user)
        const post = await Post.create({
            body,
            userId: user.id
        })
        return res.status(201).json(post)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong!', err: error})
    }
})

//GET ALL POSTS
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll({include: 'user'})
        return res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong!', err: error})
    }
})

//DELETE POST
app.delete('/post/delete/:uuid', async (req, res) => {
    const {
        params: {
            uuid
        }
    } = req
    try {
        const post = await Post.findOne({where: {uuid}})
        await post.destroy()
        return res.status(200).json({message: 'Post deleted.'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong!', err: error})
    }
})

//UPDATE POST
app.put('/post/update/:uuid', async (req, res) => {
    const {
        params: {
            uuid
        },
        body: {
            body
        }
    } = req
    try {
        const updatedPost = await Post.findOne({where: {uuid}})
        updatedPost.body = body
        await updatedPost.save()
        return res.status(200).json(updatedPost)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Something went wrong!', err: error})
    }
})



app.listen({port: 5000}, async () => {
    console.log('Server up ad http://localhost:5000')
    await sequelize.authenticate()
    console.log('Database connected!')
})