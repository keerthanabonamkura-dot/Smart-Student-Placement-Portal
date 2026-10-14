import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentAPI } from "../services/api";

function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        const [recRes, profRes] = await Promise.all([
          studentAPI.getRecommendations(),
          studentAPI.getProfile(),
        ]);

        if (recRes.success) {
          setRecommendations(recRes.recommendations || []);
        }
        if (profRes.success) {
          setProfile(profRes.profile);
        }
      } catch (err) {
        console.error("Recommendations fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, []);

  return (
    <div className="student-page recommendations-page">
      <div className="recommendations-hero">
        <div className="recommendations-hero-content">
          <span className="recommendations-badge">✨ AI POWERED</span>
          <h1>Jobs Recommended For You</h1>
          <p>
            Our smart recommendation engine matches your skills, academic background and profile
            against live job requirements.
          </p>

          <div className="recommendation-profile-info">
            <div className="recommendation-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
            </div>

            <div>
              <strong>{user?.name || "Student"}</strong>
              <span>{profile?.degree || "B.Tech Computer Science"}</span>
            </div>

            <div className="profile-completion">
              <span>Profile</span>
              <strong>{profile?.profileScore || 80}% Complete</strong>
            </div>
          </div>
        </div>

        <div className="recommendations-hero-visual">
          <div className="ai-orbit orbit-one"></div>
          <div className="ai-orbit orbit-two"></div>
          <div className="ai-center">✨</div>
        </div>
      </div>

      <div className="recommendation-stats">
        <div className="recommendation-stat-card">
          <div className="recommendation-stat-icon blue">🎯</div>
          <div>
            <span>Recommended Jobs</span>
            <h2>{recommendations.length}</h2>
          </div>
        </div>

        <div className="recommendation-stat-card">
          <div className="recommendation-stat-icon green">⚡</div>
          <div>
            <span>Top Skill Match</span>
            <h2>{recommendations[0]?.match || 90}%</h2>
          </div>
        </div>

        <div className="recommendation-stat-card">
          <div className="recommendation-stat-icon purple">💡</div>
          <div>
            <span>Skills Analyzed</span>
            <h2>{(profile?.skills || []).length || 6}</h2>
          </div>
        </div>
      </div>

      <div className="recommendation-section">
        <div className="recommendation-section-header">
          <div>
            <h2>Top Recommended Opportunities</h2>
            <p>Curated placements tailored to your skillset</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#6b7280" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
            Calculating smart job matches...
          </div>
        ) : recommendations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", background: "white", borderRadius: "20px" }}>
            <p>No job recommendations available at this time.</p>
          </div>
        ) : (
          <div className="recommendation-grid">
            {recommendations.map((job) => (
              <div key={job.id} className="recommendation-card">
                <div className="recommendation-card-top">
                  <div className={`recommendation-company-logo ${job.color || "blue"}`}>
                    {job.logo || "SP"}
                  </div>
                  <span className="recommendation-match-badge">
                    {job.match}% Match
                  </span>
                </div>

                <h3>{job.title}</h3>
                <p className="recommendation-company">{job.company}</p>

                <div className="recommendation-meta">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type || job.jobType}</span>
                  <span>💰 {job.salary}</span>
                </div>

                <div className="recommendation-skills">
                  {(job.skills || []).map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="recommendation-card-bottom">
                  <Link to={`/student/job/${job.id}`} className="recommendation-view-btn">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;
