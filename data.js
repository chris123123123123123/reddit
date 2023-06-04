const {faker} = require('@faker-js/faker')
const fetch = require('node-fetch')
const {createApi} = require('unsplash-js')
const { v4: uuidv4} = require('uuid')
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./testing2');


const subredditInfo = [
    {
      name: "AskReddit",
      description: "A subreddit for open-ended discussions and thought-provoking questions."
    },
    {
      name: "pics",
      description: "A subreddit for sharing and discussing beautiful or interesting pictures."
    },
    {
      name: "todayilearned",
      description: "A subreddit for sharing interesting facts and tidbits of knowledge."
    },
    {
      name: "worldnews",
      description: "A subreddit for news and discussions about global events and politics."
    },
    {
      name: "gaming",
      description: "A subreddit for all things related to video games."
    },
    {
      name: "funny",
      description: "A subreddit for sharing and discussing humorous content."
    },
    {
      name: "movies",
      description: "A subreddit for discussing movies, film news, and reviews."
    },
    {
      name: "aww",
      description: "A subreddit for sharing adorable and cute animal pictures and videos."
    },
    {
      name: "science",
      description: "A subreddit for discussing scientific research, news, and discoveries."
    },
    {
        name: "science",
        description: "A subreddit for discussing scientific research, news, and discoveries."
      }
  ];

