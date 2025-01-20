# Radix and Diminished Radix complement

> Radix and Diminished Radix complement in Digital Electronics with Tutorial, Number System, Gray code, Boolean algebra and logic gates, 
Canonical and standard form, Simplification of Boolean function etc.

# Radix and Diminished Radix complement in Digital Electronics - Javatpoint
The mostly used complements are 1's, 2's, 9's, and 10's complement. Apart from these complements, there are many more complements from which mostly peoples are not familiar. For finding the subtraction of the number base system, the complements are used. If **r** is the base of the number system, then there are two types of complements that are possible, i.e., r's and (r-1)'s. We can find the r's complement, and (r-1)'s complement of the number, here r is the radix. The r's complement is also known as **Radix complement** (r-1)'s complement, is known as **Diminished Radix complement**.

If the base of the number is 2, then we can find 1's and 2's complement of the number. Similarly, if the number is the octal number, then we can find 7's and 8's complement of the number.

There is the following formula for finding the r's and (r-1)'s complement:

r' s= complement=(r<sup>n</sup> )<sub>10</sub>\-N  
(r-1)' s complement={(r<sup>n</sup>)<sub>10</sub>\-1}-N

In the above formulas,

*   The n is the number of digits in the number.
*   The N is the given number.
*   The r is the radix or base of the number.

Advantages of r's complement
----------------------------

These are the following advantages of using r's complement:

*   In r's complement, we can further use existing addition circuitry means there is no special circuitry.
*   There is no need to determine whether the minuend and subtrahend are larger or not because the result has the right sign automatically.
*   The negative zeros are eliminated by r's complement.

Let's take some examples to understand how we can calculate the r's and (r-1)'s complement of binary, decimal, octal, and hexadecimal numbers.

**Example 1: (1011000)<sub>2</sub>**

This number has a base of 2, which means it is a binary number. So, for the binary numbers, the value of r is 2, and r-1 is 2-1=1. So, we can calculate the 1's and 2's complement of the number.

1's complement of the number 1011000 is calculated as:

\={(2<sup>7</sup> )<sub>10</sub>\-1}-(1011000)<sub>2</sub>  
\={(128)<sub>10</sub>\-1}-(1011000)<sub>2</sub>  
\={(127)<sub>10</sub>}-(1011000)<sub>2</sub>  
\=1111111<sub>2</sub>\-1011000<sub>2</sub>  
\=0100111

2's complement of the number 1011000 is calculated as:

\=(2<sup>7</sup> )<sub>10</sub>\-(1011000)<sub>2</sub>  
\=(128)<sub>10</sub>\-(1011000)<sub>2</sub>  
\=10000000<sub>2</sub>\-1011000<sub>2</sub>  
\=0101000<sub>2</sub>

**Example 2: (155)<sub>10</sub>**

This number has a base of 10, which means it is a decimal number. So, for the decimal numbers, the value of r is 10, and r-1 is 10-1=9. So, we can calculate the 10's and 9's complement of the number.

9's complement of the number 155 is calculated as:

\={(10<sup>3</sup> )<sub>10</sub>\-1}-(155)<sub>10</sub>  
\=(1000-1)-155  
\=999-155  
\=(844)<sub>10</sub>

10's complement of the number 1011000 is calculated as:

