import { supabase } from './config.js';

// DOM Elements
const authModal = document.getElementById('authModal');
const authBtn = document.getElementById('authBtn');
const closeBtn = document.getElementById('closeAuth');
const authForm = document.getElementById('authForm');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const fullNameGroup = document.getElementById('fullNameGroup');
const submitAuth = document.getElementById('submitAuth');
const userMenu = document.getElementById('userMenu');
const userNameDisplay = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

const heroSection = document.getElementById('hero');
const featuresSection = document.getElementById('features');
const aboutSection = document.getElementById('about');
const footerSection = document.getElementById('footerSection');
const dashboardSection = document.getElementById('dashboard');
const userDashboard = document.getElementById('userDashboard');
const adminDashboard = document.getElementById('adminDashboard');
const dashboardUserName = document.getElementById('dashboardUserName');
const dashboardRole = document.getElementById('dashboardRole');

const bookingForm = document.getElementById('bookingForm');
const userBookingsTable = document.getElementById('userBookingsTable')?.querySelector('tbody');
const adminActiveTableBody = document.getElementById('adminActiveTableBody');
const adminArchiveTableBody = document.getElementById('adminArchiveTableBody');
const toggleArchiveBtn = document.getElementById('toggleArchive');
const archiveContent = document.getElementById('archiveContent');
const adminStatusFilter = document.getElementById('adminStatusFilter');
const adminSearchInput = document.getElementById('adminSearch');
const detailModal = document.getElementById('detailModal');
const bookingDetailContent = document.getElementById('bookingDetailContent');
const profileModal = document.getElementById('profileModal');
const profileForm = document.getElementById('profileForm');
const profileFullName = document.getElementById('profileFullName');
const profileEmailInput = document.getElementById('profileEmail');

let isLogin = true;
let allAdminBookings = [];
let allUserBookings = [];
let currentUserId = null;
let currentProfile = null;
let isInitialized = false;

console.log("App.js: Stabilized Auth & UI Orchestrator active.");

// --- UX Utilities ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto-remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// --- UI Management ---

window.showAuth = () => {
    if (authModal) authModal.style.display = 'flex';
};

function toggleAuthMode() {
    isLogin = !isLogin;
    loginTab.classList.toggle('active');
    signupTab.classList.toggle('active');
    fullNameGroup.style.display = isLogin ? 'none' : 'block';
    submitAuth.textContent = isLogin ? 'Login' : 'Sign Up';
}

function initListeners() {
    if (isInitialized) return;
    isInitialized = true;

    console.log("App.js: Wiring up listeners...");
    if (loginTab) loginTab.onclick = () => { if (!isLogin) toggleAuthMode(); };
    if (signupTab) signupTab.onclick = () => { if (isLogin) toggleAuthMode(); };
    if (closeBtn) closeBtn.onclick = () => { authModal.style.display = 'none'; };
    if (authBtn) authBtn.onclick = window.showAuth;
    if (authForm) authForm.onsubmit = handleAuth;
    if (bookingForm) {
        bookingForm.onsubmit = handleBookingSubmit;
        // Proactive Date Validation: Prevent past dates
        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
    if (adminStatusFilter) adminStatusFilter.onchange = filterAdminBookings;
    if (adminSearchInput) adminSearchInput.oninput = filterAdminBookings;
    if (profileForm) profileForm.onsubmit = handleProfileUpdate;
    if (toggleArchiveBtn) {
        toggleArchiveBtn.onclick = () => {
            const isHidden = archiveContent.classList.toggle('hidden');
            toggleArchiveBtn.textContent = isHidden ? 'Show Archive' : 'Hide Archive';
        };
    }

    window.onclick = (e) => { if (e.target === authModal) authModal.style.display = 'none'; };

    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            await supabase.auth.signOut();
            location.reload();
        };
    }
}

let isFetchingProfile = false;