const postInfo = [
    {
      title: "Why do birds fly in a V-formation?",
      description: "A fascinating look into the reasons behind bird flock behavior."
    },
    {
      title: "The most beautiful sunset I've ever witnessed",
      description: "A stunning photograph capturing the breathtaking beauty of a sunset."
    },
    {
      title: "TIL: Honey never spoils",
      description: "Discover the incredible shelf life of honey and why it never goes bad."
    },
    {
      title: "The wonders of the universe",
      description: "Exploring the mysteries and awe-inspiring phenomena of our universe."
    },
    {
      title: "The best video games of all time",
      description: "A curated list of the greatest video games ever created, spanning different genres and eras."
    },
    {
      title: "Hilarious cat fails",
      description: "A compilation of funny cat videos showcasing their adorable but clumsy antics."
    },
    {
      title: "Exploring the filmography of Christopher Nolan",
      description: "A deep dive into the acclaimed director's works and their thematic elements."
    },
    {
      title: "Heartwarming moments in the animal kingdom",
      description: "Touching stories and images that showcase the love and compassion found in the animal world."
    },
    {
      title: "Advancements in quantum computing",
      description: "An overview of the latest breakthroughs in the field of quantum computing and its potential impact."
    },
    {
      title: "The future of transportation",
      description: "Examining innovative technologies and concepts that could shape the way we travel in the coming years."
    },
    {
      title: "Unveiling the music legends of the past century",
      description: "A tribute to iconic musicians and bands that have left an indelible mark on the music industry."
    },
    {
      title: "Breaking news: Major political development",
      description: "Stay updated on the latest political events that could have a significant impact on the world."
    },
    {
      title: "Exploring the art of sports photography",
      description: "A collection of stunning sports photographs that capture the intensity and emotion of athletic moments."
    },
    {
      title: "Diving into the world of classic literature",
      description: "Discover timeless masterpieces and delve into the profound themes of classic novels."
    },
    {
      title: "Mouth-watering dessert recipes",
      description: "Indulge your sweet tooth with delectable dessert recipes that are sure to satisfy any craving."
    },
    {
      title: "Off the beaten path: Hidden gems of travel destinations",
      description: "Uncover lesser-known travel spots that offer unique experiences and stunning natural beauty."
    },
    {
      title: "Unraveling the mysteries of ancient civilizations",
      description: "Delve into the secrets and enigmas surrounding ancient cultures and their fascinating histories."
    },
    {
      title: "The power of abstract art",
      description: "Appreciate the expressive and thought-provoking nature of abstract artwork."
    },
    {
      title: "Analyzing the most impactful TV series finales",
      description: "Reflecting on the memorable and impactful endings of beloved TV shows."
    },
    {
      title: "DIY home improvement projects",
      description: "Get inspired with creative and practical ideas for improving your living space on a budget."
    },
    {
      title: "Effective strategies for maintaining a healthy lifestyle",
      description: "Discover practical tips and habits that can contribute to a balanced and healthy life."
    },
    {
      title: "Navigating personal finance: Tips for financial success",
      description: "Learn about effective strategies and approaches for managing personal finances and achieving financial goals."
    },
    {
      title: "Mastering the art of photography composition",
      description: "Explore the principles and techniques that can enhance the visual impact of your photographs."
    },
    {
      title: "The joy of learning through documentaries",
      description: "Recommendations and discussions about captivating and educational documentaries across various subjects."
    },
    {
      title: "The role of politics in shaping science fiction",
      description: "Examining the influence of political ideologies on science fiction literature and media."
    },
    {
      title: "Exploring the frontiers of space exploration",
      description: "Stay informed about the latest missions, discoveries, and advancements in space exploration."
    },
    {
      title: "Embarrassing stories: Tales of hilarious mishaps",
      description: "Share and laugh at embarrassing and funny stories from people's lives."
    },
    {
      title: "Unlocking the secrets of effective storytelling",
      description: "Gain insights into the art of storytelling and the elements that make narratives compelling and engaging."
    },
    {
      title: "Data visualization: Beauty in numbers",
      description: "Appreciate the art and impact of visualizing complex data in a clear and aesthetically pleasing way."
    },
    {
      title: "What if...? Hypothetical scenarios and their implications",
      description: "Engage in thought experiments and discuss hypothetical situations to explore their potential outcomes."
    },
    {
      title: "Mouth-watering food photography",
      description: "Feast your eyes on stunning photographs of delicious dishes and culinary creations."
    },
    {
      title: "Captivating glimpses into history",
      description: "Discover intriguing historical photos and stories that bring the past to life."
    },
    {
      title: "Web gems: Fascinating and useful websites",
      description: "Share and discuss interesting and innovative websites that are worth exploring."
    },
    {
      title: "Laugh out loud: Hilarious jokes and one-liners",
      description: "Tickle your funny bone with a collection of jokes and witty one-liners."
    },
    {
      title: "The human mind: Exploring psychology and behavior",
      description: "Delve into the complexities of the human mind and understand the factors that shape our behavior."
    },
    {
      title: "Astonishing sights of the cosmos",
      description: "Experience the wonders of space through captivating images of galaxies, nebulae, and celestial phenomena."
    },
    {
      title: "Epic fails and funny moments caught on camera",
      description: "Enjoy a compilation of hilarious fails and comical moments captured on video."
    },
    {
      title: "Writing tips and techniques for aspiring authors",
      description: "Learn valuable insights and practical advice to improve your writing skills and storytelling abilities."
    },
    {
      title: "The art of data visualization: Telling stories with graphs",
      description: "Explore the power of data visualization in conveying information and insights effectively."
    },
    {
      title: "AskScienceFiction: Exploring the possibilities of fictional worlds",
      description: "Pose and discuss questions about the science and logic behind fictional universes and their rules."
    },
    {
      title: "Mouth-watering food creations: Culinary delights",
      description: "Discover innovative and visually stunning dishes created by talented chefs and food enthusiasts."
    },
    {
      title: "Fascinating glimpses into history: Rare photographs",
      description: "Unearth rare and captivating photographs that provide unique perspectives on historical events."
    },
    {
      title: "Internet wonders: The hidden gems of the web",
      description: "Explore lesser-known websites and online experiences that showcase creativity and innovation."
    },
    {
      title: "Side-splitting humor: Jokes and funny anecdotes",
      description: "Share and enjoy humorous jokes, puns, and amusing anecdotes."
    },
    {
      title: "The human mind: Insights into psychology and behavior",
      description: "Discover fascinating studies and insights into human cognition, emotions, and behavior."
    },
    {
      title: "SpacePorn: Jaw-dropping images of the cosmos",
      description: "Feast your eyes on stunning photographs of space, celestial bodies, and astronomical phenomena."
    },
    {
      title: "Cutest animal videos to brighten your day",
      description: "Watch adorable videos of animals being cute, funny, and heartwarming."
    },
    {
      title: "The science behind technological advancements",
      description: "Explore the scientific principles and innovations that drive technological progress in various fields."
    },
    {
      title: "UpliftingNews: Inspiring stories of positive change",
      description: "Read heartwarming news stories that highlight acts of kindness, progress, and positive developments."
    },
    {
      title: "Viral videos: Trending and captivating clips",
      description: "Watch and discuss the latest viral videos that have captured the attention of the online community."
    },
    {
      title: "Spreading positivity: Messages of love and encouragement",
      description: "Share uplifting and empowering messages to brighten someone's day and spread positivity."
    }
    // Add more objects for other posts
  ];

