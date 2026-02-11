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

