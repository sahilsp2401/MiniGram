import postContext from "./postContext";
import { useState } from "react";

const PostState = (props)=>{
  const host = "http://localhost:5000"
    const postsInitial = []
      const [posts, setPosts] = useState(postsInitial)

      // Get all Posts
      const getPosts = async ()=>{
        const response = await fetch(`${host}/api/posts/fetchallposts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        setPosts(json)
      }
        // Add a Post
        const addPost = async (formData)=>{
          try{
          const response = await fetch(`${host}/api/posts/addpost`, {
            method: "POST",
            headers: {
              "auth-token" : localStorage.getItem('token')
            },
            body: formData,
          });
          const contentType = response.headers.get('content-type');
          let result;
    
          if (contentType && contentType.includes('application/json')) {
            result = await response.json(); 
          } else {
            result = await response.text(); // Handle text or other types
          }
          setPosts(posts.concat(result))
        } catch (error) {
          console.error('Error adding post:', error);
        }
            // const post = await response.json()
            // console.log(post)
            // setPosts(posts.concat(post))
        }
        // Delete a Note
        const deletePost = async (id)=>{
          const response = await fetch(`${host}/api/posts/deletepost/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "auth-token" : localStorage.getItem('token')
            },
          });
            const json =  await response.json();
            if(json.success===true){
            const newPosts = posts.filter((post)=>{ return post._id!==id})
            setPosts(newPosts)
            return true
            }
            else{
                return false
            } 
        }
        // Edit a Post
        const editPost = async (id,title,description,tag)=>{
            const response = await fetch(`${host}/api/posts/updatepost/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "auth-token" : localStorage.getItem('token')
              },
              body: JSON.stringify({title,description,tag}),
            });
            const json = await response.json();
            if(json.success){
            let  newPosts = JSON.parse(JSON.stringify(posts))
            for (let index = 0; index < newPosts.length; index++) {
              const element = newPosts[index];
              if(element._id === id){
                newPosts[index].title = title;
                newPosts[index].description = description;
                newPosts[index].tag = tag
                break;
              } 
            }
            setPosts(newPosts);
            return true;
          }
          else{
            return false
          }
        }
        // Add a comment
        const addComment = async (id,comment)=>{
          let name = localStorage.getItem('name')
          const response = await fetch(`${host}/api/posts/addcomment/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token" : localStorage.getItem('token')
            },
            body: JSON.stringify({comment,name}),
          });
            const json =  await response.json();
            if(json.success===true){
            return true
            }
            else{
                return false
            } 
        }

        const addLike = async (id)=>{
          let name = localStorage.getItem('name')
          const response = await fetch(`${host}/api/posts/addlike/${id}`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token" : localStorage.getItem('token')
            },
            body: JSON.stringify({name}),
          })
          const json =  await response.json();
            if(json.success===true){
            return true
            }
            else{
                return false
            } 
        }
    return (
        <postContext.Provider value={{posts,getPosts,deletePost,addPost,editPost,addComment,addLike}}>
            {props.children}
        </postContext.Provider>
    )
}

export default PostState;