const commentInfo = [
    "Nice post!",
    "I completely agree with you.",
    "That's interesting.",
    "Wow, I had no idea!",
    "Great job on the research.",
    "I couldn't stop laughing!",
    "This deserves more upvotes.",
    "Well said!",
    "I'm speechless.",
    "You have my upvote!",
    "I couldn't agree more.",
    "Thanks for sharing!",
    "I've never thought about it that way.",
    "You've changed my perspective.",
    "Can't wait to try this!",
    "This is pure gold.",
    "I'm saving this for later.",
    "You're a genius!",
    "I wish more people knew about this.",
    "This made my day!",
    "Mind blown!",
    "You've earned my respect.",
    "Absolutely fantastic.",
    "I'm in awe.",
    "Keep up the great work!",
    "This needs to go viral.",
    "I'm crying from laughter.",
    "You've made a valid point.",
    "I'm so impressed!",
    "This is a game-changer.",
    "You're doing God's work.",
    "I'm sharing this with everyone I know.",
    "You've enlightened me.",
    "I'm grateful for this.",
    "I can't stop reading.",
    "Thank you for this gem.",
    "This needs to be at the top.",
    "I can't express how much I love this.",
    "You're a legend!",
    "This made me smile.",
    "You're spot on!",
    "This is the best thing I've seen all day.",
    "I can't believe I never knew this.",
    "You've earned my upvote.",
    "This deserves an award.",
    "I'm blown away by your knowledge.",
    "This is mind-boggling.",
    "You're a true hero.",
    "I'm forever grateful.",
    "I'm shook!",
    "You've just made my day brighter.",
    "I'm bookmarking this.",
    "I aspire to be like you.",
    "This should be on the front page.",
    "I've learned something new today.",
    "You're doing amazing work.",
    "I can't stop applauding.",
    "You deserve all the praise.",
    "This is what the internet was made for.",
    "You've restored my faith in humanity.",
    "I'm at a loss for words.",
    "You're an inspiration.",
    "This needs to be shared worldwide.",
    "I can't thank you enough.",
    "You're a true genius.",
    "This blew my mind.",
    "I'm so glad I found this.",
    "You're doing incredible things.",
    "This should be taught in schools.",
    "I'm forever in your debt.",
    "You've made a difference.",
    "This is the best comment I've ever read.",
    "I wish I could upvote this multiple times.",
    "You've just won the internet.",
    "I'm amazed by your insight.",
    "This is legendary.",
    "You've earned my admiration.",
    "I'm in love with this comment.",
    "You're an absolute treasure.",
    "This made me laugh out loud.",
    "You're a true hero of the internet.",
    "I can't express how much I appreciate this.",
    "You're a gift to humanity.",
    "This is pure brilliance.",
    "I've found my new favorite comment.",
    "You deserve all the awards.",
    "This is top-notch.",
    "You've made my day!",
    "I'm forever in awe of your wisdom.",
    "This should be framed and hung on a wall.",
    "You're the hero we need.",
    "This comment should be immortalized.",
    "I'm sharing this with everyone I know.",
    "You're a true wordsmith.",
    "This deserves a standing ovation.",
    "I'm blown away by your creativity.",
    "You're a legend among Redditors.",
    "This is the epitome of internet culture.",
    "You've nailed it!",
    "I can't stop rereading this comment.",
    "You're a master of wit and humor.",
    "This is the best comment I've ever seen.",
    "You've captured the essence of the post perfectly.",
    "I'm forever grateful for this comment.",
    "You've won the internet with this one.",
    "This comment deserves to be framed.",
    "You're a true virtuoso of comments."
    // Add more strings for other comments
  ];

