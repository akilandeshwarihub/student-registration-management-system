
let students = [];
let editingId = null;

const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");

// Get all students
function getStudents() {

    fetch("/api/students")
        .then(response => response.json())
        .then(data => {

            students = data;

            displayStudents(students);

            document.getElementById("totalStudents").innerText = students.length;

            document.getElementById("availableSeats").innerText = 100 - students.length;

        });
}

// Display students
function displayStudents(studentList) {

    studentTable.innerHTML = "";

    for (let student of studentList) {

        let row = `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.gender}</td>
                <td>${student.phone}</td>
                <td>${student.email}</td>
                <td>${student.registrationDate || ""}</td>
                <td>
                    <button onclick="editStudent(${student.studentId})">Edit</button>
                    <button onclick="deleteStudent(${student.studentId})">Delete</button>
                </td>
            </tr>
        `;

        studentTable.innerHTML += row;
    }
}

// Add or update student
form.addEventListener("submit", function(event) {

    event.preventDefault();

    let student = {

        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value

    };

    // Check duplicate email
    for (let oldStudent of students) {

        if (oldStudent.email.toLowerCase() === student.email.toLowerCase()
            && oldStudent.studentId !== editingId) {

            alert("Email already exists!");
            return;
        }
    }

    // Check seat availability for new registration
    if (editingId === null && students.length >= 100) {

        alert("No seats available!");
        return;
    }

    let url = "/api/students";
    let method = "POST";

    if (editingId !== null) {

        url = "/api/students/" + editingId;
        method = "PUT";

    }

    fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(student)

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to save student");
        }

        return response.json();

    })
    .then(data => {

        alert("Student saved successfully!");

        form.reset();
        editingId = null;

        getStudents();

    })
    .catch(error => {

        alert(error.message);

    });

});

// Edit student
function editStudent(id) {

    let student = students.find(s => s.studentId === id);

    if (student) {

        document.getElementById("name").value = student.name;
        document.getElementById("age").value = student.age;
        document.getElementById("gender").value = student.gender;
        document.getElementById("phone").value = student.phone;
        document.getElementById("email").value = student.email;

        editingId = id;

    }
}

// Delete student
function deleteStudent(id) {

    if (confirm("Are you sure you want to delete this student?")) {

        fetch("/api/students/" + id, {
            method: "DELETE"
        })
        .then(() => {

            alert("Student deleted successfully!");

            getStudents();

        });

    }
}

// Search students
document.getElementById("search").addEventListener("input", function() {

    let searchValue = this.value.toLowerCase();

    let filteredStudents = students.filter(student =>

        student.name.toLowerCase().includes(searchValue) ||
        student.studentId.toString().includes(searchValue)

    );

    displayStudents(filteredStudents);

});

// Load students when page opens
getStudents();
