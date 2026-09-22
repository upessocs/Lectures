// Exp 5: JavaScript arrays, objects, and functions

// 1. Arrays
const fruits = ['Apple', 'Banana', 'Mango'];
console.log('--- Array Demonstration ---');
console.log('Fruits array:', fruits);
fruits.push('Orange');
console.log('After push:', fruits);

// 2. Objects
const student = {
    name: 'John Doe',
    age: 20,
    course: 'Backend Development'
};
console.log('\n--- Object Demonstration ---');
console.log('Student object:', student);
console.log('Student Name:', student.name);

// 3. Functions
function greet(name) {
    return `Hello, ${name}! Welcome to Backend Development Lab.`;
}

console.log('\n--- Function Demonstration ---');
console.log(greet('Student'));
