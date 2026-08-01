document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();
    initializeNotifications();
    initializeStudentDashboard();
    initializeFacilityFilters();

    initializeEquipment();      // <-- ADD THIS
    initializeEquipmentSearch();

    loadStudentProfile();

});

function initializeSidebar() {

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (!sidebar || !sidebarToggle) return;

    sidebarToggle.addEventListener("click", () => {

        sidebar.classList.toggle("collapsed");

    });

}

function initializeNotifications() {

    const notificationBtn = document.getElementById("notifBell");

    if (!notificationBtn) return;

    notificationBtn.addEventListener("click", () => {

        window.location.href = "notifications.html";

    });

}


function initializeStudentDashboard() {

    displayStudentName();
    highlightPendingRequests();
    initializeQuickActions();

}

function displayStudentName() {

    const username =
        localStorage.getItem("studentName") || "Student";

    const topbarName = document.getElementById("topbarUsername");
    const welcomeName = document.getElementById("welcomeUsername");

    if (topbarName) {

        topbarName.textContent = username;

    }

    if (welcomeName) {

        welcomeName.textContent = username;

    }

}

function highlightPendingRequests() {

    const pendingStatuses =
        document.querySelectorAll(".status-pill--pending");

    pendingStatuses.forEach(status => {

        status.style.cursor = "pointer";

        status.addEventListener("click", () => {

            alert("This request is still awaiting approval.");

        });

    });

}

function initializeQuickActions() {

    const bookFacility =
        document.querySelector('a[href="facilities.html"]');

    const equipment =
        document.querySelector('a[href="equipment.html"]');

    if (bookFacility) {

        bookFacility.addEventListener("click", () => {

            console.log("Opening Facility Booking...");

        });

    }

    if (equipment) {

        equipment.addEventListener("click", () => {

            console.log("Opening Equipment Page...");

        });

    }

}

const facilityLocations = {

    "Football Pitch": [
        "Ground A",
        "Ground B",
        "Ground C (Under Maintenance)"
    ],

    "Basketball Court": [
        "Court A",
        "Court B"
    ],

    "Tennis Court": [
        "Court 1",
        "Court 2"
    ],

    "Volleyball Court": [
        "Court A",
        "Court B"
    ],

    "Rugby Field": [
        "Field A",
        "Field B"
    ],

    "Gymnasium": [
        "Main Gym",
        "Fitness Gym"
    ]

};
const bookingModal = document.getElementById("bookingModal");

const facilityTitle = document.getElementById("facilityTitle");

const facilityLocation = document.getElementById("facilityLocation");

const closeBookingModal = document.getElementById("closeBookingModal");

const bookingButtons =
document.querySelectorAll(".book-facility-btn");

bookingButtons.forEach(button => {

    button.addEventListener("click", function(){

        const facility =
        this.dataset.facility;

        facilityTitle.textContent =
        "Book " + facility;

        facilityLocation.innerHTML = "";

        facilityLocations[facility].forEach(location => {

            const option =
            document.createElement("option");

            option.value = location;

            option.textContent = location;

            if(location.includes("Maintenance")){

                option.disabled = true;

            }

            facilityLocation.appendChild(option);

        });

        bookingModal.style.display = "flex";

    });

});

closeBookingModal.addEventListener("click", function(){

    bookingModal.style.display = "none";

});

window.addEventListener("click", function(e){

    if(e.target === bookingModal){

        bookingModal.style.display = "none";

    }

});

document.getElementById("bookingForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    const facility = facilityTitle.textContent;
    const location = facilityLocation.value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;

    const notifications =
        JSON.parse(localStorage.getItem("studentNotifications")) || [];

    notifications.unshift({
        message: `${facility} at ${location} has been submitted successfully.`,
        date: `${date} ${time}`
    });

    localStorage.setItem(
        "studentNotifications",
        JSON.stringify(notifications)
    );

    alert("Booking submitted successfully!");

    bookingModal.style.display = "none";

});

