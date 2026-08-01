document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();
    initializeNotifications();
    initializeModals();
    initializeSearch();
    initializeForms();

});

const notificationBtn = document.querySelector(".icon-btn");

if (notificationBtn) {

    notificationBtn.addEventListener("click", function () {

        window.location.href = "officer-notifications.html";

    });

}


function initializeSidebar() {

    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");

    if (!sidebar || !toggle) return;

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });

}

// Notification Bell

function initializeNotifications() {

    const bell = document.getElementById("notifBell");

    if (!bell) return;

    bell.addEventListener("click", () => {
        alert("No new notifications.");
    });

}

function initializeModals() {

    // Open Modal
    document.querySelectorAll("[data-open-modal]").forEach(button => {

        button.addEventListener("click", () => {

            const modalId = button.dataset.openModal;
            const modal = document.getElementById(modalId);

            if (modal) {
                modal.classList.add("active");
            }

        });

    });

    // Close Modal
    document.querySelectorAll("[data-close-modal]").forEach(button => {

        button.addEventListener("click", () => {

            const modalId = button.dataset.closeModal;
            const modal = document.getElementById(modalId);

            if (modal) {
                modal.classList.remove("active");
            }

        });

    });

}

function initializeSearch() {

    const searches = document.querySelectorAll("input[type='search']");

    searches.forEach(search => {

        search.addEventListener("keyup", () => {

            const filter = search.value.toLowerCase();

            const table =
                search.closest(".table-card")?.querySelector("tbody");

            if (!table) return;

            table.querySelectorAll("tr").forEach(row => {

                const text = row.textContent.toLowerCase();

                row.style.display =
                    text.includes(filter) ? "" : "none";

            });

        });

    });

}


function initializeForms() {

    document.querySelectorAll("form").forEach(form => {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            alert("Saved successfully.");

        });

    });

}
// Officer Management Functions

document.addEventListener("DOMContentLoaded", () => {

    initializeBookingActions();
    initializeLoanActions();
    initializeComplaintActions();
    initializeDeleteButtons();
    updateOfficerStatistics();

});

//Booking Requests

function initializeBookingActions() {

    document.querySelectorAll(".approve-booking").forEach(button => {

        button.addEventListener("click", function () {

            const row = this.closest("tr");

            const status = row.querySelector(".status-pill");

            if (status) {
                status.textContent = "Approved";
                status.className =
                    "status-pill status-pill--available";
            }

            updateOfficerStatistics();

        });

    });

    document.querySelectorAll(".reject-booking").forEach(button => {

        button.addEventListener("click", function () {

            const row = this.closest("tr");

            const status = row.querySelector(".status-pill");

            if (status) {
                status.textContent = "Rejected";
                status.className =
                    "status-pill status-pill--booked";
            }

            updateOfficerStatistics();

        });

    });

}

// Equipment Loans

function initializeLoanActions() {

    document.querySelectorAll(".approve-loan").forEach(button => {

        button.addEventListener("click", function () {

            const row = this.closest("tr");

            const status = row.querySelector(".status-pill");

            if (status) {
                status.textContent = "Approved";
                status.className =
                    "status-pill status-pill--available";
            }

            updateOfficerStatistics();

        });

    });

    document.querySelectorAll(".reject-loan").forEach(button => {

        button.addEventListener("click", function () {

            const row = this.closest("tr");

            const status = row.querySelector(".status-pill");

            if (status) {
                status.textContent = "Rejected";
                status.className =
                    "status-pill status-pill--booked";
            }

            updateOfficerStatistics();

        });

    });

}

// Complaints

function initializeComplaintActions() {

    document.querySelectorAll(".resolve-complaint").forEach(button => {

        button.addEventListener("click", function () {

            const row = this.closest("tr");

            const status = row.querySelector(".status-pill");

            if (status) {
                status.textContent = "Resolved";
                status.className =
                    "status-pill status-pill--available";
            }

            updateOfficerStatistics();

        });

    });

}

function initializeDeleteButtons() {

    document.querySelectorAll(".delete-row").forEach(button => {

        button.addEventListener("click", function () {

            if (confirm("Delete this record?")) {

                this.closest("tr").remove();

                updateOfficerStatistics();

            }

        });

    });

}

// Dashboard Statistics

