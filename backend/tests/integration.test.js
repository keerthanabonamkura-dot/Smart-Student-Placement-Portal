// Integration Test Suite for Placement Portal Backend
// Tests all Section 11 requirements against live MySQL and Express

const assert = require("assert");
const http = require("http");
const app = require("../server");

let server;
let port = 5099;
let baseUrl;

// Helper to make HTTP requests
const request = ({ method, path, body, token }) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const postData = body ? JSON.stringify(body) : "";

    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (body) {
      headers["Content-Length"] = Buffer.byteLength(postData);
    }

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let responseBody = "";
        res.on("data", (chunk) => (responseBody += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(responseBody);
          } catch {
            parsed = responseBody;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        });
      }
    );

    req.on("error", (err) => reject(err));
    if (body) {
      req.write(postData);
    }
    req.end();
  });
};

async function runTests() {
  console.log("\n=======================================================");
  console.log("   SMART STUDENT PLACEMENT PORTAL INTEGRATION TESTS    ");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(`       Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Health & Server
  await test("API Health Check endpoint responds 200", async () => {
    const res = await request({ method: "GET", path: "/api/health" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, "healthy");
  });

  // 2. Authentication: Student, Recruiter, Admin Login
  let studentToken = "";
  let recruiterToken = "";
  let adminToken = "";
  let studentUser = null;
  let recruiterUser = null;

  await test("Admin login with valid credentials succeeds", async () => {
    const res = await request({
      method: "POST",
      path: "/api/auth/login",
      body: {
        email: "admin@smartplacement.com",
        password: "password123",
        role: "Admin",
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert(res.body.token);
    assert.strictEqual(res.body.user.role, "Admin");
    adminToken = res.body.token;
  });

  await test("Recruiter login with valid credentials succeeds", async () => {
    const res = await request({
      method: "POST",
      path: "/api/auth/login",
      body: {
        email: "recruiter@tcs.com",
        password: "password123",
        role: "Recruiter",
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert(res.body.token);
    assert.strictEqual(res.body.user.role, "Recruiter");
    recruiterToken = res.body.token;
    recruiterUser = res.body.user;
  });

  await test("Student login with valid credentials succeeds", async () => {
    const res = await request({
      method: "POST",
      path: "/api/auth/login",
      body: {
        email: "aarav.kumar@gmail.com",
        password: "password123",
        role: "Student",
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert(res.body.token);
    assert.strictEqual(res.body.user.role, "Student");
    studentToken = res.body.token;
    studentUser = res.body.user;
  });

  // 3. Security: Invalid passwords & Duplicate emails
  await test("Login with invalid password returns 401 Unauthorized", async () => {
    const res = await request({
      method: "POST",
      path: "/api/auth/login",
      body: {
        email: "aarav.kumar@gmail.com",
        password: "wrongpassword999",
      },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await test("Duplicate email registration is rejected with 400 Bad Request", async () => {
    const res = await request({
      method: "POST",
      path: "/api/auth/register",
      body: {
        name: "Duplicate Aarav",
        email: "aarav.kumar@gmail.com",
        password: "password123",
        role: "Student",
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  // 4. Security: Public registration must never allow Admin
  await test("Public registration with role 'Admin' is rejected with 403 Forbidden", async () => {
    const res = await request({
      method: "POST",
      path: "/api/auth/register",
      body: {
        name: "Hacker Admin",
        email: "hacker_admin@test.com",
        password: "password123",
        role: "Admin",
      },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  // 5. New Student and Recruiter Registration
  let newStudentEmail = `test_student_${Date.now()}@test.com`;
  let newStudentToken = "";
  await test("Student registration creates account and returns JWT", async () => {
    const res = await request({
      method: "POST",
      path: "/api/auth/register",
      body: {
        name: "New Student Tester",
        email: newStudentEmail,
        password: "password123",
        role: "Student",
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert(res.body.token);
    assert.strictEqual(res.body.user.role, "Student");
    newStudentToken = res.body.token;
  });

  let newRecruiterEmail = `test_recruiter_${Date.now()}@test.com`;
  let newRecruiterToken = "";
  let newRecruiterId = null;
  await test("Recruiter registration creates account and company profile", async () => {
    const res = await request({
      method: "POST",
      path: "/api/auth/register",
      body: {
        name: "Wipro HR",
        email: newRecruiterEmail,
        password: "password123",
        role: "Recruiter",
        companyName: "Wipro Technologies",
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert(res.body.token);
    assert.strictEqual(res.body.user.role, "Recruiter");
    newRecruiterToken = res.body.token;
    newRecruiterId = res.body.user.id;
  });

  // 6. Role Authorization: Student cannot access Admin endpoints
  await test("Student attempting to access admin endpoints returns 403 Forbidden", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/users",
      token: studentToken,
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  // 7. Job CRUD Operations
  let createdJobId;
  await test("Recruiter can create a new job posting", async () => {
    const res = await request({
      method: "POST",
      path: "/api/jobs",
      token: recruiterToken,
      body: {
        title: "Cloud DevOps Engineer",
        company: "Tata Consultancy Services",
        location: "Hyderabad / Remote",
        jobType: "Full Time",
        salary: "₹8 - ₹12 LPA",
        experience: "0-2 Years",
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
        description: "Join TCS DevOps practice to architect and deliver cloud infrastructure.",
        deadline: "2026-11-30",
        category: "Cloud & Systems",
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert(res.body.job.id);
    assert.strictEqual(res.body.job.title, "Cloud DevOps Engineer");
    createdJobId = res.body.job.id;
  });

  await test("Public and students can retrieve job listings and single job details", async () => {
    const listRes = await request({ method: "GET", path: "/api/jobs" });
    assert.strictEqual(listRes.status, 200);
    assert(Array.isArray(listRes.body.jobs));
    assert(listRes.body.jobs.length > 0);

    const singleRes = await request({ method: "GET", path: `/api/jobs/${createdJobId}` });
    assert.strictEqual(singleRes.status, 200);
    assert.strictEqual(singleRes.body.job.title, "Cloud DevOps Engineer");
  });

  // 8. Ownership verification: Recruiter cannot edit or delete another recruiter's job
  await test("Recruiter cannot edit another recruiter's job posting (403 Forbidden)", async () => {
    const res = await request({
      method: "PUT",
      path: `/api/jobs/${createdJobId}`,
      token: newRecruiterToken, // Different recruiter!
      body: {
        title: "Malicious Edit By Other Recruiter",
      },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  await test("Authorized owner recruiter can update their own job posting", async () => {
    const res = await request({
      method: "PUT",
      path: `/api/jobs/${createdJobId}`,
      token: recruiterToken, // Creator recruiter
      body: {
        salary: "₹9 - ₹13 LPA",
        location: "Hyderabad / Hybrid",
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.job.salary, "₹9 - ₹13 LPA");
  });

  // 9. Application CRUD & Duplicate Prevention
  let createdApplicationId;
  await test("Student can apply for an active job", async () => {
    const res = await request({
      method: "POST",
      path: `/api/applications/apply/${createdJobId}`,
      token: newStudentToken,
      body: {
        notes: "I am passionate about Cloud DevOps and meet all qualifications.",
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert(res.body.application.id);
    createdApplicationId = res.body.application.id;
  });

  await test("Duplicate application by the same student is prevented with 400 Bad Request", async () => {
    const res = await request({
      method: "POST",
      path: `/api/applications/apply/${createdJobId}`,
      token: newStudentToken,
      body: {
        notes: "Applying a second time",
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert(res.body.message.includes("already applied"));
  });

  await test("Student can retrieve their own application history", async () => {
    const res = await request({
      method: "GET",
      path: "/api/applications/my",
      token: newStudentToken,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert(Array.isArray(res.body.applications));
    assert.strictEqual(res.body.applications.length, 1);
    assert.strictEqual(res.body.applications[0].jobId, createdJobId);
  });

  // 10. Application Status Updates & Recruiter Ownership
  await test("Recruiter who owns the job can update candidate application status", async () => {
    const res = await request({
      method: "PATCH",
      path: `/api/applications/${createdApplicationId}/status`,
      token: recruiterToken,
      body: {
        status: "Interview",
        notes: "Impressive DevOps project portfolio. Shortlisted for technical interview.",
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.application.status, "Interview");
  });

  await test("Another recruiter cannot update application status for jobs they don't own (403)", async () => {
    const res = await request({
      method: "PATCH",
      path: `/api/applications/${createdApplicationId}/status`,
      token: newRecruiterToken,
      body: {
        status: "Rejected",
      },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  // 11. Admin Endpoints: Stats, Users, Activate/Deactivate
  await test("Admin can retrieve portal dashboard statistics", async () => {
    const res = await request({
      method: "GET",
      path: "/api/admin/stats",
      token: adminToken,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert(res.body.stats.totalStudents >= 2);
    assert(res.body.stats.totalJobs >= 5);
  });

  await test("Admin can deactivate a user account", async () => {
    const res = await request({
      method: "PATCH",
      path: `/api/admin/users/${newStudentUser_id = (await request({ method: "GET", path: "/api/auth/me", token: newStudentToken })).body.user.id}/status`,
      token: adminToken,
      body: { status: "inactive" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  await test("Deactivated user cannot log in and protected routes reject them (403)", async () => {
    const loginRes = await request({
      method: "POST",
      path: "/api/auth/login",
      body: {
        email: newStudentEmail,
        password: "password123",
      },
    });
    assert.strictEqual(loginRes.status, 403);
    assert.strictEqual(loginRes.body.success, false);
    assert(loginRes.body.message.includes("deactivated"));

    const protectedRes = await request({
      method: "GET",
      path: "/api/applications/my",
      token: newStudentToken,
    });
    assert.strictEqual(protectedRes.status, 403);
  });

  await test("Admin can reactivate user account", async () => {
    const res = await request({
      method: "PATCH",
      path: `/api/admin/users/${newStudentUser_id}/status`,
      token: adminToken,
      body: { status: "active" },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  // 12. Cleanup: Delete test job
  await test("Owner recruiter can delete their job posting", async () => {
    const res = await request({
      method: "DELETE",
      path: `/api/jobs/${createdJobId}`,
      token: recruiterToken,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  console.log("\n=======================================================");
  console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED `);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Start temporary test server
server = http.createServer(app);
server.listen(port, async () => {
  baseUrl = `http://127.0.0.1:${port}`;
  try {
    await runTests();
  } finally {
    server.close();
  }
});
