import React, { useState } from "react";

// Add these to your HTML head:
// <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Contact Us</h1>
        <p className="lead text-muted">
          We'd love to hear from you. Drop us a line and we'll get back to you
          as soon as possible.
        </p>
      </div>

      <div className="row g-5">
        {/* Contact Information */}
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Get In Touch</h3>

              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <i className="bi bi-geo-alt text-primary fs-2"></i>
                </div>
                <div className="ms-3">
                  <h5>Our Location</h5>
                  <p className="text-muted mb-0">
                    123 Blog Street
                    <br />
                    Content City, ST 12345
                  </p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <i className="bi bi-envelope text-primary fs-2"></i>
                </div>
                <div className="ms-3">
                  <h5>Email Us</h5>
                  <p className="text-muted mb-0">
                    info@unboundvoices.com
                    <br />
                    support@unboundvoices.com
                  </p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <i className="bi bi-telephone text-primary fs-2"></i>
                </div>
                <div className="ms-3">
                  <h5>Call Us</h5>
                  <p className="text-muted mb-0">
                    +1 (555) 123-4567
                    <br />
                    Mon-Fri, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-5">
                <h5 className="mb-3">Follow Us</h5>
                <div className="d-flex gap-3">
                  <a href="#" className="text-primary fs-4">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="text-info fs-4">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="text-danger fs-4">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#" className="text-dark fs-4">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Send Us a Message</h3>

              {submitted && (
                <div
                  className="alert alert-success d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="name">
                        <i className="bi bi-person me-2"></i>Your Name
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="email">
                        <i className="bi bi-envelope me-2"></i>Email Address
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="subject">
                        <i className="bi bi-chat-left-text me-2"></i>Subject
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        placeholder="Your Message"
                        style={{ height: "150px" }}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <label htmlFor="message">
                        <i className="bi bi-pencil me-2"></i>Your Message
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                    >
                      <i className="bi bi-send me-2"></i>Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970693!3d40.69714941680757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1701791634125!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
