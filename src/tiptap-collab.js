import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { HocuspocusProvider } from '@hocuspocus/provider'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

import { randomColor } from 'randomcolor'


const postID = document.querySelector('#editor').getAttribute('postID')
const postBody = document.querySelector('#editor').getAttribute('postBody')










// Set up the Hocuspocus WebSocket provider
const provider = new HocuspocusProvider({
    url: 'ws://127.0.0.1:1234',
    name: postID,
  })

  const editor = new Editor({
    element: document.querySelector('.element'),
    extensions: [
      StarterKit.configure({
        // The Collaboration extension comes with its own history handling
        history: false,
      }),
      // Register the document with Tiptap
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: session.username,
          color: randomColor(),
        },
      }),

      
      
    ],
    
    // onUpdate: ({ editor}) => {
      
    //   let data = {
    //     postID: postID,
    //     content: editor.getHTML()
    //   }
    
    //   fetch('/:subreddit/:postID', {
    //     method: 'PUT',
    //     body: JSON.stringify( data ),
    //     headers: {
    //     'Content-Type': 'application/json'
    // }
    // })
        

        
    // }
  })


    

    let description = document.querySelector('.post-text')
    let descriptionEditor = document.querySelector('.element')
    let post = document.querySelector('.post')
    let editButton = document.querySelector('#edit-btn')
    let editorMenuBtns = document.querySelectorAll('.edit-menu-btns')
    let editorMenu = document.querySelector('.editor-menu')
    let boldButton = document.querySelector('#bold')
    let italicButton = document.querySelector('#italic')
    let strikeButton = document.querySelector('#strike')
    let quoteButton = document.querySelector('#quote')
    let codeButton = document.querySelector('#code')
    let cancelButton = document.querySelector('#cancel-btn')


    // button functions
    boldButton.addEventListener('click', () => {
        editor.chain().focus().toggleBold().run()
    } )
    italicButton.addEventListener('click', () => {
        editor.chain().focus().toggleItalic().run()
    } )
    strikeButton.addEventListener('click', () => {
        editor.chain().focus().toggleStrike().run()
    } )
    quoteButton.addEventListener('click', () => {
        editor.chain().focus().toggleBlockquote().run()
        console.log(editor.getHTML()) 
    } )
    codeButton.addEventListener('click', () => {
        editor.chain().focus().toggleCode().run()
        console.log(editor.getHTML()) 
    } )

    



    