function updateOfficerStatistics() {

    const bookings =
        document.querySelectorAll(".booking-row").length;

    const loans =
        document.querySelectorAll(".loan-row").length;

    const complaints =
        document.querySelectorAll(".complaint-row").length;

    const facilities =
        document.querySelectorAll(".facility-card").length;

    const equipment =
        document.querySelectorAll(".equipment-card").length;

    const bookingCard =
        document.getElementById("totalBookings");

    const loanCard =
        document.getElementById("totalLoans");

    const complaintCard =
        document.getElementById("totalComplaints");

    const facilityCard =
        document.getElementById("totalFacilities");

    const equipmentCard =
        document.getElementById("totalEquipment");

    if (bookingCard)
        bookingCard.textContent = bookings;

    if (loanCard)
        loanCard.textContent = loans;

    if (complaintCard)
        complaintCard.textContent = complaints;

    if (facilityCard)
        facilityCard.textContent = facilities;

    if (equipmentCard)
        equipmentCard.textContent = equipment;

}
// STATISTICS

const dashboardStats = {
    totalBookings: 48,
    approvedBookings: 35,
    pendingBookings: 13,
    pendingLoans: 8,
    todayBookings: 9,
    openComplaints: 5,
    availableEquipment: 286,
    totalFacilities: 8
};

function loadDashboardStatistics() {

    const totalBookings = document.getElementById("totalBookings");
    const approvedBookings = document.getElementById("approvedBookings");
    const pendingBookings = document.getElementById("pendingBookings");
    const pendingLoans = document.getElementById("pendingLoans");
    const todayBookings = document.getElementById("todayBookings");
    const openComplaints = document.getElementById("openComplaints");
    const availableEquipment = document.getElementById("availableEquipment");
    const totalFacilities = document.getElementById("totalFacilities");

    if (totalBookings)
        totalBookings.textContent = dashboardStats.totalBookings;

    if (approvedBookings)
        approvedBookings.textContent = dashboardStats.approvedBookings;

    if (pendingBookings)
        pendingBookings.textContent = dashboardStats.pendingBookings;

    if (pendingLoans)
        pendingLoans.textContent = dashboardStats.pendingLoans;

    if (todayBookings)
        todayBookings.textContent = dashboardStats.todayBookings;

    if (openComplaints)
        openComplaints.textContent = dashboardStats.openComplaints;

    if (availableEquipment)
        availableEquipment.textContent = dashboardStats.availableEquipment;

    if (totalFacilities)
        totalFacilities.textContent = dashboardStats.totalFacilities;

}

loadDashboardStatistics();

function updateOfficerDashboardStats() {

    const pendingBookings =
        document.querySelectorAll(".status-pill--pending").length;

    const approvedBookings =
        document.querySelectorAll(".status-pill--available").length;

    const openComplaints =
        document.querySelectorAll(".complaint-open").length;

    const pendingBookingCard =
        document.getElementById("pendingBookings");

    if (pendingBookingCard) {
        pendingBookingCard.textContent = pendingBookings;
    }

    const pendingLoanCard =
        document.getElementById("pendingLoans");

    if (pendingLoanCard) {
        pendingLoanCard.textContent = pendingBookings;
    }

    const complaintsCard =
        document.getElementById("openComplaints");

    if (complaintsCard) {
        complaintsCard.textContent = openComplaints;
    }

}
document.addEventListener("DOMContentLoaded", function () {

    updateOfficerDashboardStats();

});
//NOTIFICATIONS

document.addEventListener("DOMContentLoaded", function () {

    const notificationCount = document.getElementById("notificationCount");
    const markAllBtn = document.getElementById("markAllRead");

    if (!markAllBtn) return;

    markAllBtn.addEventListener("click", function () {

        const statusPills = document.querySelectorAll(".data-table tbody .status-pill");

        statusPills.forEach(function (pill) {

            const status = pill.textContent.trim();

            if (
                status === "New" ||
                status === "Pending" ||
                status === "Urgent" ||
                status === "Warning"
            ) {

                pill.textContent = "Read";

                pill.classList.remove(
                    "status-pill--pending",
                    "status-pill--booked"
                );

                pill.classList.add("status-pill--available");

            }

        });

        if (notificationCount) {
            notificationCount.textContent = "0";
        }

        alert("All notifications have been marked as read.");

    });

});
// REPORTS

document.addEventListener("DOMContentLoaded", function () {

    const generateReportBtn = document.getElementById("generateReport");

    if (generateReportBtn) {

        generateReportBtn.addEventListener("click", function () {

            const reportType = document.getElementById("reportType").value;
            const startDate = document.getElementById("startDate").value;
            const endDate = document.getElementById("endDate").value;

            if (!startDate || !endDate) {
                alert("Please select the report dates.");
                return;
            }

            alert(
                reportType +
                " Report generated successfully!\n\n" +
                "Period: " +
                startDate +
                " to " +
                endDate
            );

        });

    }

});
//SEARCH TABLES

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.querySelector(".search-box input");

    if (!searchInput) return;

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const rows = document.querySelectorAll("tbody tr");

        rows.forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(value)
                    ? ""
                    : "none";

        });

    });

});