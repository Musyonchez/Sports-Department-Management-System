/* Backend Team: See API_CLIENT section at bottom for integration points.
 */

// 1. CONFIGURATION & CONSTANTS

const APP_CONFIG = {
  API_BASE_URL: 'http://localhost:8000/api',
  DEBUG: true,
  STORAGE_PREFIX: 'sbs_',
  SESSION_TIMEOUT: 30 * 60 * 1000,
};

//2. GLOBAL STATE MANAGER

class StateManager {
  constructor() {
    this.state = {
      user: this.loadUser(),
      isAuthenticated: !!this.loadUser(),
      notifications: [],
      bookings: [],
      equipmentLoans: [],
      currentPage: this.getCurrentPage(),
    };
    this.listeners = [];
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  loadUser() {
    const stored = localStorage.getItem(`${APP_CONFIG.STORAGE_PREFIX}user`);
    return stored ? JSON.parse(stored) : null;
  }

  saveUser(user) {
    if (user) {
      localStorage.setItem(`${APP_CONFIG.STORAGE_PREFIX}user`, JSON.stringify(user));
    } else {
      localStorage.removeItem(`${APP_CONFIG.STORAGE_PREFIX}user`);
    }
    this.setState({ user, isAuthenticated: !!user });
  }

  getCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('admin')) return 'admin';
    if (path.includes('officer')) return 'officer';
    if (path.includes('student') || path.includes('facilities') || path.includes('equipment') || path.includes('profile')) return 'student';
    if (path.includes('login')) return 'login';
    if (path.includes('register')) return 'register';
    return 'home';
  }
}

const appState = new StateManager();

//3. API CLIENT (BACKEND INTEGRATION)

class ApiClient {
  constructor(baseUrl = APP_CONFIG.API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make HTTP requests
   * Backend: All endpoints should return { success, data, message, error }
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem(`${APP_CONFIG.STORAGE_PREFIX}token`);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        this.handleError(response.status, data);
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  handleError(status, data) {
    if (status === 401) {
      appState.saveUser(null);
      window.location.href = 'login.html';
    }
  }

  //AUTHENTICATION
  
  async login(email, password, role) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async verifyToken() {
    return this.request('/auth/verify', { method: 'GET' });
  }
 
  async getFacilities(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/facilities?${query}`);
  }

  async getFacilityById(id) {
    return this.request(`/facilities/${id}`);
  }

  async createFacility(data) {
    return this.request('/facilities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFacility(id, data) {
    return this.request(`/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFacility(id) {
    return this.request(`/facilities/${id}`, { method: 'DELETE' });
  }
 
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/bookings?${query}`);
  }

  async getBookingById(id) {
    return this.request(`/bookings/${id}`);
  }

  async updateBooking(id, data) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(id) {
    return this.request(`/bookings/${id}/cancel`, { method: 'POST' });
  }
 
  async getEquipment(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/equipment?${query}`);
  }

  async getEquipmentById(id) {
    return this.request(`/equipment/${id}`);
  }

