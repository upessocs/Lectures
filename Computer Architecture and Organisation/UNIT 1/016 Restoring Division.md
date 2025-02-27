### Restoring Division Algorithm for Signed Binary Numbers

Restoring division is a method used to perform division of binary numbers, including signed numbers. The algorithm works by repeatedly subtracting the divisor from the dividend (or the remainder) and restoring the original value if the subtraction results in a negative value. The quotient is built bit by bit, and the remainder is obtained at the end.

---

### Key Concepts:
#### 1. **Signed Binary Numbers**: 
- Negative numbers are represented using **2's complement**.
- The sign bit (most significant bit, MSB) indicates whether the number is positive (0) or negative (1).

#### 2. **Restoring Division Steps**:
- Initialize the remainder register (R) with 0.
- Align the divisor (D) with the most significant bits of the dividend (Q).
- Perform subtraction and shift operations iteratively.
- If the result of subtraction is negative, restore the remainder by adding the divisor back.
- Repeat until all bits of the dividend are processed.

---

### Algorithm Steps:
#### 1. **Initialization**:
- Load the dividend (Q) into the quotient register.
- Load the divisor (D) into the divisor register.
- Initialize the remainder (R) to 0.

#### 2. **Iteration**:
- For each bit in the dividend:
- Shift the remainder (R) and quotient (Q) left by 1 bit.
- Subtract the divisor (D) from the remainder (R).
- If the result is negative:
- Restore the remainder by adding the divisor (D) back.
- Set the least significant bit (LSB) of the quotient (Q) to 0.
- If the result is non-negative:
- Set the LSB of the quotient (Q) to 1.
- Repeat until all bits are processed.

#### 3. **Final Result**:
- The quotient (Q) holds the result of the division.
- The remainder (R) holds the remainder of the division.

---

### Example 1: Positive Dividend and Divisor
**Divide 7 (0111) by 3 (0011)**

| Step | Action                        | Remainder (R) | Quotient (Q) | Divisor (D) | Explanation                                                                 |
|:-----|:------------------------------|:--------------|:-------------|:------------|:----------------------------------------------------------------------------|
| 1    | Initialize                    | 0000          | 0111         | 0011        | R = 0, Q = Dividend (7), D = Divisor (3).                                   |
| 2    | Shift R and Q left            | 0000          | 1110         | 0011        | Shift R and Q left by 1 bit.                                                |
| 3    | Subtract D from R             | 1101 (-3)     | 1110         | 0011        | R = R - D = 0000 - 0011 = 1101 (negative).                                 |
| 4    | Restore R (R = R + D)         | 0000          | 1110         | 0011        | Restore R by adding D back: 1101 + 0011 = 0000.                             |
| 5    | Set LSB of Q to 0             | 0000          | 1110         | 0011        | Since subtraction was negative, set LSB of Q to 0.                          |
| 6    | Shift R and Q left            | 0000          | 1100         | 0011        | Shift R and Q left by 1 bit.                                                |
| 7    | Subtract D from R             | 1101 (-3)     | 1100         | 0011        | R = R - D = 0000 - 0011 = 1101 (negative).                                 |
| 8    | Restore R (R = R + D)         | 0000          | 1100         | 0011        | Restore R by adding D back: 1101 + 0011 = 0000.                             |
| 9    | Set LSB of Q to 0             | 0000          | 1100         | 0011        | Since subtraction was negative, set LSB of Q to 0.                          |
| 10   | Shift R and Q left            | 0000          | 1000         | 0011        | Shift R and Q left by 1 bit.                                                |
| 11   | Subtract D from R             | 1101 (-3)     | 1000         | 0011        | R = R - D = 0000 - 0011 = 1101 (negative).                                 |
| 12   | Restore R (R = R + D)         | 0000          | 1000         | 0011        | Restore R by adding D back: 1101 + 0011 = 0000.                             |
| 13   | Set LSB of Q to 0             | 0000          | 1000         | 0011        | Since subtraction was negative, set LSB of Q to 0.                          |
| 14   | Shift R and Q left            | 0000          | 0000         | 0011        | Shift R and Q left by 1 bit.                                                |
| 15   | Subtract D from R             | 1101 (-3)     | 0000         | 0011        | R = R - D = 0000 - 0011 = 1101 (negative).                                 |
| 16   | Restore R (R = R + D)         | 0000          | 0000         | 0011        | Restore R by adding D back: 1101 + 0011 = 0000.                             |
| 17   | Set LSB of Q to 0             | 0000          | 0000         | 0011        | Since subtraction was negative, set LSB of Q to 0.                          |

**Result**:
- Quotient (Q) = 0000 (0)
- Remainder (R) = 0000 (0)

---

### Example 2: Negative Dividend and Positive Divisor
**Divide -6 (1010) by 3 (0011)**

| Step | Action                        | Remainder (R) | Quotient (Q) | Divisor (D) | Explanation                                                                 |
|:-----|:------------------------------|:--------------|:-------------|:------------|:----------------------------------------------------------------------------|
| 1    | Initialize                    | 0000          | 1010         | 0011        | R = 0, Q = Dividend (-6 in 2's complement), D = Divisor (3).                |
| 2    | Shift R and Q left            | 0000          | 0100         | 0011        | Shift R and Q left by 1 bit.                                                |
| 3    | Subtract D from R             | 1101 (-3)     | 0100         | 0011        | R = R - D = 0000 - 0011 = 1101 (negative).                                 |
| 4    | Restore R (R = R + D)         | 0000          | 0100         | 0011        | Restore R by adding D back: 1101 + 0011 = 0000.                             |
| 5    | Set LSB of Q to 0             | 0000          | 0100         | 0011        | Since subtraction was negative, set LSB of Q to 0.                          |
| 6    | Shift R and Q left            | 0000          | 1000         | 0011        | Shift R and Q left by 1 bit.                                                |
| 7    | Subtract D from R             | 1101 (-3)     | 1000         | 0011        | R = R - D = 0000 - 0011 = 1101 (negative).                                 |
| 8    | Restore R (R = R + D)         | 0000          | 1000         | 0011        | Restore R by adding D back: 1101 + 0011 = 0000.                             |
| 9    | Set LSB of Q to 0             | 0000          | 1000         | 0011        | Since subtraction was negative, set LSB of Q to 0.                          |
| 10   | Shift R and Q left            | 0000          | 0000         | 0011        | Shift R and Q left by 1 bit.                                                |
| 11   | Subtract D from R             | 1101 (-3)     | 0000         | 0011        | R = R - D = 0000 - 0011 = 1101 (negative).                                 |
| 12   | Restore R (R = R + D)         | 0000          | 0000         | 0011        | Restore R by adding D back: 1101 + 0011 = 0000.                             |
| 13   | Set LSB of Q to 0             | 0000          | 0000         | 0011        | Since subtraction was negative, set LSB of Q to 0.                          |

**Result**:
- Quotient (Q) = 0000 (0)
- Remainder (R) = 0000 (0)

---

### Notes:
- The restoring division algorithm works for both positive and negative numbers.
- The sign of the quotient and remainder depends on the signs of the dividend and divisor.
- In the examples above, the results are simplified for clarity. In practice, additional steps are needed to handle the sign bits correctly.