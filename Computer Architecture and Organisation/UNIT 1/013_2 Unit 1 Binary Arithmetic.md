In **4-bit signed binary representation**, numbers can represent values from **-8 to +7**. Negative numbers are stored using their **2's complement representation**. Here's how to work with 2's complement:

### Steps to Represent Numbers in 4-bit Signed Binary:
1. **Positive numbers** are written directly in binary.
2. **Negative numbers** are represented by:
- Writing the positive binary equivalent.
- Taking the 1's complement (invert the bits).
- Adding 1 to the least significant bit (LSB).

### Rules for Arithmetic in 2's Complement:
1. Perform binary addition normally, including the carry bit.
2. Ignore any overflow beyond 4 bits.
3. The result remains in 2's complement form.

---

### Case Examples for **Addition**:
#### 1. $ 2 + (-2) $
- $ 2 $ in 4-bit binary: $ 0010 $
- $ -2 $: Take 2's complement of $ 0010 $:
- 1's complement: $ 1101 $
- Add 1: $ 1110 $ (this is $ -2 $).

Add $ 2 $ and $ -2 $:
```
    0010
+   1110
. . . . . .
    0000  

```
> (Carry ignored)
Result: $ 0 $ (correct).

---

#### 2. $ 7 + (-7) $
- $ 7 $ in 4-bit binary: $ 0111 $
- $ -7 $: Take 2's complement of $ 0111 $:
- 1's complement: $ 1000 $
- Add 1: $ 1001 $ (this is $ -7 $).

Add $ 7 $ and $ -7 $:
```
    0111
+   1001
. . . . . .
    0000  

```
> (Carry ignored)
Result: $ 0 $ (correct).

---

#### 3. $ -2 + (-2) $
- $ -2 $: $ 1110 $ (from above).

Add $ -2 $ and $ -2 $:
```
    1110
+   1110
. . . . . .
    1100 

```
> (Ignore overflow; result remains in 4 bits)
Result: $ -4 $ (correct, since $ 1100 $ is $ -4 $).

---

#### 4. $ 2 + 7 $
- $ 2 $: $ 0010 $
- $ 7 $: $ 0111 $.

Add $ 2 $ and $ 7 $:
```
    0010
+   0111
. . . . . .
    1001

```
Result: $ -7 $ (overflow occurred; in signed 4-bit representation, $ 1001 $ is $ -7 $).

---

#### 5. $ -7 + (-2) $
- $ -7 $: $ 1001 $
- $ -2 $: $ 1110 $.

Add $ -7 $ and $ -2 $:
```
    1001
+   1110
. . . . . .
    0111  

```

> (Overflow ignored; result is valid 4-bit signed binary)
Result: $ 7 $ (incorrect due to overflow; arithmetic rules should flag this error).

---

### Summary of Results:
| Expression    | Binary Addition | Result in Decimal |
|---------------|-----------------|-------------------|
| $ 2 + (-2) $ | $ 0010 + 1110 $ | $ 0 $           |
| $ 7 + (-7) $ | $ 0111 + 1001 $ | $ 0 $           |
| $ -2 + (-2) $| $ 1110 + 1110 $ | $ -4 $          |
| $ 2 + 7 $    | $ 0010 + 0111 $ | $ -7 $ (Overflow)|
| $ -7 + (-2) $| $ 1001 + 1110 $ | $ 7 $ (Overflow)|

Overflow occurs when the result is outside the range $ -8 $ to $ 7 $.