supabase.auth.onAuthStateChange(async (event, session) => {
    // Silence routine token refreshes from the console
    if (event === 'TOKEN_REFRESHED' && currentProfile) return;

    if (session?.user) {
        const user = session.user;

        // Log only significant state changes
        if (event !== 'TOKEN_REFRESHED' || !currentUserId) {
            console.log(`App.js: Auth State Change - ${event}`);
        }

        if (currentUserId === user.id && currentProfile && event === 'TOKEN_REFRESHED') return;
        currentUserId = user.id;

        updateUI(user, currentProfile);

        if (!currentProfile && !isFetchingProfile) {
            fetchProfile(user);
        } else if (currentProfile) {
            loadDashboardData(currentProfile, user);
        }
    } else {
        if (currentUserId) console.log('App.js: No session - resetting UI');
        currentUserId = null;
        currentProfile = null;
        isFetchingProfile = false;
        resetUI();
    }
});

async function fetchProfile(user) {
    if (isFetchingProfile) return;
    isFetchingProfile = true;
    try {
        console.log('App.js: Fetching user profile...');
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
            currentProfile = data;
            updateUI(user, currentProfile);
            loadDashboardData(currentProfile, user);
        } else {
            console.warn('App.js: Profile not found, using default role.');
            loadDashboardData({ role: 'user' }, user);
        }
    } catch (e) {
        console.error('App.js: Profile fetch error:', e);
        loadDashboardData({ role: 'user' }, user);
    } finally {
        isFetchingProfile = false;
    }
}

function updateUI(user, profile) {
    authBtn?.classList.add('hidden');
    userMenu?.classList.remove('hidden');
    if (userNameDisplay) userNameDisplay.textContent = profile?.full_name || user.email;

    heroSection?.classList.add('hidden');
    featuresSection?.classList.add('hidden');
    aboutSection?.classList.add('hidden');
    footerSection?.classList.add('hidden');
    dashboardSection?.classList.remove('hidden');

    if (dashboardUserName) dashboardUserName.textContent = profile?.full_name || user.email.split('@')[0];
    if (dashboardRole) dashboardRole.textContent = profile?.role === 'admin' ? 'Admin Panel' : 'User Panel';

    if (profile?.role === 'admin') {
        adminDashboard?.classList.remove('hidden');
        userDashboard?.classList.add('hidden');
    } else {
        userDashboard?.classList.remove('hidden');
        adminDashboard?.classList.add('hidden');
    }
}

function resetUI() {
    authBtn?.classList.remove('hidden');
    userMenu?.classList.add('hidden');
    heroSection?.classList.remove('hidden');
    featuresSection?.classList.remove('hidden');
    aboutSection?.classList.remove('hidden');
    footerSection?.classList.remove('hidden');
    dashboardSection?.classList.add('hidden');
}

// --- Data Orchestration ---

async function loadDashboardData(profile, user) {
    if (profile.role === 'admin') {
        fetchAdminBookings();
    } else {
        fetchUserBookings(user);
    }
}

async function fetchUserBookings(user) {
    if (!user) return;
    renderSkeleton(userBookingsTable);
    const { data } = await supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    allUserBookings = data || [];
    updateUserStats(allUserBookings);
    renderTable(userBookingsTable, data, false);
}

function updateUserStats(data) {
    if (!data) return;
    const stats = {
        total: data.length,
        active: data.filter(b => b.status === 'pending' || b.status === 'approved').length,
        resolved: data.filter(b => b.status === 'rejected' || b.status === 'completed').length // Note: completed is future-proofing
    };

    const elTotal = document.getElementById('userStatTotal');
    const elActive = document.getElementById('userStatActive');
    const elResolved = document.getElementById('userStatResolved');

    if (elTotal) elTotal.textContent = stats.total;
    if (elActive) elActive.textContent = stats.active;
    if (elResolved) elResolved.textContent = stats.resolved;
}

