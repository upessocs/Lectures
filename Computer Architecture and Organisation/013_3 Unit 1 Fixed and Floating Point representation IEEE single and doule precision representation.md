### **Fixed-Point and Floating-Point Representation**

#### **1. Fixed-Point Representation**
In fixed-point representation, a number is represented with a fixed number of digits before and after the decimal (or binary) point. This representation is useful when precision is required but with limited range.

- **Example (Binary Fixed-Point Representation)**
- Suppose we use 8 bits with 4 bits for the integer part and 4 bits for the fractional part.
- The number **1101.1010** (binary) can be converted to decimal:
- \( 1101_2 = 13_{10} \) (integer part)
- \( .1010_2 = 0.625_{10} \) (fractional part)
- So, the value is **13.625 in decimal**.

#### **2. Floating-Point Representation**
Floating-point representation stores numbers in scientific notation, which provides a wider range but with some loss of precision. It consists of:
- **Sign bit**: 1 bit (0 for positive, 1 for negative)
- **Exponent**: A certain number of bits representing the exponent (with a bias)
- **Mantissa (Significand)**: The fractional part (normalized)

- **Example (Floating-Point Representation)**
- The decimal number **13.625** can be represented as:
- **Normalized binary**: \( 1.101101 \times 2^3 \)
- **Sign bit**: 0 (positive)
- **Exponent**: \( 3 \) (stored with a bias)
- **Mantissa**: 101101 (without the leading 1)

---

### **Concept of Bias in Floating-Point Representation**
The exponent in floating-point numbers is stored using a bias to allow representation of both positive and negative exponents.

- **Bias = \( 2^{(E_{\text{bits}} - 1)} - 1 \)**, where \( E_{\text{bits}} \) is the number of exponent bits.
- For **IEEE 754 single-precision (8-bit exponent)**:
- Bias = \( 2^{(8-1)} - 1 = 127 \).
- Actual exponent \( E_{\text{actual}} = E_{\text{stored}} - 127 \).
- For **IEEE 754 double-precision (11-bit exponent)**:
- Bias = \( 2^{(11-1)} - 1 = 1023 \).
- Actual exponent \( E_{\text{actual}} = E_{\text{stored}} - 1023 \).

Example:
- If the stored exponent in single precision is 130:
- Actual exponent = \( 130 - 127 = 3 \).

---

### **IEEE 754 Floating-Point Formats**
IEEE 754 defines standards for floating-point representation.

#### **1. IEEE 754 Single-Precision (32-bit)**
| Sign (1 bit) | Exponent (8 bits) | Mantissa (23 bits) |
|-------------|------------------|-------------------|
| 1 bit | Biased exponent | Fractional part of normalized number |

- **Formula**:  
\[
(-1)^{\text{sign}} \times 1.\text{mantissa} \times 2^{\text{exponent} - 127}
\]

- **Example** (Representing \( 13.625 \)):
1. Convert **13.625** to binary: \( 1101.101 \).
2. Normalize: \( 1.101101 \times 2^3 \).
3. Store:
- **Sign bit**: 0 (positive)
- **Exponent**: \( 3 + 127 = 130 \) → **10000010**
- **Mantissa**: **10110100000000000000000** (after dropping leading 1)

**Final representation**:  
```
0 | 10000010 | 10110100000000000000000
```
(In hexadecimal: **0x415A0000**)

#### **2. IEEE 754 Double-Precision (64-bit)**
| Sign (1 bit) | Exponent (11 bits) | Mantissa (52 bits) |
|-------------|------------------|-------------------|
| 1 bit | Biased exponent | Fractional part of normalized number |

- **Formula**:
\[
(-1)^{\text{sign}} \times 1.\text{mantissa} \times 2^{\text{exponent} - 1023}
\]

- This allows a **higher precision** and a **wider range** than single precision.

---

### **Arithmetic Operations in IEEE 754 Single-Precision**
#### **1. Addition Example**
Consider adding **5.5 (101.1 in binary) + 2.75 (10.11 in binary)**.

1. **Convert to IEEE 754 Single-Precision**:
- **5.5** → \( 1.011 \times 2^2 \) → Sign = 0, Exponent = 129, Mantissa = 01100000000000000000000
- **2.75** → \( 1.011 \times 2^1 \) → Sign = 0, Exponent = 128, Mantissa = 01100000000000000000000

2. **Align Exponents**:
- Convert 2.75’s exponent to match 5.5 (shift mantissa right):  
    \( 1.011 \times 2^1 = 0.1011 \times 2^2 \).

3. **Add Mantissas**:
- \( 1.011000 + 0.101100 = 10.000100 \).

4. **Normalize Result**:
- \( 10.000100 \times 2^2 \) → \( 1.000010 \times 2^3 \).
- Exponent updated: \( 3 + 127 = 130 \).
- Mantissa: **00001000000000000000000**.

5. **Final Representation**:  
```
0 | 10000010 | 00001000000000000000000
```
(Decimal: **8.25**)

#### **2. Multiplication Example**
Multiply **3.5 (11.1 in binary) × 2.0 (10.0 in binary)**.

1. Convert to IEEE 754:
- **3.5** → \( 1.11 \times 2^1 \) → Exponent = 128
- **2.0** → \( 1.0 \times 2^1 \) → Exponent = 128

2. **Multiply Mantissas**:
- \( (1.11) \times (1.0) = 1.11 \).

3. **Add Exponents**:
- \( 1 + 1 = 2 \), so the new exponent is \( 2 + 127 = 129 \).

4. **Final Representation**:
```
0 | 10000001 | 11000000000000000000000
```
(Decimal: **7.0**)

---

### **Conclusion**
- **Fixed-point** representation provides precision but limited range.
- **Floating-point** (IEEE 754) offers a wider range using sign, exponent (biased), and mantissa.
- **Arithmetic operations** in floating-point involve exponent alignment, mantissa calculations, and normalization.
- **Single precision (32-bit)** has 8 exponent bits and 23 mantissa bits, while **double precision (64-bit)** has 11 exponent bits and 52 mantissa bits.
