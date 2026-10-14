import React from "react";
import { Link } from "react-router-dom";

function SkillGap() {
  const currentSkills = [
    { name: "Java", level: 90 },
    { name: "HTML & CSS", level: 88 },
    { name: "JavaScript", level: 82 },
    { name: "React", level: 76 },
    { name: "SQL", level: 72 },
    { name: "Spring Boot", level: 58 }
  ];

  const missingSkills = [
    {
      name: "Spring Security",
      importance: "High",
      reason: "Required by 78% of recommended jobs"
    },
    {
      name: "Docker",
      importance: "High",
      reason: "Required by 64% of recommended jobs"
    },
    {
      name: "AWS",
      importance: "Medium",
      reason: "Required by 51% of recommended jobs"
    },
    {
      name: "System Design",
      importance: "Medium",
      reason: "Important for software engineering roles"
    }
  ];

  const learningPath = [
    {
      number: "01",
      title: "Spring Security",
      duration: "2 Weeks",
      icon: "🔐"
    },
    {
      number: "02",
      title: "Docker & Containers",
      duration: "1 Week",
      icon: "🐳"
    },
    {
      number: "03",
      title: "AWS Fundamentals",
      duration: "2 Weeks",
      icon: "☁️"
    },
    {
      number: "04",
      title: "System Design",
      duration: "3 Weeks",
      icon: "🏗️"
    }
  ];

  return (
    <div className="student-page skill-gap-page">
      <div className="skill-gap-hero">
        <div className="skill-gap-hero-content">
          <span className="skill-gap-badge">
            ✨ AI SKILL ANALYSIS
          </span>

          <h1>Find Your Skill Gap</h1>

          <p>
            Discover which skills you already have, what skills you need to
            improve and what you should learn next to reach your career goals.
          </p>

          <div className="skill-score-box">
            <div className="skill-score-circle">
              <strong>76%</strong>
              <span>Skill Score</span>
            </div>

            <div className="skill-score-info">
              <span>YOUR CURRENT LEVEL</span>
              <h3>Good Progress! 🚀</h3>
              <p>
                You are on the right path for Full Stack Developer roles.
              </p>
            </div>
          </div>
        </div>

        <div className="skill-gap-visual">
          <div className="skill-visual-circle circle-one"></div>
          <div className="skill-visual-circle circle-two"></div>
          <div className="skill-visual-icon">📊</div>
        </div>
      </div>

      <div className="skill-gap-stats">
        <div className="skill-stat-card">
          <div className="skill-stat-icon blue">✓</div>
          <div>
            <span>Skills Acquired</span>
            <h2>6</h2>
          </div>
        </div>

        <div className="skill-stat-card">
          <div className="skill-stat-icon purple">🎯</div>
          <div>
            <span>Skills To Improve</span>
            <h2>4</h2>
          </div>
        </div>

        <div className="skill-stat-card">
          <div className="skill-stat-icon orange">📚</div>
          <div>
            <span>Learning Path</span>
            <h2>4</h2>
          </div>
        </div>

        <div className="skill-stat-card">
          <div className="skill-stat-icon green">💼</div>
          <div>
            <span>Job Readiness</span>
            <h2>76%</h2>
          </div>
        </div>
      </div>

      <div className="skill-gap-layout">
        <div className="skill-gap-main">
          <section className="skill-gap-card">
            <div className="skill-gap-card-header">
              <div>
                <p className="page-label">CURRENT SKILLS</p>
                <h2>Your Skill Profile</h2>
                <p>
                  Your current skill levels based on your profile and
                  assessments.
                </p>
              </div>

              <Link
                to="/student/profile"
                className="skill-update-btn"
              >
                Update Skills
              </Link>
            </div>

            <div className="current-skills-list">
              {currentSkills.map((skill) => (
                <div className="current-skill-item" key={skill.name}>
                  <div className="skill-name-row">
                    <span>{skill.name}</span>
                    <strong>{skill.level}%</strong>
                  </div>

                  <div className="skill-progress">
                    <div
                      className="skill-progress-fill"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>

                  <div className="skill-level-label">
                    {skill.level >= 85
                      ? "Advanced"
                      : skill.level >= 70
                      ? "Intermediate"
                      : "Beginner"}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="skill-gap-card">
            <div className="skill-gap-card-header">
              <div>
                <p className="page-label">SKILLS TO LEARN</p>
                <h2>Your Skill Gaps</h2>
                <p>
                  These skills can improve your chances of getting selected.
                </p>
              </div>
            </div>

            <div className="missing-skills-list">
              {missingSkills.map((skill) => (
                <div className="missing-skill-item" key={skill.name}>
                  <div className="missing-skill-icon">+</div>

                  <div className="missing-skill-info">
                    <h3>{skill.name}</h3>
                    <p>{skill.reason}</p>
                  </div>

                  <span
                    className={`skill-importance ${skill.importance.toLowerCase()}`}
                  >
                    {skill.importance}
                  </span>

                  <button className="learn-skill-btn">
                    Learn
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="skill-gap-sidebar">
          <section className="skill-gap-card readiness-card">
            <div className="skill-gap-card-header">
              <div>
                <p className="page-label">CAREER READINESS</p>
                <h2>Full Stack Developer</h2>
              </div>
            </div>

            <div className="readiness-score">
              <div className="readiness-circle">
                <strong>76%</strong>
              </div>

              <p>
                You are <strong>76% ready</strong> for your target role.
              </p>
            </div>

            <div className="readiness-item">
              <span>Technical Skills</span>
              <strong>82%</strong>
            </div>

            <div className="readiness-item">
              <span>Projects</span>
              <strong>70%</strong>
            </div>

            <div className="readiness-item">
              <span>Resume</span>
              <strong>85%</strong>
            </div>

            <div className="readiness-item">
              <span>Interview Preparation</span>
              <strong>68%</strong>
            </div>
          </section>

          <section className="skill-gap-card ai-advice-card">
            <div className="ai-advice-icon">✨</div>

            <span className="page-label">AI ADVICE</span>

            <h2>Focus on Spring Security next</h2>

            <p>
              Learning Spring Security could increase your match with backend
              and full-stack developer jobs.
            </p>

            <button className="ai-advice-btn">
              Start Learning →
            </button>
          </section>
        </aside>
      </div>

      <section className="learning-path-section">
        <div className="learning-path-header">
          <div>
            <p className="page-label">RECOMMENDED ROADMAP</p>
            <h2>Your Learning Path</h2>
            <p>
              Follow this personalized path to close your skill gaps.
            </p>
          </div>

          <span className="learning-path-duration">
            ⏱ Estimated: 8 Weeks
          </span>
        </div>

        <div className="learning-path">
          {learningPath.map((step) => (
            <div className="learning-step" key={step.number}>
              <div className="learning-step-number">
                {step.number}
              </div>

              <div className="learning-step-icon">
                {step.icon}
              </div>

              <div className="learning-step-content">
                <h3>{step.title}</h3>
                <span>{step.duration}</span>
              </div>

              <button className="learning-start-btn">
                Start
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="skill-gap-bottom-cta">
        <div>
          <h2>Ready to improve your skills? 🚀</h2>
          <p>
            Build the skills recruiters are looking for and increase your job
            match score.
          </p>
        </div>

        <Link
          to="/student/recommendations"
          className="skill-gap-cta-btn"
        >
          View Recommended Jobs →
        </Link>
      </div>
    </div>
  );
}

export default SkillGap;

