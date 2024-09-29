import React, { useState, useEffect } from "react";

const UploadComponent = ({ uploadError }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (uploadError) {
      setShowAlert(true);
      // Set a timeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // 3 seconds

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  return (
    <div>
      {/* Alert message */}
      {showAlert && (
        <div className="alert alert-danger fade show alert-dismissible">
          <strong>{uploadError}</strong>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
