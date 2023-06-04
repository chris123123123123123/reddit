const express = require('express')
const bodyParser = require('body-parser');
const { v4: uuidv4} = require('uuid')
const app = express()
const hocuspocusServer = require('@hocuspocus/server')
const { Logger } =  require("@hocuspocus/extension-logger")
const { SQLite } = require('@hocuspocus/extension-sqlite')
const {faker} = require('@faker-js/faker')
const session = require('express-session')
const path = require('path');



const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./localStorage');


// Retrieve data from local storage
let users = JSON.parse(localStorage.getItem("users")) || []
let subreddits = JSON.parse(localStorage.getItem("subreddits")) || []
let posts = JSON.parse(localStorage.getItem("posts")) || []
let comments = JSON.parse(localStorage.getItem("comments")) || []



function User(id, username, email, password, dateCreated, avatarImage) {
    this.id = id
    this.username = username;
    this.email = email;
    this.password = password;
    this.dateCreated = dateCreated;
    this.avatarImage = avatarImage
}

function Subreddit(id, name, description, creator, dateCreated, avatarImage, bannerImage) {
    this.id = id
    this.name = name;
    this.description = description;
    this.creator = creator;
    this.dateCreated = dateCreated
    this.avatarImage = avatarImage
    this.bannerImage = bannerImage
}

function Post(id, title, body, subredditID, authorID, upvotes, downvotes, dateCreated, type, image) {
    this.id = id
    this.title = title;
    this.body = body;
    this.subredditID = subredditID;
    this.authorID = authorID;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.dateCreated = dateCreated;
    this.type = type;
    this.image = image;
}

function Comment(id, postID, authorID, upvotes, body, parentCommentID, dateCreated, replies) {
    this.id = id
    this.postID = postID;
    this.parentCommentID = parentCommentID;
    this.upvotes = upvotes;
    this.body = body;
    this.authorID = authorID;
    this.dateCreated = dateCreated;
    this.replies = replies;
}

function Message(senderID, content) {
    this.senderID = senderID
    this.content = content
    this.timestamp = new Date()
}

// ID incrementer
function getNextID(objects) {
    if (objects.length == 0) {
        let id = 0
        return id
    } else {
        let lastObject = objects[objects.length - 1];
        let lastID = lastObject.id
        let id = lastID + 1
        console.log(id, parseInt(id))
        return parseInt(id)
    }  
  }


//User CRUD
function addUser(username, email, password) {
    const id = getNextID(users)
    const avatarImage = faker.image.avatar()
    const user = new User(id, username, email, password, new Date(), avatarImage)
    users[id] = user
    localStorage.setItem('users', JSON.stringify(users))
    return user
}

function getUser(id) {
    return users[id]
}


//Subreddit CRUD


function addSubreddit(name, description, creatorID) {
    const id = getNextID(subreddits)
    const avatarImage = faker.image.avatar()
    const bannerImage = faker.image.url() 
    const subreddit = new Subreddit(id, name, description, creatorID, new Date(), avatarImage, bannerImage);
    subreddits.push(subreddit)
    localStorage.setItem('subreddits', JSON.stringify(subreddits));
    return subreddit;
  }


// comments CRUD
function findParentCommentById(commentsArray, parentCommentID, comment) {  
    commentsArray.forEach( c => { 
        
        if (c.id == parentCommentID) {
            c['replies'].push(comment)
        }
        if (c.replies.length > 0) {
            let foundComment = findParentCommentById(c.replies, parentCommentID, comment)
            if (foundComment) {
                c['replies'].push(comment)
            }        
        }
    })
}


function addComment(postID, parentCommentID, authorID, body) { 
    const id = uuidv4() 
    const dateCreated = new Date();
    const replies = []
    const comment = new Comment(id, postID, authorID, null, body, parentCommentID, dateCreated, replies);
  
    if (parentCommentID === null ) {
        comments.push(comment)
    } else {     
        findParentCommentById(comments, parentCommentID, comment) 
    } 
    localStorage.setItem('comments', JSON.stringify(comments));   
  }
  
function getUserComments(userID) {
    return comments.filter( comment => comment.authorID == userID)
}

function getCommentsForPost(postID) {
    return comments.filter( comment => comment.postID == postID) || {}
}

function joinComments(comments) {
    return comments.map(com => {
        const author = users.find(u => u.id == com.authorID);
        const replies = joinComments(com.replies); // Recursive call
        return {
            ...com,
            author,
            replies
        };
    });
}

// post CRUD
function addPost(subredditID, authorID, title, body, type) {
    const id = getNextID(posts)
    const post = new Post(id, title, body, subredditID, authorID, 0, 0, new Date(), type)
    posts[id] = post
    localStorage.setItem('posts', JSON.stringify(posts));
   
}