\=(10<sup>3</sup> )<sub>10</sub>\-(155<sub>10</sub>  
\=1000-155  
\=(845)<sub>10</sub>

**Example 3: (172)<sub>8</sub>**

This number has a base of 8, which means it is an octal number. So, for the octal numbers, the value of r is 8, and r-1 is 8-1=7. So, we can calculate the 8's and 7's complement of the number.

7's complement of the number 172 is calculated as:

\={(8<sup>3</sup> )<sub>10</sub>\-1}-(172)<sub>8</sub>  
\=((512)<sub>10</sub>\-1)-(132)<sub>8</sub>  
\=(511)<sub>10</sub>\-(122)<sub>10</sub>  
\=(389)<sub>10</sub>  
\=(605)<sub>8</sub>

8's complement of the number 172 is calculated as:

\=(8<sup>3</sup> )<sub>10</sub>\-(172)<sub>8</sub>  
\=(512)<sub>10</sub>\-172<sub>8</sub>  
\=512<sub>10</sub>\-122<sub>10</sub>  
\=390<sub>10</sub>  
\=606<sub>8</sub>

**Example 4: (F9)<sub>16</sub>**

This number has a base of 16, which means it is a hexadecimal number. So, for the hexadecimal numbers, the value of r is 16, and r-1 is 16-1=15. So, we can calculate the 16's and 15's complement of the number.

15's complement of the number F9 is calculated as:

{(16<sup>2</sup> )<sub>10</sub>\-1}-(F9)<sub>16</sub>  
(256-1)<sub>10</sub>\-F9<sub>16</sub>  
255<sub>10</sub>\-249<sub>10</sub>  
(6)<sub>10</sub>  
(6)<sub>16</sub>

16's complement of the number F9 is calculated as:

{(16<sup>2</sup> )<sub>10</sub> }-(F9)<sub>16</sub>  
256<sub>10</sub>\-249<sub>10</sub>  
(7)<sub>10</sub>  
(7)<sub>16</sub>



---


> Addition and Subtraction using 2's Complement in Digital Electronics with Tutorial, Number System, Gray code, Boolean algebra and logic gates, Canonical and standard form, Simplification of Boolean function etc.

# Addition and Subtraction using 2's Complement in Digital Electronics - Javatpoint
In our previous section, we learned how we could perform arithmetic operations such as addition and subtraction using 1's complement. In this section, we will learn to perform these operations using 2's complement.

Addition using 2's complement
-----------------------------

There are three different cases possible when we add two binary numbers using 2's complement, which is as follows:

**Case 1: Addition of the positive number with a negative number when the positive number has a greater magnitude.**

Initially find the 2's complement of the given negative number. Sum up with the given positive number. If we get the end-around carry 1 then the number will be a positive number and the carry bit will be discarded and remaining bits are the final result.

**Example: 1101 and -1001**

1.  First, find the 2's complement of the negative number 1001. So, for finding 2's complement, change all 0 to 1 and all 1 to 0 or find the 1's complement of the number 1001. The 1's complement of the number 1001 is 0110, and add 1 to the LSB of the result 0110. So the 2's complement of number 1001 is 0110+1=0111
2.  Add both the numbers, i.e., 1101 and 0111;  
    1101+0111=1  0100
3.  By adding both numbers, we get the end-around carry 1. We discard the end-around carry. So, the addition of both numbers is 0100.

**Case 2: Adding of the positive value with a negative value when the negative number has a higher magnitude.**

Initially, add a positive value with the 2's complement value of the negative number. Here, no end-around carry is found. So, we take the 2's complement of the result to get the final result.

#### Note: The resultant is a negative value.

**Example: 1101 and -1110**

1.  First, find the 2's complement of the negative number 1110. So, for finding 2's complement, add 1 to the LSB of its 1's complement value 0001.  
    0001+1=0010
2.  Add both the numbers, i.e., 1101 and 0010;  
    1101+0010= 1111
3.  Find the 2's complement of the result 1110 that is the final result. So, the 2's complement of the result 1110 is 0001, and add a negative sign before the number so that we can identify that it is a negative number.

**Case 3: Addition of two negative numbers**

In this case, first, find the 2's complement of both the negative numbers, and then we will add both these complement numbers. In this case, we will always get the end-around carry, which will be added to the LSB, and forgetting the final result, we will take the2's complement of the result.

#### Note: The resultant is a negative value.

**Example: -1101 and -1110 in five-bit register**





1.  Firstly find the 2's complement of the negative numbers 01101 and 01110. So, for finding 2's complement, we add 1 to the LSB of the 1's complement of these numbers. 2's complement of the number 01110 is 10010, and 01101 is 10011.
2.  We add both the complement numbers, i.e., 10001 and 10010;  
    10010+10011= 1 00101
3.  By adding both numbers, we get the end-around carry 1. This carry is discarded and the final result is the 2.s complement of the result 00101. So, the 2's complement of the result 00101 is 11011, and we add a negative sign before the number so that we can identify that it is a negative number.

Subtraction using 2's complement
--------------------------------

These are the following steps to subtract two binary numbers using 2's complement

*   In the first step, find the 2's complement of the subtrahend.
*   Add the complement number with the minuend.
*   If we get the carry by adding both the numbers, then we discard this carry and the result is positive else take 2's complement of the result which will be negative.

**Example 1:** 10101 - 00111

We take 2's complement of subtrahend 00111, which is 11001. Now, sum them. So,

10101+11001 =1 01110.

In the above result, we get the carry bit 1. So we discard this carry bit and remaining is the final result and a positive number.

**Example 2:** 10101 - 10111

We take 2's complement of subtrahend 10111, which comes out 01001. Now, we add both of the numbers. So,

10101+01001 =11110.

In the above result, we didn't get the carry bit. So calculate the 2's complement of the result, i.e., 00010. It is the negative number and the final answer.


---


> Addition and Subtraction using 1's Complement in Digital Electronics with Tutorial, Number System, Gray code, Boolean algebra and logic gates, Canonical and standard form, Simplification of Boolean function etc.

# Addition and Subtraction using 1's Complement in Digital Electronics - Javatpoint
In our previous section, we learned about different complements such as 1's complement, 2's complement, 9's complement, and 10's complement, etc.. In this section, we will learn to perform the arithmetic operations such as addition and subtraction using 1's complement. We can perform addition and subtraction using 1's, 2's, 9's, and 10's complement.

Addition using 1's complement
-----------------------------

There are three different cases possible when we add two binary numbers which are as follows:

**Case 1: Addition of the positive number with a negative number when the positive number has a greater magnitude.**

Initially, calculate the 1's complement of the given negative number. Sum up with the given positive number. If we get the end-around carry 1, it gets added to the LSB.

**Example: 1101 and -1001**

1.  First, find the 1's complement of the negative number 1001. So, for finding 1's complement, change all 0 to 1 and all 1 to 0. The 1's complement of the number 1001 is 0110.
2.  Now, add both the numbers, i.e., 1101 and 0110;  
    1101+0110=1 0011
3.  By adding both numbers, we get the end-around carry 1. We add this end around carry to the LSB of 0011.  
    0011+1=0100

**Case 2: Adding a positive value with a negative value in case the negative number has a higher magnitude.**

Initially, calculate the 1's complement of the negative value. Sum it with a positive number. In this case, we did not get the end-around carry. So, take the 1's complement of the result to get the final result.

#### Note: The resultant is a negative value.

**Example: 1101 and -1110**

1.  First find the 1's complement of the negative number 1110. So, for finding 1's complement, we change all 0 to 1, and all 1 to 0. 1's complement of the number 1110 is 0001.
2.  Now, add both the numbers, i.e., 1101 and 0001;  
    1101+0001= 1110
3.  Now, find the 1's complement of the result 1110 that is the final result. So, the 1's complement of the result 1110 is 0001, and we add a negative sign before the number so that we can identify that it is a negative number.

**Case 3: Addition of two negative numbers**

In this case, first find the 1's complement of both the negative numbers, and then we add both these complement numbers. In this case, we always get the end-around carry, which get added to the LSB, and for getting the final result, we take the 1's complement of the result.

#### Note: The resultant is a negative value.

**Example: -1101 and -1110 in five-bit register**

1.  Firstly find the 1's complement of the negative numbers 01101 and 01110. So, for finding 1's complement, we change all 0 to 1, and all 1 to 0. 1's complement of the number 01110 is 10001, and 01101 is 10010.
2.  Now, we add both the complement numbers, i.e., 10001 and 10010;  
    10001+10010= 1 00011
3.  By adding both numbers, we get the end-around carry 1. We add this end-around carry to the LSB of 00011.  
    00011+1=00100
4.  Now, find the 1's complement of the result 00100 that is the final answer. So, the 1's complement of the result 00100 is 110111, and add a negative sign before the number so that we can identify that it is a negative number.

Subtraction using 1's complement
--------------------------------

These are the following steps to subtract two binary numbers using 1's complement

*   In the first step, find the 1's complement of the subtrahend.
*   Next, add the complement number with the minuend.
*   If got a carry, add the carry to its LSB. Else take 1's complement of the result which will be negative

#### Note: The subtrahend value always get subtracted from minuend.

**Example 1:** 10101 - 00111

We take 1's complement of subtrahend 00111, which comes out 11000. Now, sum them. So,

10101+11000 =1 01101.

In the above result, we get the carry bit 1, so add this to the LSB of a given result, i.e., 01101+1=01110, which is the answer.

**Example 2:** 10101 - 10111

We take 1's complement of subtrahend 10111, which comes out 01000. Now, add both of the numbers. So,

10101+01000 =11101.

In the above result, we didn't get the carry bit. So calculate the 1's complement of the result, i.e., 00010, which is the negative number and the final answer.

