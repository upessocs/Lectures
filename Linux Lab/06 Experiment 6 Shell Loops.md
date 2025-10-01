# Experiment 6: Shell Programming

## Theory

### 1. Shell Loops

Loops are used to execute a block of code repeatedly.

**For Loop**

```bash
for i in 1 2 3 4 5
do
    echo "Number: $i"
done
```

**While Loop**

```bash
i=1
while [ $i -le 5 ]
do
    echo "Count: $i"
    i=$((i+1))
done
```

**Until Loop**

```bash
i=1
until [ $i -gt 5 ]
do
    echo "Count: $i"
    i=$((i+1))
done
```

The `for` loop iterates over items, `while` runs until the condition becomes false, and `until` runs until the condition becomes true.

---

### 2. Loop Control

* `break`: exit from the loop.
* `continue`: skip current iteration and continue with the next.

Example:

```bash
for i in {1..5}
do
    if [ $i -eq 3 ]; then
        continue
    fi
    echo "Number: $i"
done
```

---

### 3. I/O Redirection

Redirects output, input, or errors.

* `>` : redirect output (overwrite).
* `>>`: append output.
* `<` : redirect input.
* `2>`: redirect errors.

Examples:

```bash
echo "Hello" > file.txt
echo "World" >> file.txt
cat < file.txt
ls /notexist 2> error.log
```

---

### 4. Shell Functions

Functions allow code reuse and modularity.

```bash
greet() {
    echo "Hello $1"
}
greet "User"
```

Here `$1` refers to the first argument passed to the function.

---

### 5. Regular Expressions

Regular expressions are used for pattern matching. They can be used with tools like `grep`.

Example:

```bash
echo "hello123" | grep -E "[a-z]+[0-9]+"
```

This matches strings with letters followed by digits.

---

### 6. Script Debugging and Troubleshooting

* Run script with debugging:

  ```bash
  bash -x script.sh
  ```
* Add manual debug statements:

  ```bash
  echo "Debug: variable=$var"
  ```

---

## Lab Exercises

### i. Palindrome Check

```bash
#!/bin/bash
echo "Enter a number: "
read num
rev=0
temp=$num

while [ $temp -gt 0 ]
do
    digit=$((temp % 10))
    rev=$((rev * 10 + digit))
    temp=$((temp / 10))
done

if [ $num -eq $rev ]
then
    echo "$num is a palindrome."
else
    echo "$num is not a palindrome."
fi
```

Explanation:
Digits are extracted one by one using `% 10`. They are combined in reverse order. The reversed number is compared with the original.

---

### ii. GCD and LCM

```bash
#!/bin/bash
echo "Enter two numbers: "
read a b

x=$a
y=$b
while [ $y -ne 0 ]
do
    temp=$y
    y=$((x % y))
    x=$temp
done
gcd=$x

lcm=$(( (a * b) / gcd ))

echo "GCD: $gcd"
echo "LCM: $lcm"
```

Explanation:
The Euclidean algorithm is used for GCD. LCM is calculated using the formula `(a*b)/GCD`.

---

### iii. Sorting Numbers

```bash
#!/bin/bash
echo "Enter numbers separated by space: "
read -a arr

echo "Ascending Order: "
printf "%s\n" "${arr[@]}" | sort -n

echo "Descending Order: "
printf "%s\n" "${arr[@]}" | sort -nr
```

Explanation:
`read -a` stores input in an array. `sort -n` arranges numbers in ascending order, and `sort -nr` in descending order.

---

## Assignment

1. Write a function to calculate the factorial of a number using a loop.
2. Write a script that reads a filename and counts how many times a given word appears in it.
3. Write a script that generates the first N Fibonacci numbers using a while loop.
4. Write a script that validates whether the entered string is a proper email address using a regular expression.
5. Write a script with an intentional error, run it with `bash -x`, and explain the debug output.

---

## Summary

* Loops: for, while, until.
* Loop control: break, continue.
* I/O redirection: `>`, `>>`, `<`, `2>`.
* Functions allow modular code with arguments.
* Regular expressions help with pattern matching.
* Debugging can be done with `bash -x` or debug messages.
* Lab tasks applied these concepts to palindrome, GCD/LCM, and sorting problems.

