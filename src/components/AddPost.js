import React,{useEffect,useState,useContext} from 'react'
import {useNavigate} from "react-router-dom";
import postContext from "../context/posts/postContext";

export const AddPost = (props) => {
    let navigate = useNavigate()
    const context = useContext(postContext);
    const { addPost } = context;
    const [newPost, setNewPost] = useState({title:"",description:"",tag:"",img:null})
    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate("/login")
        }
    })

    const handleSubmit = (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('description', newPost.description);
        formData.append('tag', newPost.tag);
        formData.append('img', newPost.img);
        formData.append('postedBy', localStorage.getItem('name'));
        addPost(formData)
        navigate("/")
        props.showAlert("Post uploaded successfully",'success')
        setNewPost({title:"",description:"",tag:"",img:null});
    }

    const onChange = (e)=>{
      const { name, value, files } = e.target;
      if (name === 'img' && files.length > 0) {
        setNewPost((prevPost) => ({
          ...prevPost,
          [name]: files[0], // Set the first file from the input
        }));
      } else {
        setNewPost((prevPost) => ({
          ...prevPost,
          [name]: value,
        }));
      }
      }
  return (
    <>
        <div className='container'>
      <h2>Add Your Post</h2>
        <form  onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" className="form-control" id="title" name='title' onChange={onChange}
            value={newPost.title} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Caption</label>
    <input type="text" className="form-control" id="description" name='description' onChange={onChange}
            value={newPost.description} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="tag" className="form-label">HashTags</label>
    <input type="text" className="form-control" id="tag" name='tag' onChange={onChange}
            value={newPost.tag} required/>
  </div>
  <div className="mb-3">
  <label htmlFor="img" className="form-label">Upload Image</label>
  <input className="form-control" type="file" id="img" name='img' onChange={onChange}/>
</div>
  <button  disabled={newPost.title.length<5 || newPost.description.length<5 }  type="submit" className="btn btn-primary">Add Post</button>
</form>
    </div>
    </>
  )
}