function initializeFacilityFilters() {

    const search =
        document.getElementById("facilitySearch");

    const buttons =
        document.querySelectorAll(".filter-btn");

    const cards =
        document.querySelectorAll(".facility-card");

    // Category Buttons
    buttons.forEach(button => {

        button.addEventListener("click", function () {

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            this.classList.add("active");

            const filter =
                this.dataset.filter;

            cards.forEach(card => {

                if (
                    filter === "all" ||
                    card.dataset.category === filter
                ) {

                    card.style.display = "block";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });

    // Search Bar
    if (search) {

        search.addEventListener("keyup", function () {

            const value =
                this.value.toLowerCase();

            cards.forEach(card => {

                const title =
                    card.querySelector("h3")
                        .textContent
                        .toLowerCase();

                if (title.includes(value)) {

                    card.style.display = "block";

                } else {

                    card.style.display = "none";

                }

            });

        });

    }

}
function initializeEquipment(){

    const loanModal =
    document.getElementById("loanModal");

    if(!loanModal) return;

    const requestButtons =
    document.querySelectorAll("[data-equipment]");

    const loanEquipmentField =
    document.getElementById("loanEquipmentField");

    const modalEquipmentName =
    document.getElementById("modalEquipmentName");

    const racketSection =
    document.getElementById("racketOptions");

    const jerseySection =
    document.getElementById("jerseyOptions");

    const sizeSection =
    document.getElementById("sizeSection");

    requestButtons.forEach(button=>{

        button.addEventListener("click",function(){

            const equipment =
            this.dataset.equipment;

            loanEquipmentField.value =
            equipment;

            modalEquipmentName.textContent =
            equipment;

            racketSection.style.display="none";
            jerseySection.style.display="none";
            sizeSection.style.display="none";

            if(equipment==="Rackets"){

                racketSection.style.display="block";

            }

            if(equipment==="Team Jerseys"){

                jerseySection.style.display="block";
                sizeSection.style.display="block";

            }

            loanModal.style.display="flex";

        });

    });

}

const loanForm =
document.getElementById("loanForm");

if(loanForm){

loanForm.addEventListener("submit",function(e){

    e.preventDefault();

    if(document.getElementById("sizeSection").style.display==="block"){

        const quantity =
        parseInt(document.getElementById("loanQuantity").value)||0;

        const totalSizes =
        (parseInt(document.getElementById("sizeS").value)||0)+
        (parseInt(document.getElementById("sizeM").value)||0)+
        (parseInt(document.getElementById("sizeL").value)||0)+
        (parseInt(document.getElementById("sizeXL").value)||0)+
        (parseInt(document.getElementById("sizeXXL").value)||0);

        if(quantity!==totalSizes){

            alert("The total jersey sizes must equal the quantity requested.");

            return;

        }

    }
    // Save notification
        const equipment =
            document.getElementById("loanEquipmentField").value;

        const quantity =
            document.getElementById("loanQuantity").value;

        const notifications =
            JSON.parse(localStorage.getItem("studentNotifications")) || [];

        notifications.unshift({
            message: `Your request for ${quantity} ${equipment} has been submitted and is awaiting approval.`,
            date: new Date().toLocaleString()
        });

        localStorage.setItem(
            "studentNotifications",
            JSON.stringify(notifications)
        );


    alert("Equipment request submitted successfully!");

    document.getElementById("loanModal").style.display="none";

    this.reset();

});

}

function initializeEquipmentSearch() {

    const searchInput = document.getElementById("equipmentSearch");

    if (!searchInput) return;

    const cards = document.querySelectorAll("#equipmentGrid .facility-card");

    searchInput.addEventListener("keyup", function () {

        const searchText = this.value.toLowerCase();

        cards.forEach(card => {

            const title = card.querySelector("h3").textContent.toLowerCase();

            if (title.includes(searchText)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

}
//

function loadStudentProfile(){

    const student =
    JSON.parse(localStorage.getItem("currentStudent"));


    if(!student) return;


    // Topbar name
    const topbarUsername =
    document.querySelector(".topbar-username");


    if(topbarUsername){

        topbarUsername.textContent =
        student.firstName + " " + student.lastName;

    }


    // Profile name
    const profileName =
    document.querySelector(".profile-summary-card h2");


    if(profileName){

        profileName.textContent =
        student.firstName + " " + student.lastName;

    }


    // Profile information
    const profileInfo =
    document.querySelectorAll(".profile-quick-info li");


    if(profileInfo.length >= 3){

        profileInfo[0].innerHTML =
        `<i class="fa-solid fa-id-card"></i> ${student.admissionNumber}`;


        profileInfo[1].innerHTML =
        `<i class="fa-solid fa-envelope"></i> ${student.email}`;


        profileInfo[2].innerHTML =
        `<i class="fa-solid fa-phone"></i> ${student.phone}`;

    }


    // Form values

    const nameInput =
    document.querySelector('input[name="fullName"]');

    const admissionInput =
    document.querySelector('input[name="admissionNumber"]');

    const emailInput =
    document.querySelector('input[name="email"]');

    const phoneInput =
    document.querySelector('input[name="phone"]');


    if(nameInput)
        nameInput.value =
        student.firstName+" "+student.lastName;


    if(admissionInput)
        admissionInput.value =
        student.admissionNumber;


    if(emailInput)
        emailInput.value =
        student.email;


    if(phoneInput)
        phoneInput.value =
        student.phone;

}