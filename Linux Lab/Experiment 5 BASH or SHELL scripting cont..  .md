

# Experiment 5: Shell Programming

### **Theory Concepts**

1. **Command Line Arguments**

   * Run with arguments:

     ```bash
     ./script.sh 10
     ```

     Inside script:

     ```bash
     echo "First argument is $1"
     echo "Total arguments: $#"
     echo "All arguments: $@"
     ```

2. **Arrays in Bash**

   ```bash
   arr=(10 20 30 40)
   echo "First: ${arr[0]}"
   echo "All: ${arr[@]}"
   ```

3. **Conditional Statements**

   * Already seen with `if`
   * We also have `elif` and `case`.

---

### **Lab Tasks**

#### i. Prime Number Check

```bash
#!/bin/bash
echo "Enter a number: "
read num
flag=0

for ((i=2; i<=num/2; i++))
do
    if [ $((num % i)) -eq 0 ]
    then
        flag=1
        break
    fi
done

if [ $flag -eq 0 ]
then
    echo "$num is a prime number."
else
    echo "$num is not a prime number."
fi
```

#### ii. Sum of Digits

```bash
#!/bin/bash
echo "Enter a number: "
read num
sum=0

while [ $num -gt 0 ]
do
    digit=$((num % 10))
    sum=$((sum + digit))
    num=$((num / 10))
done

echo "Sum of digits: $sum"
```

#### iii. Armstrong Number

(An Armstrong number of n digits is a number equal to the sum of its digits raised to the power n. Example: 153 = 1³ + 5³ + 3³)

```bash
#!/bin/bash
echo "Enter a number: "
read num
temp=$num
n=${#num}   # number of digits
sum=0

while [ $temp -gt 0 ]
do
    digit=$((temp % 10))
    sum=$((sum + digit**n))
    temp=$((temp / 10))
done

if [ $sum -eq $num ]
then
    echo "$num is an Armstrong number."
else
    echo "$num is not an Armstrong number."
fi
```

---

# Summary

1. **Shebang (`#!/bin/bash`)** tells OS which shell to use.
2. **Variables**: user (`name="abc"`) & system (`$HOME`).
3. **Input/Output**: `read`, `echo`.
4. **Arithmetic expansion**: `$((...))`.
5. **Conditionals**: `if-then-else`, operators (`-eq`, `-ge`).
6. **Loops**: `for`, `while`.
7. **Positional Parameters**: `$1`, `$2`, `$#`, `$@`.
8. **Arrays**: `arr=(...)`.
9. **Prime, digit sum, Armstrong** → applications of loops, conditionals, arithmetic.

---

# Tasks to be performed

Great! Let’s turn these into **experimental tasks** with **hints** so you can run them in your terminal like a lab manual. Each task builds on concepts you’ve already learned.


##  Experiment 4 (Basics)

### **Task 1: First Script**

* **Goal:** Write a script that prints *Hello, World!*
* **Hint:** Use `echo`. Start with `#!/bin/bash`.
* **Expected Output:**

  ```
  Hello, World!
  ```

---

### **Task 2: Personalized Greeting**

* **Goal:** Ask the user’s name and greet them.
* **Hint:** Use `read` to capture input. Use `$variable` inside `echo`.
* **Expected Output (if input = Rahul):**

  ```
  Enter your name: Rahul
  Hello, Rahul! Welcome to Shell Scripting.
  ```

---

### **Task 3: Arithmetic Operations**

* **Goal:** Take 2 numbers as input and print sum, difference, product, and quotient.
* **Hint:** Use `$(())` for arithmetic.
* **Test Case:** Input `12` and `4`.
* **Expected Output:**

  ```
  Addition: 16
  Subtraction: 8
  Multiplication: 48
  Division: 3
  ```

---

### **Task 4: Voting Eligibility**

* **Goal:** Input age → check if eligible to vote.
* **Hint:** Use `if [ $age -ge 18 ]`.
* **Test Cases:**

  * Input: 20 → Output: *Eligible to vote*
  * Input: 15 → Output: *Not eligible*

---

##  Experiment 5 (Decision Making)

### **Task 5: Prime Number Check**

* **Goal:** Input number → check if prime.
* **Hint:** Loop from 2 to `num/2`, check divisibility using `%`.
* **Test Cases:**

  * Input: 7 → *Prime*
  * Input: 10 → *Not Prime*

---

### **Task 6: Sum of Digits**

* **Goal:** Input a number, calculate sum of digits.
* **Hint:** Use `% 10` to extract last digit, `/ 10` to reduce number.
* **Test Case:**

  * Input: 1234 → Output: 10

---

### **Task 7: Armstrong Number Check**

* **Goal:** Check if number is Armstrong.
* **Hint:** Use `digit**n` where `n` = number of digits (`${#num}`).
* **Test Cases:**

  * Input: 153 → Output: *Armstrong*
  * Input: 123 → Output: *Not Armstrong*

---

# Evaluation Hints

When practicing, try these variations to test yourself:

1. **Change Inputs**

   * For voting script, test with edge case `18`.
   * For prime script, test with `2` and `1`.
   * For Armstrong, test with `9474`.

2. **Predict Before Running**

   * Write down expected output before executing.
   * Compare result to check understanding.

3. **Modify Scripts**

   * Add `elif` conditions in voting script:

     * `<10` → "Too young"
     * `10-17` → "Almost there"
   * Change arithmetic script to also calculate remainder `%`.

4. **Use Command Line Arguments**

   * Instead of `read`, try:

     ```bash
     ./script.sh 12 5
     ```

     Inside script, use `$1` and `$2`.