const postType = ['collab-post', 'text-post']

let users = []
let subreddits = []
let posts = []
let comments = []


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

function addUser(id, username, email, password, date, avatarImage) {
    const user = new User(id, username, email, password, date, avatarImage)
    users[id] = user
    localStorage.setItem('users', JSON.stringify(users))
}

function addSubreddit(id, name, description, creatorID, avatarImage, bannerImage, date) {
    const subreddit = new Subreddit(id, name, description, creatorID, date, avatarImage, bannerImage);
    subreddits.push(subreddit)
    localStorage.setItem('subreddits', JSON.stringify(subreddits))
  }

  function addPost(id, subredditID, authorID, title, body, type, image) { 
    const post = new Post(id, title, body, subredditID, authorID, faker.number.int({max:1000}), faker.number.int({max:200}), new Date(), type, image)
    posts[id] = post
    localStorage.setItem('posts', JSON.stringify(posts))
   
}

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
    const dateCreated = faker.date.past();
    const replies = []
    const votes = faker.number.int({max: 2000})
    const comment = new Comment(id, postID, authorID, votes, body, parentCommentID, dateCreated, replies);
  
    if (parentCommentID === null ) {
        comments.push(comment)
        
    } else {
        
    findParentCommentById(comments, parentCommentID, comment) 
    }

    localStorage.setItem('comments', JSON.stringify(comments))
  }

function generateUser() {
    for (let i = 0; i <= 50; i++) {
        let username = faker.internet.userName()
        let email = faker.internet.email()
        let password = faker.internet.password()
        let avatar = faker.internet.avatar()
        let date = faker.date.past()
        addUser(i, username, email, password, date, avatar)
    }
}

function generateSubreddits() {
    subredditInfo.forEach( (sub, i) => {     
        let creatorID = faker.number.int({max: 50})
        let date = faker.date.past()
        let avatarImage = faker.internet.avatar()
        let bannerImage = faker.image.url()
        addSubreddit(i, sub.name, sub.description, creatorID, avatarImage, bannerImage, date)
    })
}

function generatePosts() {
    postInfo.forEach( (post, i) => {
        let subredditID = faker.number.int({max:10})
        let authorID = faker.number.int({max:50})
        let title = post.title
        let body = post.description
        let type = postType[faker.number.int({max:1})]
        let image = faker.image.url()
        addPost(i, subredditID, authorID, title, body, type, image)
    })
}

function generateParentComments() {
    commentInfo.forEach( comment => {
        let postID = faker.number.int({max:50})
        let parentCommentID = null
        let authorID = faker.number.int({max:50})
        let body = comment

        addComment(postID, parentCommentID, authorID, body)
    })
}

function generateComments() {
    commentInfo.forEach( comment => {
        let postID = faker.number.int({max:50})
        let parentCommentID = comments[faker.number.int({max:50})].id
        
        let authorID = faker.number.int({max:50})
        let body = comment
        addComment(postID, parentCommentID, authorID, body)
    })
}

generateUser()
generateSubreddits()
generatePosts()
generateParentComments()

generateComments()

// let x = comments.filter( com => com.parentCommentID !== null)
// console.log(x)
