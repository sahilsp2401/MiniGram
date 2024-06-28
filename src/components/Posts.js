import React, { useState,useContext, useEffect,useRef } from "react";
import postContext from "../context/posts/postContext";
import {useNavigate} from "react-router-dom";
import Postitem from "./Postitem";


const Posts = (props) => {
    const context = useContext(postContext);
    // const JWT_SECRET = "Itisasecrettokenbyminigram";
    const { posts, getPosts,editPost} = context;
    let navigate = useNavigate();
    const ref = useRef(null);
    const refClose = useRef(null);
    const [post, setPost] = useState({id:"",etitle:"",edescription:"",etag:""})
    const updatePost = (currentPost) => {
        ref.current.click();
        setPost({id: currentPost._id,etitle:currentPost.title,edescription:currentPost.description,etag:currentPost.tag})
    };
    useEffect(() => {
        if(localStorage.getItem('token')){
          getPosts(); 
        }
        else{
          navigate("/login")
        }
    })
    const handleClick = async (e) => {
      const up = await editPost(post.id,post.etitle,post.edescription,post.etag)
      if(up){
        props.showAlert("Updated successfully",'success')
        refClose.current.click()
      }
      else{
        props.showAlert("You cannot Updated others Post",'danger')
        refClose.current.click()
      }
    };
    const onChange = (e)=>{
      setPost({...post,[e.target.name]:e.target.value})
    }
  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-none "
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Post
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            <form>
        <div className="mb-3">
          <label htmlFor="etitle" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="etitle"
            name="etitle"
            onChange={onChange}
            value={post.etitle}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="edescription" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="edescription"
            name="edescription"
            onChange={onChange}
            value={post.edescription}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="etag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="etag"
            name="etag"
            onChange={onChange}
            value={post.etag}
            required
          />
        </div>
      </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button disabled={post.etitle.length<5 || post.edescription.length<5 } type="button" onClick={handleClick} className="btn btn-primary">
                Update Post
              </button>
            </div>
          </div>
        </div>
      </div>
        <h2 className="d-flex justify-content-center">Posts</h2>
        <p className="d-flex justify-content-center my-2">{posts.length===0 && "No notes to display"}</p>
        {posts.map((post) => {
          return (
            <Postitem key={post._id} showAlert={props.showAlert} post={post} updatePost={updatePost} />
          );
        })}
      </>
  )
}

export default Posts