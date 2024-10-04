import React from 'react'
import "../Components/Create_post.css"

const Create_post = () => {
  return (
    <div className="pt-3 mx-3 mx-md-4 media">
      <h2 className="text-center fw-3">Create a post</h2>
      <div>
        <form className="row">
          <div className="form-group mb-3 col-md-6">
            <label htmlFor="title">Title</label>
            <input type="text" className="form-control" id="title" required />
          </div>
          <div className="form-group  col-md-3">
            <label>category</label>
            <select class="form-select">
              <option value="disabled">Select the Category</option>
              <option value="fittness">Fittness</option>
              <option value="beaty">Beaty</option>
              <option value="quality">Quality</option>
            </select>
          </div>
          <div className=''>

          </div>
        </form>
      </div>
    </div>
  );
}

export default Create_post