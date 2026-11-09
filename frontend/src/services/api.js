const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

/**
 * Helper to get authorization headers
 */
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('intervue_token');
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Health check to detect if backend is live
 */
export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch (err) {
    return false;
  }
};

/**
 * Auth APIs
 */
export const apiLogin = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Login failed');
  }
  return await res.json();
};

export const apiRegister = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Registration failed');
  }
  return await res.json();
};

/**
 * Upload PDF Resume (Multer Multipart POST /api/resume/upload)
 */
export const apiUploadResume = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/resume/upload`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Resume upload failed');
  }
  return data;
};

/**
 * Get latest uploaded resume analysis
 */
export const apiGetLatestResume = async () => {
  const res = await fetch(`${API_BASE_URL}/resume/latest`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve latest resume analysis');
  }
  return await res.json();
};

/**
 * Resume Analysis API (JSON fallback)
 */
export const apiAnalyzeResume = async (resumeData) => {
  const res = await fetch(`${API_BASE_URL}/resumes/analyze`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(resumeData),
  });
  if (!res.ok) {
    throw new Error('Resume analysis API failed');
  }
  return await res.json();
};

/**
 * Interview APIs
 */
export const apiGetQuestions = async (role = 'Senior Full Stack Engineer', skills = []) => {
  const queryParams = new URLSearchParams({
    role,
    skills: Array.isArray(skills) ? skills.join(',') : '',
  });
  const res = await fetch(`${API_BASE_URL}/interviews/questions?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve interview questions');
  }
  return await res.json();
};

/**
 * Generate a personalized interview session (5 questions based on resume + difficulty)
 */
export const apiGenerateInterview = async ({ difficulty = 'Intermediate', role, resumeId, resumeData } = {}) => {
  const res = await fetch(`${API_BASE_URL}/interviews/generate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ difficulty, role, resumeId, resumeData }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to generate interview');
  return data; // { interviewId, questions, difficulty, role, count }
};

/**
 * Save a proctoring event (tab switch, camera off, etc.)
 */
export const apiSaveProctoringEvent = async (interviewId, event) => {
  try {
    await fetch(`${API_BASE_URL}/interviews/${interviewId}/proctor`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ event }),
    });
  } catch {
    // Non-critical — swallow silently
  }
};

export const apiSubmitInterview = async (sessionData) => {
  const res = await fetch(`${API_BASE_URL}/interviews/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(sessionData),
  });
  if (!res.ok) {
    throw new Error('Failed to submit interview answers');
  }
  return await res.json();
};