function getPostByID(postID) {
    return posts.find( post => post.id == postID)
}

function getPostByUserID(userID) {
    return posts.filter( post => post.authorID == userID)
}

function updatePost(postID, content) {
    let post = getPostByID(postID)
    post.body = content
    localStorage.setItem('posts', JSON.stringify(posts))
}

function joinPosts(myPosts) {
    return myPosts.map(post => {
      const subreddit = subreddits.find(s => s.id == post.subredditID);
      const author = users.find(u => u.id == post.authorID);
      return {
        ...post,
        subreddit,
        author
      };
    });
  }



function subredditPosts(subredditID) {
    let subPosts = posts.filter( post => post.subredditID == subredditID);
    return joinPosts(subPosts)
}

  function joinedHotPosts() {
    const now = Date.now();
    const oneHour = 3600 * 1000;
    const hotPosts = posts.map(post => {
      const subreddit = subreddits.find(s => s.id == post.subredditID);
      const author = users.find(u => u.id == post.authorID);
      const ageHours = (now - new Date(post.dateCreated).getTime()) / oneHour;
      const score = Math.log10(post.upvotes - post.downvotes) + ageHours / 24;
  
      return {
        id: post.id,
        title: post.title,
        body: post.body,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        type: post.type,
        image: post.image,
        date: post.dateCreated,
        subreddit: subreddit,
        author: author,
        hotScore: score.toFixed(5)
      };
    }).filter(post => post.hotScore >= 0).sort((a, b) => b.hotScore - a.hotScore);
  
    return hotPosts;
  }

  function joinedNewPosts() {
    const newPosts = posts.map(post => {
        const subreddit = subreddits.find(s => s.id == post.subredditID);
        const author = users.find(u => u.id == post.authorID);
        return {
            id: post.id,
            title: post.title,
            body: post.body,
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            date: post.dateCreated,
            type: post.type,
            image: post.image,
            subreddit: subreddit,
            author: author,

        }
    }).sort((a, b) => {
        const dateA = new Date(a.dateCreated)
        const dateB = new Date(b.dateCreated)
        return  dateB - dateA
    });

    return newPosts.reverse()

  }

  function joinedTopPosts() {
    const topPosts = posts.map(post => {
        const subreddit = subreddits.find(s => s.id == post.subredditID);
        const author = users.find(u => u.id == post.authorID);
        return {
            id: post.id,
            title: post.title,
            body: post.body,
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            date: post.dateCreated,
            type: post.type,
            image: post.image,
            subreddit: subreddit,
            author: author,

        }
    }).sort((a, b) => {
        const totalVotesA = a.upvotes - a.downvotes;
    const totalVotesB = b.upvotes - b.downvotes;
    return totalVotesB - totalVotesA;
    });

    return topPosts

  }

  function sendMessage(senderID, receiverID, content ) {
    let sender = users.filter( u => u.id == senderID)[0]
    let receiver = users.filter( u => u.id == receiverID)[0]  
    const conversationExists = sender.conversations.some(convo => convo.userID == receiverID)

   if (!conversationExists) {
    sender.conversations = [{'userID': receiverID, 'messages': []}]
    receiver.conversations = [{'userID': senderID, 'messages': []}]
   }

   let message = new Message(senderID, content)
   senderConvo = sender.conversations.find( convo => convo.userID == receiverID)
   receiverConvo = receiver.conversations.find( convo => convo.userID == senderID)


   senderConvo.messages.push(message)
   receiverConvo.messages.push(message)



   users[senderID].conversations = sender.conversations
   users[receiverID].conversations = receiver.conversations

   localStorage.setItem('users', JSON.stringify(users))
}

function getConversation(user1ID, user2ID) {
    return users[user1ID].conversations.find( u => u.userID == user2ID).messages
}

function getConversations(userID) {
    return users[userID].conversations
}
  


//Server setup
    //Express setup
    app.set('view engine', 'ejs')
    app.set('views', __dirname + '/views');
    app.set('views', [
        __dirname + '/views',
        __dirname + '/components/',
        __dirname + '/components/cards',
        __dirname + '/components/filters',
        __dirname + '/components/template',
        __dirname + '/components/dialog',
    ]);
    app.use(express.static("public"));
    app.use(session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false
    }))
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json())

    app.use((req, res, next) => {
        res.locals.session = req.session
        next();
      });
    
    // Hocuspocus 
    hocuspocusServer.Server.configure({
        port: 1235,
        extensions: [
            // db de sql para automaticamente persistir as mudanças dos documentos colaborativos
            new SQLite({
                database: "db.sqlite",
            }),
            new Logger()
        ]
    })
    
    hocuspocusServer.Server.listen()
  




 
// app.get('/favicon.ico', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
//   });