async function fetchAdminBookings() {
    try {
        console.log('App.js: Fetching all bookings for admin...');
        const { data, error } = await supabase
            .from('bookings')
            .select('*, profiles(full_name, email)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        allAdminBookings = data || [];
        updateAdminStats(allAdminBookings);
        filterAdminBookings();
    } catch (e) {
        if (e.code === 'PGRST200' || e.code === '42703') {
            console.warn('App.js: Join relationship or columns missing, falling back to basic fetch...');
            const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
            allAdminBookings = data || [];
            updateAdminStats(allAdminBookings);
            filterAdminBookings();
        } else {
            console.error('App.js: Admin fetch error:', e);
        }
    }
}

function updateAdminStats(data) {
    if (!data) return;
    const stats = {
        total: data.length,
        pending: data.filter(b => b.status === 'pending').length,
        approved: data.filter(b => b.status === 'approved').length,
        rejected: data.filter(b => b.status === 'rejected').length
    };

    const elTotal = document.getElementById('statTotal');
    const elPending = document.getElementById('statPending');
    const elApproved = document.getElementById('statApproved');
    const elRejected = document.getElementById('statRejected');

    if (elTotal) elTotal.textContent = stats.total;
    if (elPending) elPending.textContent = stats.pending;
    if (elApproved) elApproved.textContent = stats.approved;
    if (elRejected) elRejected.textContent = stats.rejected;
}

function filterAdminBookings() {
    const status = adminStatusFilter?.value || 'all';
    const query = adminSearchInput?.value?.toLowerCase() || '';

    // Initial split
    let activeData = allAdminBookings.filter(b => b.status !== 'rejected');
    let archiveData = allAdminBookings.filter(b => b.status === 'rejected');

    // Filter by Search Query (Name or Email)
    if (query) {
        activeData = activeData.filter(b =>
            (b.profiles?.full_name?.toLowerCase().includes(query)) ||
            (b.profiles?.email?.toLowerCase().includes(query)) ||
            (b.service_type?.toLowerCase().includes(query))
        );
        archiveData = archiveData.filter(b =>
            (b.profiles?.full_name?.toLowerCase().includes(query)) ||
            (b.profiles?.email?.toLowerCase().includes(query)) ||
            (b.service_type?.toLowerCase().includes(query))
        );
    }

    // Filter active data based on dropdown
    const filteredActive = status === 'all' ? activeData : activeData.filter(b => b.status === status);

    renderTable(adminActiveTableBody, filteredActive, true);
    renderTable(adminArchiveTableBody, archiveData, true);
}

function renderSkeleton(container) {
    if (!container) return;
    container.innerHTML = `
        <tr><td colspan="5"><div class="skeleton skeleton-row"></div></td></tr>
        <tr><td colspan="5"><div class="skeleton skeleton-row"></div></td></tr>
        <tr><td colspan="5"><div class="skeleton skeleton-row"></div></td></tr>
    `;
}

function renderTable(container, data, isAdmin) {
    if (!container) return;
    if (!data?.length) {
        container.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <div class="empty-state-icon">📂</div>
                        <p>No records found yet.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    container.innerHTML = '';
    data.forEach(booking => {
        const tr = document.createElement('tr');
        const userDisplay = isAdmin ? (booking.profiles?.full_name || booking.profiles?.email || booking.user_id.substring(0, 8) + '...') : '';

        tr.innerHTML = `
            ${isAdmin ? `<td><div style="font-weight:500;">${userDisplay}</div><div style="font-size:0.75rem; color:var(--text-secondary);">${booking.profiles?.email || ''}</div></td>` : ''}
            <td>${booking.service_type}</td>
            <td>${new Date(booking.preferred_date).toLocaleDateString()}</td>
            <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewDetails('${booking.id}')">View</button>
                    ${!isAdmin && booking.status === 'pending' ? `
                        <button class="btn btn-secondary btn-sm" onclick="cancelBooking('${booking.id}')">Cancel</button>
                    ` : ''}
                    ${isAdmin && booking.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" onclick="updateStatus('${booking.id}', 'approved')">Approve</button>
                        <button class="btn btn-secondary btn-sm" onclick="updateStatus('${booking.id}', 'rejected')">Reject</button>
                    ` : ''}
                    ${isAdmin && booking.status === 'approved' ? `
                        <button class="btn btn-outline btn-sm" onclick="updateStatus('${booking.id}', 'pending')">Pending</button>
                        <button class="btn btn-secondary btn-sm" onclick="updateStatus('${booking.id}', 'rejected')">Reject</button>
                    ` : ''}
                    ${isAdmin && booking.status === 'rejected' ? `
                        <button class="btn btn-outline btn-sm" onclick="updateStatus('${booking.id}', 'pending')">Restore</button>
                    ` : ''}
                </div>
            </td>
        `;
        container.appendChild(tr);
    });
}

// --- Interactivity ---

async function handleBookingSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn.disabled) return;

    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const sessionData = await supabase.auth.getSession();
    const user = sessionData?.data?.session?.user;

    if (!user) {
        btn.disabled = false;
        btn.textContent = 'Submit Request';
        return showToast("Please login first.", "error");
    }

    const formData = {
        user_id: user.id,
        service_type: document.getElementById('serviceType').value,
        preferred_date: document.getElementById('bookingDate').value,
        notes: document.getElementById('notes').value,
        status: 'pending'
    };

    const { error } = await supabase.from('bookings').insert([formData]);
    btn.disabled = false;
    btn.textContent = 'Submit Request';

    if (!error) {
        showToast('Booking submitted successfully!', 'success');
        bookingForm.reset();
        fetchUserBookings(user);
    } else {
        showToast(error.message, 'error');
    }
}

async function handleAuth(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn.disabled) return;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = isLogin ? 'Logging in...' : 'Signing up...';

    try {
        const { error } = isLogin
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });

        if (error) throw error;
        showToast(isLogin ? 'Welcome back!' : 'Account created!', 'success');
        authModal.style.display = 'none';
    } catch (error) {
        showToast(error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

window.updateStatus = async (id, status) => {
    let feedback = null;
    if (status === 'rejected') {
        feedback = prompt("Provide a reason for rejection (optional):");
    }

    const { error } = await supabase.from('bookings').update({ status, admin_feedback: feedback }).eq('id', id);
    if (!error) {
        showToast(`Booking ${status}!`, 'success');
        fetchAdminBookings();
    } else {
        showToast(error.message, 'error');
    }
};

window.cancelBooking = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (!error) {
        showToast('Booking cancelled.', 'success');
        const user = (await supabase.auth.getSession()).data.session?.user;
        fetchUserBookings(user);
    } else {
        showToast(error.message, 'error');
    }
};

window.viewDetails = (id) => {
    const isUserMode = adminDashboard?.classList.contains('hidden');
    const source = isUserMode ? allUserBookings : allAdminBookings;
    const booking = source ? source.find(b => b.id === id) : null;

    if (booking) {
        bookingDetailContent.innerHTML = `
            ${!isUserMode ? `
            <div class="detail-item">
                <span class="detail-label">Customer</span>
                <span class="detail-value">${booking.profiles?.full_name || 'Anonymous'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">${booking.profiles?.email || 'No email provided'}</span>
            </div>
            ` : ''
            }
            <div class="detail-item">
                <span class="detail-label">Service</span>
                <span class="detail-value">${booking.service_type}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Preferred Date</span>
                <span class="detail-value">${new Date(booking.preferred_date).toLocaleDateString()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="status-badge status-${booking.status}">${booking.status}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Reference ID</span>
                <span class="detail-value">${booking.id.substring(0, 8)}...</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Notes</span>
                <span class="detail-value">${booking.notes || 'No notes provided.'}</span>
            </div>
            ${booking.admin_feedback ? `
                <div class="detail-item rejection-feedback">
                    <span class="detail-label">Admin Feedback</span>
                    <span class="detail-value">${booking.admin_feedback}</span>
                </div>
            ` : ''}
        `;
    } else {
        bookingDetailContent.innerHTML = `< p > Error: Could not retrieve booking details.Please try refreshing the page.</p > `;
    }
    detailModal.style.display = 'flex';
};

window.showProfile = () => {
    if (!currentProfile) return;
    profileFullName.value = currentProfile.full_name || '';
    profileEmailInput.value = currentProfile.email || '';
    profileModal.style.display = 'flex';
};

window.closeProfileModal = () => {
    profileModal.style.display = 'none';
};

async function handleProfileUpdate(e) {
    e.preventDefault();
    const newName = profileFullName.value;
    const submitBtn = document.getElementById('submitProfile');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    const { error } = await supabase
        .from('profiles')
        .update({ full_name: newName, updated_at: new Date() })
        .eq('id', currentUserId);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Changes';

    if (error) {
        showToast(error.message, 'error');
    } else {
        showToast('Profile updated!', 'success');
        currentProfile.full_name = newName;
        updateUI((await supabase.auth.getSession()).data.session.user, currentProfile);
        closeProfileModal();
    }
}

window.closeDetailModal = () => { detailModal.style.display = 'none'; };

// Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initListeners);
} else {
    initListeners();
}
