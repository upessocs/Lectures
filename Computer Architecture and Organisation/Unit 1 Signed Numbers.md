# Signed and Unsigned Binary Numbers

> Signed and Unsigned Binary Numbers in Digital Electronics with Tutorial, Number System, Gray code, Boolean algebra and logic gates, Canonical and standard form, Simplification of Boolean function etc.


The integer variables are represented in a signed and unsigned manner. The positive and negative values are differentiated by using the sign flag in signed numbers. The unsigned numbers do not use any flag for the sign, i.e., only positive numbers can be stored by the unsigned numbers.

It is very easy to represent positive and negative numbers in our day to day life. We represent the positive numbers without adding any sign before them and the negative number with - (minus) sign before them. But in the digital system, it is not possible to use negative sign before them because the data is in binary form in digital computers. For representing the sign in binary numbers, we require a special notation.

Binary Numbers Representation
-----------------------------

Our computer can understand only (0, 1) language. The binary numbers are represented in both ways, i.e., signed and unsigned. The positive numbers are represented in both ways- signed and unsigned, but the negative numbers can only be described in a signed way. The difference between unsigned and signed numbers is that unsigned numbers do not use any sign bit for positive and negative numbers identification, but the signed number used.

![Signed and Unsigned Binary Numbers](Signed%20and%20Unsigned%20Binary%20Numbers%20in%20Digital%20Electronics%20-%20Javatpoint/signed-and-unsigned-binary-numbers-in-digital-electronics.png)

### Unsigned Numbers

As we already know, the unsigned numbers don't have any sign for representing negative numbers. So the unsigned numbers are always positive. By default, the decimal number representation is positive. We always assume a positive sign in front of each decimal digit.

There is no sign bit in unsigned binary numbers so it can only represent its magnitude. In zero and one, zero is an unsigned binary number. There is only one zero (0) in this representation, which is always positive. Because of one unique binary equivalent form of a number in unsigned number representation, it is known as unambiguous representation technique. The range of the unsigned binary numbers starts from 0 to (2<sup>n</sup>\-1).

**Example:** Represent the decimal number 102 in unsigned binary numbers.

We will change this decimal number into binary, which has the only magnitude of the given name.

| Decimal | Operation | Result | Remainder |
| --- | --- | --- | --- |
| 102 | 102/2 | 51 | 0 |
| 51 | 51/2 | 25 | 1 |
| 25 | 25/2 | 12 | 1 |
| 12 | 12/2 | 6 | 0 |
| 6 | 6/2 | 3 | 0 |
| 3 | 3/2 | 1 | 1 |
| 1 | 1/2 | 0 | 1 |

So the binary number of (102)<sub>10</sub> is (1100110)<sub>2</sub>, a 7-bit magnitude of the decimal number 102.

### Signed Numbers

The signed numbers have a sign bit so that it can differentiate positive and negative integer numbers. The signed binary number technique has both the sign bit and the magnitude of the number. For representing the negative decimal number, the corresponding symbol in front of the binary number will be added.

The signed numbers are represented in three ways. The signed bit makes two possible representations of zero (positive (0) and negative (1)), which is an ambiguous representation. The third representation is 2's complement representation in which no double representation of zero is possible, which makes it unambiguous representation. There are the following types of representation of signed binary numbers:

1.  **Sign-Magnitude form**  
    In this form, a binary number has a bit for a sign symbol. If this bit is set to 1, the number will be negative else the number will be positive if it is set to 0. Apart from this sign-bit, the n-1 bits represent the magnitude of the number.
2.  **1's Complement**  
    By inverting each bit of a number, we can obtain the 1's complement of a number. The negative numbers can be represented in the form of 1's complement. In this form, the binary number also has an extra bit for sign representation as a sign-magnitude form.
3.  **2's Complement**  
    By inverting each bit of a number and adding plus 1 to its least significant bit, we can obtain the 2's complement of a number. The negative numbers can also be represented in the form of 2's complement. In this form, the binary number also has an extra bit for sign representation as a sign-magnitude form.
