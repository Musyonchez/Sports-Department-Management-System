document.addEventListener("DOMContentLoaded", function () {

    const notificationBtn = document.getElementById("notificationBtn");

    if (notificationBtn) {

    notificationBtn.addEventListener("click", function () {

        window.location.href = "admin-notifications.html";

    });

}

    const totalStudents = document.getElementById("totalStudents");
    const totalOfficers = document.getElementById("totalOfficers");
    const totalFacilities = document.getElementById("totalFacilities");
    const totalEquipment = document.getElementById("totalEquipment");
    const totalBookings = document.getElementById("totalBookings");
    const totalLoans = document.getElementById("totalLoans");
    const pendingComplaints = document.getElementById("pendingComplaints");
    const pendingApprovals = document.getElementById("pendingApprovals");

    if (totalStudents) totalStudents.textContent = "1248";
    if (totalOfficers) totalOfficers.textContent = "18";
    if (totalFacilities) totalFacilities.textContent = "12";
    if (totalEquipment) totalEquipment.textContent = "356";
    if (totalBookings) totalBookings.textContent = "427";
    if (totalLoans) totalLoans.textContent = "94";
    if (pendingComplaints) pendingComplaints.textContent = "8";
    if (pendingApprovals) pendingApprovals.textContent = "15";

});

// Search Users
const userSearch = document.getElementById("userSearch");

if (userSearch) {

    userSearch.addEventListener("keyup", function () {

        const search = this.value.toLowerCase();

        const rows = document.querySelectorAll(".user-row");

        rows.forEach(function(row){

            const text = row.textContent.toLowerCase();

            if(text.includes(search)){

                row.style.display = "";

            }else{

                row.style.display = "none";

            }

        });

    });

}



// Add User
const addUserBtn = document.getElementById("addUserBtn");

if(addUserBtn){

    addUserBtn.addEventListener("click",function(){

        alert("Add User form will open here.");

    });

}



// Edit User
document.querySelectorAll(".edit-user").forEach(function(button){

    button.addEventListener("click",function(){

        alert("Edit User feature.");

    });

});



// Suspend / Activate
document.querySelectorAll(".suspend-user").forEach(function(button){

    button.addEventListener("click",function(){

        if(button.textContent.trim()=="Suspend"){

            button.textContent="Activate";

            alert("User Suspended");

        }

        else{

            button.textContent="Suspend";

            alert("User Activated");

        }

    });

});



// Delete User
document.querySelectorAll(".delete-user").forEach(function(button){

    button.addEventListener("click",function(){

        if(confirm("Delete this user?")){

            button.closest("tr").remove();

        }

    });

});

// Assign Role Form
const roleForm = document.getElementById("roleForm");

if (roleForm) {

    roleForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const user = document.getElementById("selectedUser").value;
        const role = document.getElementById("newRole").value;
        const status = document.getElementById("userStatus").value;

        alert(
            user +
            " has been assigned the role '" +
            role +
            "' with status '" +
            status +
            "'."
        );

    });

}



// Search Roles
const roleSearch = document.getElementById("roleSearch");

