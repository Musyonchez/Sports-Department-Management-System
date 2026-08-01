//REGISTRATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const admissionNumber = document.getElementById("admissionNumber").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const school = document.getElementById("school").value;
        const course = document.getElementById("course").value.trim();
        const year = document.getElementById("year").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Password validation
        if (password !== confirmPassword) {

            alert("Passwords do not match.");
            return;

        }

        // Create student object
        const student = {

            firstName,
            lastName,
            admissionNumber,
            email,
            phone,
            school,
            course,
            year,
            password,
            role: "student"

        };

        // Get existing students
        let students = JSON.parse(localStorage.getItem("students")) || [];

        // Check if email already exists
        const exists = students.find(user => user.email === email);

        if (exists) {

            alert("An account with this email already exists.");
            return;

        }

        // Save student
        students.push(student);

        localStorage.setItem("students", JSON.stringify(students));

        alert("Registration successful! Please login.");

        registerForm.reset();

        window.location.href = "login.html";

    });

}
// Part 2 - Login

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value;

        if (email === "" || password === "") {
            alert("Please enter your email and password.");
            return;
        }

        if (role === "") {
            alert("Please select your role.");
            return;
        }


        if (role === "student") {

    let students =
    JSON.parse(localStorage.getItem("students")) || [];

    const student = students.find(user =>
        user.email === email &&
        user.password === password
    );
    if(!student){

        alert("Invalid email or password.");
        return;
    }

    localStorage.setItem(
        "currentStudent",
        JSON.stringify(student)
    );
    localStorage.setItem(
        "userRole",
        "student"
    );
    alert("Student Login Successful");
    window.location.href="studentdashboard.html";

}

        else if (role === "officer") {
            localStorage.setItem("userRole", role);

            alert("Sports Officer Login Successful");
            window.location.href = "officer-dashboard.html";

        }

        else if (role === "admin") {
            localStorage.setItem("userRole", role);

            alert("Administrator Login Successful");
            window.location.href = "admin-dashboard.html";

        }

    });

}
// HIDE PASSWORD

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (passwordInput && togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");

        } else {

            passwordInput.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");

        }

    });

}


// remeber me

const rememberMe = document.getElementById("rememberMe");

if (loginForm) {

    const savedEmail = localStorage.getItem("rememberedEmail");

    if (savedEmail) {

        email.value = savedEmail;

        if (rememberMe) {
            rememberMe.checked = true;
        }

    }

    loginForm.addEventListener("submit", function () {

        if (rememberMe && rememberMe.checked) {

            localStorage.setItem(
                "rememberedEmail",
                email.value
            );

        } else {

            localStorage.removeItem("rememberedEmail");

        }

        // Save logged in role
        localStorage.setItem("userRole", role.value);

    });

}


const logoutButtons = document.querySelectorAll(".sidebar-link--logout");

logoutButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        localStorage.removeItem("userRole");

        alert("You have been logged out.");

    });

});


const currentPage = window.location.pathname.split("/").pop();

const userRole = localStorage.getItem("userRole");

const studentPages = [
    "studentdashboard.html",
    "booking.html",
    "equipment.html",
    "my-bookings.html",
    "my-loans.html",
    "student-notifications.html",
    "profile.html"
];

const officerPages = [
    "officer-dashboard.html",
    "manage-facilities.html",
    "equipment-inventory.html",
    "booking-requests.html",
    "loan-requests.html",
    "officer-notifications.html",
    "complaints.html",
    "reports.html"
];

const adminPages = [
    "admin-dashboard.html",
    "manage-users.html",
    "assign-roles.html",
    "admin-notifications.html",
    "analytics.html",
    "admin-reports.html",
    "settings.html"
];


//Student Protection

if (studentPages.includes(currentPage) && userRole !== "student") {

    alert("Access denied.");

    window.location.href = "login.html";

}


//Sports Officer Protection

if (officerPages.includes(currentPage) && userRole !== "officer") {

    alert("Access denied.");

    window.location.href = "login.html";

}


//Administrator Protection

if (adminPages.includes(currentPage) && userRole !== "admin") {

    alert("Access denied.");

    window.location.href = "login.html";

}
