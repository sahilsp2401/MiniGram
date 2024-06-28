import React, { useContext, useState } from "react";
import postContext from "../context/posts/postContext";

const Postitem = (props) => {
  const { showAlert, post, updatePost } = props;
  const isLiked = post.likes.some(like => like.name === localStorage.getItem('name'));
  const [like, setLike] = useState(isLiked);
  const [comment, setComment] = useState("");
  const context = useContext(postContext);
  const { deletePost, addComment,addLike } = context;
  const [isActive, setIsActive] = useState(false);

  const handleClick = async () => {
    let del = await deletePost(post._id);
    if (del) {
      showAlert("Deleted Successfully", "success");
    } else {
      showAlert("You are not allowed to delete others post", "danger");
    }
  };

  const handleComment = async () => {
    let update = await addComment(post._id, comment);
    if (update) {
      showAlert("Comment posted Successfully", "success");
      setComment("");
    } else {
      showAlert("Unable to post the comment due to some error", "danger");
    }
  };

  const handleLike = async () => {
    let liked = await addLike(post._id);
    if (!liked) {
      showAlert("Unable to like the post due to some error", "danger");
    }
    if(like){
      setLike(false)
    }
    else{
      setLike(true)
    }
  };

  const onChange = (e) => {
    setComment(e.target.value);
  };

  const toggleAccordion = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <div className="d-flex justify-content-center my-2">
        <div className="card" style={{ width: "30rem" }}>
        <div className="d-flex justify-content-center">
          <h3>
          <small class="text-muted">Posted By-</small>
          {post.postedBy}
          </h3>
          </div>
          <img
            src={`data:${post.img.contentType};base64,${post.img.data}`}
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <div className="row">
              <div className="col-8">
                <h5 className="card-title mb-3">
                  <strong className="me-2">Title: </strong>
                  {post.title}
                </h5>
              </div>
              <div className="col-4">
                {like? (
                  <i
                    className="fa-solid fa-heart fa-lg"
                    onClick={handleLike}
                  ></i>
                ) : (
                  <i
                    className="fa-regular fa-heart fa-lg"
                    onClick={handleLike}
                  ></i>
                )}
                <span style={{marginRight:"5px"}}>{post.likeCount}</span>
                <i
                  className="fas fa-edit mx-2"
                  onClick={() => {
                    updatePost(post);
                  }}
                ></i>
                <i
                  className="fas fa-trash-alt mx-2"
                  onClick={handleClick}
                ></i>
              </div>
            </div>
            <p className="card-text">
              <strong className="me-2">Caption: </strong>
              {post.description}
            </p>
            <p className="card-text">
              <strong className="me-2">HashTags: </strong>
              {post.tag}
            </p>
            <hr />
            <div className={`accordion ${isActive ? 'show' : ''}`}>
              <div className="accordion-item">
                <h2 className="accordion-header" id={`heading${post._id}`}>
                  <button
                    className="accordion-button"
                    type="button"
                    onClick={toggleAccordion}
                    aria-expanded={isActive ? 'true' : 'false'}
                    aria-controls={`collapse${post._id}`}
                  >
                    Comments
                  </button>
                </h2>
                <div
                  id={`collapse${post._id}`}
                  className={`accordion-collapse collapse ${isActive ? 'show' : ''}`}
                  aria-labelledby={`heading${post._id}`}
                  data-bs-parent={`#accordionExample`}
                >
                  <div className="accordion-body">
                    <form>
                      <div className="row g-3 align-items-center">
                        <div className="col-auto">
                          <label htmlFor={`comment${post._id}`} className="col-form-label">
                            Comment
                          </label>
                        </div>
                        <div className="col-9">
                          <input
                            type="text"
                            id={`comment${post._id}`}
                            name={`comment${post._id}`}
                            className="form-control"
                            value={comment}
                            onChange={onChange}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-dark"
                          onClick={handleComment}
                        >
                          Post Comment
                        </button>
                      </div>
                    </form>
                    <hr />
                    <h6>Comments</h6>
                    {post.comments && post.comments.length > 0 ? (
                      <ul className="list-unstyled">
                        {post.comments.map((comment) => (
                          <li key={comment._id} className="align-items-center mb-2 pb-2">
                            <strong className="me-2">{comment.name}:</strong>
                            <span>{comment.comment}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Postitem;
