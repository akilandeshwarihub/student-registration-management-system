package com.example.studentmanagement.controller;



import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // View all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // Add a new student
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }
    // View student by ID
@GetMapping("/{id}")
public Student getStudentById(@PathVariable Long id) {
    return studentService.getStudentById(id);
}

// Update student
@PutMapping("/{id}")
public Student updateStudent(@PathVariable Long id, @RequestBody Student student) {

    Student oldStudent = studentService.getStudentById(id);

    if (oldStudent == null) {
        return null;
    }

    oldStudent.setName(student.getName());
    oldStudent.setAge(student.getAge());
    oldStudent.setGender(student.getGender());
    oldStudent.setPhone(student.getPhone());
    oldStudent.setEmail(student.getEmail());

    return studentService.saveStudent(oldStudent);
}

// Delete student
@DeleteMapping("/{id}")
public void deleteStudent(@PathVariable Long id) {
    studentService.deleteStudent(id);
}

}
