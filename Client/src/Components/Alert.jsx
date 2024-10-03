import React,{useState} from "react";

const SimpleModal = ({ showModal, setshowModal }) => {
  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden={!showModal}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Confirm Deletion
            </h5>
            <button
              type="button"
              className="close"
              onClick={() => setshowModal(false)}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete your account?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setshowModal(false)}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
