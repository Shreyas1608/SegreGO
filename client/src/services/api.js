import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  switchRole: () => api.post('/auth/switch-role'),
  getAllUsers: () => api.get('/auth/users'),
  updateUserRole: (id, role) => api.put(`/auth/users/${id}/role`, { role }),
  adjustPoints: (id, pointsDelta) => api.put(`/auth/users/${id}/points`, { pointsDelta }),
};

export const scanAPI = {
  classifyWaste: (data) => api.post('/scans/classify', data),
  getMyScans: () => api.get('/scans/mine'),
  getScanHistory: (page = 1) => api.get(`/scans/history?page=${page}`),
};

export const binAPI = {
  getAllBins: () => api.get('/iot/bins'),
  getBinById: (id) => api.get(`/iot/bins/${id}`),
  createBin: (binData) => api.post('/iot/bins', binData),
  updateBin: (id, binData) => api.put(`/iot/bins/${id}`, binData),
  deleteBin: (id) => api.delete(`/iot/bins/${id}`),
  simulateBinData: () => api.post('/iot/simulate'),
};

export const complaintAPI = {
  createComplaint: (data) => api.post('/complaints', data),
  getMyComplaints: () => api.get('/complaints/mine'),
  getAllComplaints: () => api.get('/complaints'),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, typeof data === 'object' ? data : { status: data }),
};

export const collectionAPI = {
  getCollections: () => api.get('/collections'),
  getUpcoming: () => api.get('/collections/upcoming'),
  updateStatus: (id, status) => api.put(`/collections/${id}/status`, { status }),
};

export const rewardAPI = {
  getTransactions: () => api.get('/rewards/transactions'),
  getLeaderboard: () => api.get('/rewards/leaderboard'),
  getVouchers: () => api.get('/rewards/vouchers'),
  createVoucher: (voucherData) => api.post('/rewards/vouchers', voucherData),
  toggleVoucher: (id) => api.put(`/rewards/vouchers/${id}/toggle`),
  redeemVoucher: (voucherId) => api.post('/rewards/vouchers/redeem', { voucherId }),
};

export const analyticsAPI = {
  getUserImpact: () => api.get('/analytics/impact'),
  getAdminOverview: () => api.get('/analytics/overview'),
  getCityStats: () => api.get('/analytics/city'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const centerAPI = {
  getAllCenters: (type) => api.get(`/centers${type ? `?type=${type}` : ''}`),
  getCenterById: (id) => api.get(`/centers/${id}`),
  createCenter: (centerData) => api.post('/centers', centerData),
  updateCenter: (id, centerData) => api.put(`/centers/${id}`, centerData),
  deleteCenter: (id) => api.delete(`/centers/${id}`),
};

export default api;