//server routes
app.get('/', (req, res) => {
    let hotPosts = joinedHotPosts()    
    res.render('homepage', {posts: hotPosts, session: req.session, filter: 'hot'})
})

app.get('/new', (req, res) => {
    let newPosts = joinedNewPosts()
    res.render('homepage', {posts: newPosts, session: req.session, filter: 'new'})
})

app.get('/top', (req, res) => {
    let topPosts = joinedTopPosts()
    res.render('homepage', {posts: topPosts, session: req.session, filter: 'top'})
})

app.get('/r/:subreddit', (req, res) => {
    let subredditName = req.params.subreddit
    let subreddit = subreddits.find( s => s.name == subredditName)
    let subPosts = subredditPosts(subreddit.id)
    
    res.render('subreddit', { subreddit, subPosts })
})

app.get('/r/:subreddit/make-post', (req, res) => {
    let subredditName = req.params.subreddit;  
    let subreddit = subreddits.find( s => s.name == subredditName)      
    res.render('subreddit-make-post', { subreddit } )
})

app.post('/r/:subreddit/make-post', (req, res) => {

   let { postTitle, postBody, subredditID, postType } = req.body
   addPost(subredditID, req.session.userID, postTitle, postBody, postType)
   res.redirect(`/`)
})

app.get('/r/:subreddit/:postID', (req, res) => {
    
    let subredditName = req.params.subreddit;
    let postID = req.params.postID;
    
    let subreddit = subreddits.find( s => s.name == subredditName)
    let post = posts.find(p => p.id == parseInt(postID))

    let author = users.find( u => u.id == post.authorID)
    post.author = author
    
    let postComments = joinComments(getCommentsForPost(postID))

    res.render('subreddit-post', { subreddit, post, postComments})
})

app.post('/r/:subreddit/:postID', (req, res) => {
    let { postID, parentCommentID, authorID, reply } = req.body
    console.log(postID, parentCommentID, authorID, reply)
    addComment(postID, parentCommentID, authorID, reply)
})

app.put('/r/:subreddit/:postID', (req, res) => {
    
    try {
        let { postID, content } = req.body
        console.log( postID, content)
        updatePost(postID, content)
        res.end()
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
    
})

app.get('/subreddit-post', (req, res) => {
    res.render('subreddit-post', { Tiptap })
})

app.get('/subreddit-make-post', (req, res) => {    
    res.render('subreddit-make-post')
})

app.get('/profile', (req, res) => {
    let { userID } = req.session
    let userPosts = joinPosts(getPostByUserID(userID))    
    res.render('profile', { posts: userPosts})
})

app.get('/profile/:userID', (req, res) => {
    let { userID } = req.params
    let userPosts = joinPosts(getPostByUserID(userID))
    let user = getUser(userID)   
    res.render('profile', { posts: userPosts, user})
})

app.get('/profile-comments/:userID', (req, res) => {
    let { userID } = req.params
    let userComments = joinComments(getUserComments(userID))
    let user = getUser(userID)   
    res.render('profile-comments', { comments: userComments, user})
})

app.get('/messages', (req, res) => {
    let user = getUser(req.session.userID)
    let conversations = getConversations(req.session.userID)
    
    res.render('messages', {user, conversations})
})

app.get('/messages/:userID', (req, res) => {
    let { userID } = req.params
    
    
    let user = getUser(req.session.userID)   
    let conversation = getConversation(req.session.userID, userID)
    let conversations = getConversations(req.session.userID)    
    res.render('messages', {conversation, conversations, user, userID})
})

app.post('/messages/:userID', (req, res) => {
    let {content} = req.body
    let receiverID = req.body.userID
    let senderID = req.session.userID
    
    sendMessage(senderID, receiverID, content)
    let latestMessage = getConversation(senderID, receiverID).at(-1)
    res.json({latestMessage})   
})



app.get('/search-all', (req, res) => {    
    res.render('search-all')
})

app.post('/sign-up', (req, res) => {
    let { email, username, password, passwordConfirm } = req.body
    
    if (password == passwordConfirm) {
        let user = addUser(username, email, password)
        req.session.userID = user.id
        req.session.username = user.username
        req.session.loggedIn = true

    res.redirect('/');

    } else {
        res.send("Passwords do not match, press <a href='/'>here</a> to go back")
    }
    
    
})

app.post('/log-in', (req, res) => {
    let { email, password } = req.body
    
    let user = users.find( u => u.email == email && u.password == password)
    
    if (user) {
        req.session.userID = user.id
        req.session.username = user.username
        req.session.loggedIn = true
        
        res.redirect('/');
    } else {
        res.send('<h1>Account not registered, click <a href="/">here</a> to go back</h1>')
    }

    
})

app.listen(3001, () => {
    console.log('Server started on port 3000')
})





