import React from 'react'
import "../Components/Create_post.css"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../Components/Navbar/Navbar.css";

const Create_post = () => {
  return (
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 col-xl-6">
          <div class="pt-3 px-3 px-md-4">
            <h2 class="text-center fw-bold mb-4">Create a post</h2>
            <form>
              <div class="row g-3">
                <div class="col-md-8">
                  <label for="title" class="form-label">
                    Title
                  </label>
                  <input type="text" class="form-control" id="title" required />
                </div>
                <div class="col-md-4">
                  <label for="category" class="form-label">
                    Category
                  </label>
                  <select class="form-select" id="category">
                    <option value="" disabled selected>
                      Select the Category
                    </option>
                    <option value="fitness">Fitness</option>
                    <option value="beauty">Beauty</option>
                    <option value="quality">Quality</option>
                  </select>
                </div>
                <div class="col-12">
                  <div class="border border-2 border-primary p-3 rounded">
                    <div class="d-flex justify-content-between align-items-center">
                      <input
                        type="file"
                        accept="image/*"
                        class="form-control"
                        id="image-upload"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-success ms-2"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ position: "relative", height: "200px" }}>
                  <ReactQuill
                    theme="snow"
                    className="mb-1 h-50"
                    placeholder="Write something..."
                    required
                  />
                </div>
                <div className="d-flex justify-content-center mb-3 ">
                  <button
                    
                    type="submit"
                    className="btn  logo"
                    style={{width:"40%"}}
                  >
                    Publish Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create_post