if (roleSearch) {

    roleSearch.addEventListener("keyup", function () {

        const search = this.value.toLowerCase();

        document.querySelectorAll(".role-row").forEach(function (row) {

            if (row.textContent.toLowerCase().includes(search)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });

}



// Update Current Role Automatically
const selectedUser = document.getElementById("selectedUser");
const currentRole = document.getElementById("currentRole");

if (selectedUser && currentRole) {

    selectedUser.addEventListener("change", function () {

        switch (this.value) {

            case "Jane Wanjiru":
                currentRole.value = "Student";
                break;

            case "Brian Kiptoo":
                currentRole.value = "Student";
                break;

            case "Mr. Otieno":
                currentRole.value = "Sports Officer";
                break;

            case "Faith Achieng":
                currentRole.value = "Student";
                break;

            default:
                currentRole.value = "";

        }

    });

}

// Notification Form
const notificationForm = document.getElementById("notificationForm");

if (notificationForm) {

    notificationForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const title = document.getElementById("notificationTitle").value;
        const audience = document.getElementById("notificationAudience").value;
        const message = document.getElementById("notificationMessage").value;

        if (title.trim() === "" || message.trim() === "") {

            alert("Please complete all fields.");
            return;

        }

        alert(
            "Notification sent successfully!\n\n" +
            "Title: " + title +
            "\nAudience: " + audience
        );

        notificationForm.reset();

    });

}



// Delete Notification
document.querySelectorAll(".delete-notification").forEach(function(button){

    button.addEventListener("click", function(){

        if(confirm("Delete this notification?")){

            this.closest("tr").remove();

        }

    });

});

// analytics

const analyticsPeriod = document.getElementById("analyticsPeriod");

if (analyticsPeriod) {

    analyticsPeriod.addEventListener("change", function () {

        const students = document.getElementById("studentsCount");
        const bookings = document.getElementById("bookingCount");
        const loans = document.getElementById("loanCount");
        const facilities = document.getElementById("facilityCount");

        if (this.value === "monthly") {

            students.textContent = "1248";
            bookings.textContent = "634";
            loans.textContent = "420";
            facilities.textContent = "6";

        }

        else if (this.value === "quarterly") {

            students.textContent = "1320";
            bookings.textContent = "1810";
            loans.textContent = "1198";
            facilities.textContent = "6";

        }

        else if (this.value === "yearly") {

            students.textContent = "1545";
            bookings.textContent = "7420";
            loans.textContent = "5060";
            facilities.textContent = "6";

        }

        alert("Analytics updated to " + this.options[this.selectedIndex].text);

    });

}

const reportForm = document.getElementById("reportForm");

if (reportForm) {

    reportForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const reportType = document.getElementById("reportType").value;
        const reportPeriod = document.getElementById("reportPeriod").value;

        alert(
            "Generating " +
            reportType +
            " report for " +
            reportPeriod +
            "."
        );

    });

}



// Download Report
document.querySelectorAll(".download-report").forEach(function(button){

    button.addEventListener("click", function(){

        alert("Report downloaded successfully.");

    });

});



// Export PDF
const exportPDF = document.getElementById("exportPDF");

if(exportPDF){

    exportPDF.addEventListener("click", function(){

        alert("Exporting report as PDF...");

    });

}



// Export Excel
const exportExcel = document.getElementById("exportExcel");

if(exportExcel){

    exportExcel.addEventListener("click", function(){

        alert("Exporting report as Excel...");

    });

}



// Print Report
const printReport = document.getElementById("printReport");

if(printReport){

    printReport.addEventListener("click", function(){

        window.print();

    });

}
//settings

const systemForm = document.getElementById("systemForm");
const bookingForm = document.getElementById("bookingForm");
const notificationForm = document.getElementById("notificationForm");

if (systemForm) {

    systemForm.addEventListener("submit", function(e) {
        e.preventDefault();

        alert("System information updated successfully.");
    });

}

if (bookingForm) {

    bookingForm.addEventListener("submit", function(e) {
        e.preventDefault();

        alert("Booking settings updated.");
    });

}

if (notificationForm) {

    notificationForm.addEventListener("submit", function(e) {
        e.preventDefault();

        alert("Notification preferences saved.");
    });

}

const backupBtn = document.getElementById("backupBtn");

if (backupBtn) {

    backupBtn.addEventListener("click", function() {

        alert("Database backup completed successfully.");

    });

}

const restoreBtn = document.getElementById("restoreBtn");

if (restoreBtn) {

    restoreBtn.addEventListener("click", function() {

        if(confirm("Restore the latest backup?")) {

            alert("Backup restored successfully.");

        }

    });

}

const changePasswordBtn = document.getElementById("changePasswordBtn");

if (changePasswordBtn) {

    changePasswordBtn.addEventListener("click", function() {

        const newPassword = prompt("Enter new administrator password:");

        if(newPassword){

            alert("Password changed successfully.");

        }

    });

}

const logoutDevicesBtn = document.getElementById("logoutDevicesBtn");

if (logoutDevicesBtn) {

    logoutDevicesBtn.addEventListener("click", function() {

        if(confirm("Log out all devices?")){

            alert("All devices have been logged out.");

        }

    });

}