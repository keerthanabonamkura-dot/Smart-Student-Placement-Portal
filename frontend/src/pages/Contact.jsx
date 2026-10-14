import React from "react";

function Contact() {
  return (
    <div className="contact-page">

      <section className="contact-hero">

        <div className="contact-hero-content">

          <span className="contact-badge">
            GET IN TOUCH
          </span>

          <h1>
            Let's Connect &
            <span> Build Careers</span>
          </h1>

          <p>
            Have questions about Smart Placement? Our team is here to help
            students, recruiters and institutions make the most of the
            placement platform.
          </p>

        </div>

      </section>

      <section className="contact-section">

        <div className="contact-info">

          <div className="contact-heading">
            <span>CONTACT US</span>

            <h2>
              We're here to
              <br />
              <span>help you.</span>
            </h2>

            <p>
              Whether you are a student looking for opportunities, a recruiter
              searching for talent, or an administrator managing placements,
              feel free to reach out to us.
            </p>
          </div>

          <div className="contact-details">

            <div className="contact-detail-card">

              <div className="contact-detail-icon">
                ✉
              </div>

              <div>
                <span>Email</span>
                <strong>support@smartplacement.com</strong>
              </div>

            </div>

            <div className="contact-detail-card">

              <div className="contact-detail-icon">
                ☎
              </div>

              <div>
                <span>Phone</span>
                <strong>+91 98765 43210</strong>
              </div>

            </div>

            <div className="contact-detail-card">

              <div className="contact-detail-icon">
                📍
              </div>

              <div>
                <span>Location</span>
                <strong>Hyderabad, Telangana, India</strong>
              </div>

            </div>

          </div>

        </div>

        <div className="contact-form-card">

          <div className="contact-form-header">
            <h2>Send us a message</h2>

            <p>
              Fill in the details below and our team will get back to you.
            </p>
          </div>

          <form>

            <div className="contact-form-row">

              <div className="contact-input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                />
              </div>

              <div className="contact-input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                />
              </div>

            </div>

            <div className="contact-input-group">
              <label>Subject</label>

              <input
                type="text"
                placeholder="What is your message about?"
              />
            </div>

            <div className="contact-input-group">
              <label>Message</label>

              <textarea
                rows="6"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
            >
              Send Message →
            </button>

          </form>

        </div>

      </section>

      <section className="contact-help">

        <div className="contact-help-card">

          <div className="contact-help-icon">
            ?
          </div>

          <div>
            <span>NEED QUICK HELP?</span>

            <h3>
              Check our placement support resources.
            </h3>

            <p>
              Find useful information about registration, job applications and
              recruiter services.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Contact;