  async createEquipment(data) {
    return this.request('/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEquipment(id, data) {
    return this.request(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

 
  async requestLoan(loanData) {
    return this.request('/loans', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  }

  async getLoans(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/loans?${query}`);
  }

  async approveLoan(id) {
    return this.request(`/loans/${id}/approve`, { method: 'POST' });
  }

  async rejectLoan(id, reason) {
    return this.request(`/loans/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async returnEquipment(id) {
    return this.request(`/loans/${id}/return`, { method: 'POST' });
  }
 
  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getAllUsers(role = null) {
    const query = role ? `?role=${role}` : '';
    return this.request(`/users${query}`);
  }

 
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'POST' });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', { method: 'POST' });
  }

 
  async getAnalytics(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/analytics?${query}`);
  }

  async generateReport(type, filters = {}) {
    return this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, filters }),
    });
  }

  async exportReport(type, format = 'pdf') {
    return this.request(`/reports/export?type=${type}&format=${format}`);
  }

  async createTimeSlot(slotData) {
    return this.request('/time-slots', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  }

  async getTimeSlots(facilityId) {
    return this.request(`/time-slots?facility=${facilityId}`);
  }

  async deleteTimeSlot(id) {
    return this.request(`/time-slots/${id}`, { method: 'DELETE' });
  }

  
  async submitComplaint(data) {
    return this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getComplaints(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/complaints?${query}`);
  }

  async updateComplaintStatus(id, status) {
    return this.request(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

const apiClient = new ApiClient();

//4. UI COMPONENTS & INTERACTIONS

class UIManager {
  constructor() {
    this.initEventListeners();
  }

  //SIDEBAR TOGGLE
  
  initEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar--open');
      });
    }

    // Modal management
    this.setupModalListeners();

    // Form submissions
    this.setupFormListeners();

    // Filter chips
    this.setupFilterListeners();

    // Notification bell
    this.setupNotificationListener();

    // Dynamic username
    this.updateUserDisplay();
  }

  // MODAL MANAGEMENT
  
  setupModalListeners() {

    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = btn.getAttribute('data-open-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          this.openModal(modal, btn.dataset);
        }
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        const modal = document.getElementById(modalId);
        if (modal) this.closeModal(modal);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeModal(overlay);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
          this.closeModal(modal);
        });
      }
    });
  }

  openModal(modal, data = {}) {
    modal.classList.add('modal-overlay--open');
    modal.style.display = 'flex';

    // Pre-fill modal fields with data
    if (data.equipment) {
      const field = modal.querySelector('#loanEquipmentField');
      const nameSpan = modal.querySelector('#modalEquipmentName');
      if (field) field.value = data.equipment;
      if (nameSpan) nameSpan.textContent = data.equipment;
    }
    if (data.facility) {
      const nameSpan = modal.querySelector('#modalFacilityName');
      if (nameSpan) nameSpan.textContent = data.facility;
    }
  }

  closeModal(modal) {
    modal.classList.remove('modal-overlay--open');
    modal.style.display = 'none';
  }

  // FORM HANDLING 
  
  setupFormListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => this.handleBooking(e));
    }

    // Loan form
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
      loanForm.addEventListener('submit', (e) => this.handleLoan(e));
    }

    // Profile form
    const profileForm = document.getElementById('editProfileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
    }

    // Password form
    const passwordForm = document.getElementById('changePasswordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
    }

    // Toggle password visibility
    document.querySelectorAll('.togglePassword, .password-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = btn.closest('.input-field, .password-input-wrap')?.querySelector('input');
        if (input) {
          input.type = input.type === 'password' ? 'text' : 'password';
          btn.classList.toggle('fa-eye');
          btn.classList.toggle('fa-eye-slash');
        }
      });
    });
  }

  async handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    const role = form.querySelector('#role').value;

    if (!this.validateForm(form)) return;

    try {
      this.showLoading(form);
      const response = await apiClient.login(email, password, role);
      
      if (response.success) {
        // Save token and user data
        localStorage.setItem(`${APP_CONFIG.STORAGE_PREFIX}token`, response.data.token);
        appState.saveUser(response.data.user);
        
        // Redirect based on role
        const redirectMap = {
          admin: 'Admindashboard.html',
          officer: 'Officerdashboard.html',
          student: 'Studentdashboard.html',
        };
        window.location.href = redirectMap[role] || 'Studentdashboard.html';
      }
    } catch (error) {
      this.showError(form, error.message);
    } finally {
      this.hideLoading(form);
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!this.validateForm(form)) return;

    const formData = new FormData(form);
    const userData = Object.fromEntries(formData);

    try {
      this.showLoading(form);
      const response = await apiClient.register(userData);
      
      if (response.success) {
        this.showSuccess(form, 'Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      }
    } catch (error) {
      this.showError(form, error.message);
    } finally {
      this.hideLoading(form);
    }
  }

  async handleBooking(e) {
    e.preventDefault();
    const form = e.target;
    const modal = form.closest('.modal-overlay');
    
    if (!this.validateForm(form)) return;

    const bookingData = {
      facility: modal.querySelector('#modalFacilityName').textContent,
      date: form.querySelector('[name="date"]').value,
      time: form.querySelector('[name="time"]').value,
      purpose: form.querySelector('[name="purpose"]').value,
      participants: parseInt(form.querySelector('[name="participants"]').value),
    };

    try {
      this.showLoading(form);
      const response = await apiClient.createBooking(bookingData);
      
      if (response.success) {
        this.showSuccess(form, 'Booking submitted successfully!');
        this.closeModal(modal);
        form.reset();
        // Refresh bookings table
        this.loadBookingsTable();
      }
    } catch (error) {
      this.showError(form, error.message);
    } finally {
      this.hideLoading(form);
    }
  }

  async handleLoan(e) {
    e.preventDefault();
    const form = e.target;
    const modal = form.closest('.modal-overlay');
    
    if (!this.validateForm(form)) return;

    const loanData = {
      equipment: form.querySelector('#loanEquipmentField').value,
      quantity: form.querySelector('[name="quantity"]').value,
      returnDate: form.querySelector('[name="returnDate"]').value,
    };

    try {
      this.showLoading(form);
      const response = await apiClient.requestLoan(loanData);
      
      if (response.success) {
        this.showSuccess(form, 'Loan request submitted!');
        this.closeModal(modal);
        form.reset();
        // Refresh loans table
        this.loadLoansTable();
      }
    } catch (error) {
      this.showError(form, error.message);
    } finally {
      this.hideLoading(form);
    }
  }

  async handleProfileUpdate(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!this.validateForm(form)) return;

    const formData = new FormData(form);
    const userData = Object.fromEntries(formData);
    const userId = appState.state.user?.id;

    try {
      this.showLoading(form);
      const response = await apiClient.updateUser(userId, userData);
      
      if (response.success) {
        appState.saveUser(response.data);
        this.updateUserDisplay();
        this.showSuccess(form, 'Profile updated successfully!');
      }
    } catch (error) {
      this.showError(form, error.message);
    } finally {
      this.hideLoading(form);
    }
  }

  async handlePasswordChange(e) {
    e.preventDefault();
    const form = e.target;
    
    const currentPassword = form.querySelector('[name="currentPassword"]').value;
    const newPassword = form.querySelector('[name="newPassword"]').value;
    const confirmPassword = form.querySelector('[name="confirmPassword"]').value;

    if (newPassword !== confirmPassword) {
      this.showError(form, 'Passwords do not match');
      return;
    }

    if (!this.validateForm(form)) return;

    try {
      this.showLoading(form);
      const response = await apiClient.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        this.showSuccess(form, 'Password changed successfully!');
        form.reset();
      }
    } catch (error) {
      this.showError(form, error.message);
    } finally {
      this.hideLoading(form);
    }
  }

  
  setupFilterListeners() {
    document.querySelectorAll('.filter-chips').forEach(container => {
      container.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', async () => {
          // Update active chip
          container.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
          chip.classList.add('chip--active');

          const filter = chip.dataset.filter;
          const gridId = chip.closest('section')?.querySelector('[id$="Grid"]')?.id;

          if (gridId === 'equipmentGrid') {
            await this.filterEquipment(filter);
          } else if (gridId === 'facilityGrid') {
            await this.filterFacilities(filter);
          }
        });
      });
    });


    document.getElementById('facilitySearch')?.addEventListener('keyup', (e) => {
      this.searchFacilities(e.target.value);
    });

    document.getElementById('equipmentSearch')?.addEventListener('keyup', (e) => {
      this.searchEquipment(e.target.value);
    });
  }

  async filterEquipment(category) {
    const grid = document.getElementById('equipmentGrid');
    if (!grid) return;

    const items = grid.querySelectorAll('.facility-card');
    items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  async filterFacilities(category) {
    const grid = document.getElementById('facilityGrid');
    if (!grid) return;

    const items = grid.querySelectorAll('.facility-card');
    items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  searchFacilities(query) {
    const grid = document.getElementById('facilityGrid');
    if (!grid) return;

    const items = grid.querySelectorAll('.facility-card');
    items.forEach(item => {
      const name = item.querySelector('h3').textContent.toLowerCase();
      item.style.display = name.includes(query.toLowerCase()) ? '' : 'none';
    });
  }

  searchEquipment(query) {
    const grid = document.getElementById('equipmentGrid');
    if (!grid) return;

    const items = grid.querySelectorAll('.facility-card');
    items.forEach(item => {
      const name = item.querySelector('h3').textContent.toLowerCase();
      item.style.display = name.includes(query.toLowerCase()) ? '' : 'none';
    });
  }

  //  NOTIFICATIONS
  
  setupNotificationListener() {
    const notifBell = document.getElementById('notifBell');
    if (notifBell) {
      notifBell.addEventListener('click', () => {
        window.location.href = 'notifications.html';
      });
      this.updateNotificationBadge();
    }
  }

  async updateNotificationBadge() {
    try {
      const response = await apiClient.getNotifications();
      if (response.success) {
        const unreadCount = response.data.filter(n => !n.is_read).length;
        const badge = document.getElementById('notifCount');
        if (badge) badge.textContent = unreadCount || '';
        const statTile = document.getElementById('statUnreadNotifications');
        if (statTile) statTile.textContent = unreadCount;
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }

  //  DATA LOADING

  async loadBookingsTable() {
    try {
      const response = await apiClient.getBookings();
      if (response.success) {
        const tbody = document.getElementById('myBookingsBody');
        if (tbody) {
          tbody.innerHTML = response.data.length ? response.data.map(booking => `
            <tr>
              <td>${booking.facility_name}</td>
              <td>${booking.date}</td>
              <td>${booking.start_time} – ${booking.end_time}</td>
              <td><span class="status-pill status-pill--${this.getStatusClass(booking.status)}">${booking.status}</span></td>
              <td>${['pending', 'confirmed'].includes(booking.status)
                ? `<button class="btn btn--outline-danger btn--sm" onclick="handleCancelBooking(${booking.id})">Cancel</button>`
                : ''}</td>
            </tr>
          `).join('') : '<tr><td colspan="5">No bookings yet.</td></tr>';
        }

        const statTotal = document.getElementById('statTotalBookings');
        if (statTotal) statTotal.textContent = response.data.length;
        const statPending = document.getElementById('statPendingRequests');
        if (statPending) {
          const pendingBookings = response.data.filter(b => b.status === 'pending').length;
          statPending.textContent = pendingBookings;
        }
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  }

  async loadLoansTable() {
    try {
      const response = await apiClient.getLoans();
      if (response.success) {
        const tbody = document.getElementById('myLoansBody');
        if (tbody) {
          tbody.innerHTML = response.data.length ? response.data.map(loan => `
            <tr>
              <td>${loan.equipment_name}</td>
              <td>${loan.quantity}</td>
              <td><span class="status-pill status-pill--${this.getStatusClass(loan.status)}">${loan.status}</span></td>
              <td>${loan.due_at || '—'}</td>
            </tr>
          `).join('') : '<tr><td colspan="4">No equipment loans yet.</td></tr>';
        }

        const statBorrowed = document.getElementById('statEquipmentBorrowed');
        if (statBorrowed) {
          const activeLoans = response.data.filter(l => ['approved', 'checked_out'].includes(l.status)).length;
          statBorrowed.textContent = activeLoans;
        }
      }
    } catch (error) {
      console.error('Failed to load loans:', error);
    }
  }

  updateUserDisplay() {
    const user = appState.state.user;
    if (user) {
      const usernameElements = document.querySelectorAll('.topbar-username, #topbarUsername, #welcomeUsername');
      usernameElements.forEach(el => {
        if (el.id === 'welcomeUsername') {
          el.textContent = user.firstName || user.name || 'User';
        } else {
          el.textContent = user.name || `${user.firstName} ${user.lastName}` || 'User';
        }
      });
    }
  }

  getStatusClass(status) {
    const statusMap = {
      pending: 'pending',
      confirmed: 'available',
      approved: 'available',
      checked_out: 'available',
      completed: 'booked',
      returned: 'booked',
      cancelled: 'maintenance',
      rejected: 'maintenance',
    };
    return statusMap[status] || 'pending';
  }

  //  FORM VALIDATION 
  
  validateForm(form) {
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        this.markFieldError(field);
        isValid = false;
      } else {
        this.clearFieldError(field);
      }
    });
    return isValid;
  }

  markFieldError(field) {
    field.classList.add('input-error');
    if (!field.parentElement.querySelector('.error-message')) {
      const error = document.createElement('span');
      error.className = 'error-message';
      error.textContent = 'This field is required';
      field.parentElement.appendChild(error);
    }
  }

  clearFieldError(field) {
    field.classList.remove('input-error');
    const error = field.parentElement.querySelector('.error-message');
    if (error) error.remove();
  }

  // FEEDBACK MESSAGES
  
  showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
    const btn = element.querySelector('button[type="submit"]');
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
      btn.disabled = true;
    }
  }

  hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
    const btn = element.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = btn.getAttribute('data-original-text') || 'Submit';
    }
  }

  showError(element, message) {
    const toast = this.createToast(message, 'error');
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  showSuccess(element, message) {
    const toast = this.createToast(message, 'success');
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'triangle-exclamation'}"></i>
      <span>${message}</span>
    `;
    return toast;
  }
}

//5. PAGE SPECIFIC INITIALIZATION
//

class PageManager {
  constructor(ui) {
    this.ui = ui;
    this.currentPage = appState.state.currentPage;
    this.initPage();
  }

  initPage() {
    if (!appState.state.isAuthenticated && 
        !['login', 'register', 'home'].includes(this.currentPage)) {
      window.location.href = 'login.html';
      return;
    }

    if (appState.state.isAuthenticated && 
        ['login', 'register'].includes(this.currentPage)) {
      window.location.href = this.getDefaultDashboard();
      return;
    }

    switch (this.currentPage) {
      case 'student':
        this.initStudentPage();
        break;
      case 'officer':
        this.initOfficerPage();
        break;
      case 'admin':
        this.initAdminPage();
        break;
    }
  }

  initStudentPage() {
    this.ui.loadBookingsTable();
    this.ui.loadLoansTable();
    this.ui.updateNotificationBadge();
  }

  initOfficerPage() {
    this.loadOfficerStats();
    this.loadRecentBookingsTable();
    this.loadLoanRequestsTable();
    this.setupOfficerActions();
  }

  initAdminPage() {
    this.loadAdminStats();
    this.loadUsersTable();
    this.loadComplaintsTable();
    this.setupAdminActions();
  }

  async loadOfficerStats() {
    try {
      const [facilitiesRes, loansRes, equipmentRes, bookingsRes] = await Promise.all([
        apiClient.getFacilities(),
        apiClient.getLoans({ status: 'pending' }),
        apiClient.getEquipment(),
        apiClient.getBookings(),
      ]);

      const setStat = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      };

      if (facilitiesRes.success) setStat('statTotalFacilities', facilitiesRes.data.length);
      if (loansRes.success) setStat('statPendingLoans', loansRes.data.length);
      if (equipmentRes.success) {
        const totalAvailable = equipmentRes.data.reduce((sum, e) => sum + e.available_quantity, 0);
        setStat('statEquipmentAvailable', totalAvailable);
      }
      if (bookingsRes.success) {
        const today = new Date().toISOString().slice(0, 10);
        setStat('statTodayBookings', bookingsRes.data.filter(b => b.date === today).length);
      }
    } catch (error) {
      console.error('Failed to load officer stats:', error);
    }
  }

  async loadRecentBookingsTable() {
    try {
      const response = await apiClient.getBookings();
      const tbody = document.getElementById('recentBookingsBody');
      if (!tbody || !response.success) return;

      tbody.innerHTML = response.data.length ? response.data.slice(0, 10).map(booking => `
        <tr>
          <td>${booking.student_name}</td>
          <td>${booking.facility_name}</td>
          <td>${booking.date}</td>
          <td>${booking.start_time} – ${booking.end_time}</td>
          <td><span class="status-pill status-pill--${this.ui.getStatusClass(booking.status)}">${booking.status}</span></td>
        </tr>
      `).join('') : '<tr><td colspan="5">No bookings yet.</td></tr>';
    } catch (error) {
      console.error('Failed to load recent bookings:', error);
    }
  }

  async loadLoanRequestsTable() {
    try {
      const response = await apiClient.getLoans();
      const tbody = document.getElementById('loanRequestsBody');
      if (!tbody || !response.success) return;

      const actionsFor = (loan) => {
        if (loan.status === 'pending') {
          return `
            <button class="btn btn--success btn--sm" data-loan-action="approve">Approve</button>
            <button class="btn btn--outline-danger btn--sm" data-loan-action="reject">Reject</button>
          `;
        }
        if (['approved', 'checked_out'].includes(loan.status)) {
          return `<button class="btn btn--outline btn--sm" data-loan-action="return">Mark Returned</button>`;
        }
        return `<span class="status-pill status-pill--${this.ui.getStatusClass(loan.status)}">${loan.status}</span>`;
      };

      tbody.innerHTML = response.data.length ? response.data.map(loan => `
        <tr data-loan-id="${loan.id}">
          <td>${loan.student_name}</td>
          <td>${loan.equipment_name}</td>
          <td>${loan.quantity}</td>
          <td>${loan.due_at || '—'}</td>
          <td class="table-action-group">${actionsFor(loan)}</td>
        </tr>
      `).join('') : '<tr><td colspan="5">No loan requests yet.</td></tr>';
    } catch (error) {
      console.error('Failed to load loan requests:', error);
    }
  }

  setupOfficerActions() {
    const tbody = document.getElementById('loanRequestsBody');
    if (!tbody) return;

    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-loan-action]');
      if (!btn) return;
      const action = btn.dataset.loanAction;
      if (action === 'approve') this.handleApproveLoan(e);
      if (action === 'reject') this.handleRejectLoan(e);
      if (action === 'return') this.handleReturnLoan(e);
    });
  }

  setupAdminActions() {
    const tbody = document.getElementById('complaintsBody');
    if (!tbody) return;

    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-complaint-action="resolve"]');
      if (!btn) return;
      this.handleResolveComplaint(e);
    });
  }

  async refreshLoanRequests() {
    await this.loadLoanRequestsTable();
    await this.loadOfficerStats();
  }

  async handleApproveLoan(e) {
    const loanId = e.target.closest('tr')?.dataset.loanId;
    if (!loanId) return;

    try {
      const response = await apiClient.approveLoan(loanId);
      if (response.success) await this.refreshLoanRequests();
    } catch (error) {
      alert('Failed to approve loan: ' + error.message);
    }
  }

  async handleRejectLoan(e) {
    const loanId = e.target.closest('tr')?.dataset.loanId;
    if (!loanId) return;

    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await apiClient.rejectLoan(loanId, reason);
      if (response.success) await this.refreshLoanRequests();
    } catch (error) {
      alert('Failed to reject loan: ' + error.message);
    }
  }

  async handleReturnLoan(e) {
    const loanId = e.target.closest('tr')?.dataset.loanId;
    if (!loanId) return;

    try {
      const response = await apiClient.returnEquipment(loanId);
      if (response.success) await this.refreshLoanRequests();
    } catch (error) {
      alert('Failed to check in equipment: ' + error.message);
    }
  }

  async loadAdminStats() {
    try {
      const [usersRes, facilitiesRes, equipmentRes] = await Promise.all([
        apiClient.getAllUsers(),
        apiClient.getFacilities(),
        apiClient.getEquipment(),
      ]);

      const setStat = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      };

      if (usersRes.success) {
        setStat('statTotalStudents', usersRes.data.filter(u => u.role === 'student').length);
        setStat('statTotalOfficers', usersRes.data.filter(u => u.role === 'officer').length);
      }
      if (facilitiesRes.success) setStat('statTotalFacilitiesAdmin', facilitiesRes.data.length);
      if (equipmentRes.success) {
        const totalItems = equipmentRes.data.reduce((sum, e) => sum + e.total_quantity, 0);
        setStat('statTotalEquipmentItems', totalItems);
      }
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    }
  }

  async loadUsersTable() {
    try {
      const response = await apiClient.getAllUsers();
      const tbody = document.getElementById('userManagementBody');
      if (!tbody || !response.success) return;

      const roleLabel = { student: 'Student', officer: 'Sports Officer', admin: 'Administrator' };

      tbody.innerHTML = response.data.length ? response.data.map(user => `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${roleLabel[user.role] || user.role}</td>
          <td>${(user.created_at || '').slice(0, 10)}</td>
        </tr>
      `).join('') : '<tr><td colspan="4">No users yet.</td></tr>';
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  async loadComplaintsTable() {
    try {
      const response = await apiClient.getComplaints();
      const tbody = document.getElementById('complaintsBody');
      if (!tbody || !response.success) return;

      tbody.innerHTML = response.data.length ? response.data.map(c => `
        <tr data-complaint-id="${c.id}">
          <td>${c.subject}</td>
          <td>${c.student_name}</td>
          <td>${(c.created_at || '').slice(0, 10)}</td>
          <td><span class="status-pill status-pill--${this.ui.getStatusClass(c.status)}">${c.status}</span></td>
          <td>${c.status !== 'resolved'
            ? `<button class="btn btn--outline btn--sm" data-complaint-action="resolve">Resolve</button>`
            : ''}</td>
        </tr>
      `).join('') : '<tr><td colspan="5">No complaints yet.</td></tr>';
    } catch (error) {
      console.error('Failed to load complaints:', error);
    }
  }

  async handleResolveComplaint(e) {
    const complaintId = e.target.closest('tr')?.dataset.complaintId;
    if (!complaintId) return;

    try {
      const response = await apiClient.updateComplaintStatus(complaintId, 'resolved');
      if (response.success) await this.loadComplaintsTable();
    } catch (error) {
      alert('Failed to resolve complaint: ' + error.message);
    }
  }

  getDefaultDashboard() {
    const role = appState.state.user?.role;
    const dashboardMap = {
      admin: 'Admindashboard.html',
      officer: 'Officerdashboard.html',
      student: 'Studentdashboard.html',
    };
    return dashboardMap[role] || 'Studentdashboard.html';
  }
}

//6. GLOBAL FUNCTIONS FOR HTML
//

async function handleCancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;
  
  try {
    const response = await apiClient.cancelBooking(bookingId);
    if (response.success) {
      location.reload();
    }
  } catch (error) {
    alert('Failed to cancel booking');
  }
}

//7. INITIALIZATION
//

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing Sports Booking System');
  
  // Verify token if user is authenticated
  if (appState.state.isAuthenticated) {
    apiClient.verifyToken().catch(() => {
      appState.saveUser(null);
      window.location.href = 'login.html';
    });
  }

  
  const ui = new UIManager();

  new PageManager(ui);

  // Refresh notifications every minute
  setInterval(() => {
    document.querySelector('.topbar-right')?.querySelector('.icon-btn')?.click();
  }, 60000);
});

// 8. EXPORT FOR MODULE SYSTEMS// 

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ApiClient, StateManager, UIManager, PageManager };
}