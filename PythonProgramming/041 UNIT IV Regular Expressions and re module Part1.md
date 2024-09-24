### Regular Expressions in Python (using `re` module)

**Regular expressions** (regex or regexp) are powerful tools used for pattern matching and string manipulation. The Python `re` module provides functions to work with regular expressions efficiently.

#### 1. Introduction to Regular Expressions

Regular expressions are used to search, match, and manipulate text. They consist of patterns that describe sets of strings.

**Example**:
```python
import re

pattern = r"hello"
text = "hello world"
match = re.search(pattern, text)
print("Match found:", match.group() if match else "No match")
```
**Output**:
```
Match found: hello
```

### 2. Simple Character Matches
A simple character match occurs when the pattern exactly matches the string.

**Example**:
```python
pattern = r"cat"
text = "The cat sat on the mat."
match = re.search(pattern, text)
print("Match found:", match.group() if match else "No match")
```
**Explanation**: 
This matches the word "cat" exactly in the text.

#### 3. Special Characters
Special characters in regex are used for complex matching:
- `.` (dot): matches any character except newline
- `^`: matches the beginning of a string
- `$`: matches the end of a string
- `*`: matches 0 or more occurrences
- `+`: matches 1 or more occurrences

**Example**:
```python
pattern = r"c.t"
text = "The cat sat."
match = re.search(pattern, text)
print("Match found:", match.group() if match else "No match")
```
**Output**:
```
Match found: cat
```
**Explanation**: `.` matches any character between `c` and `t`.

#### 4. Character Classes
Character classes specify a set of characters for matching. They are defined with square brackets `[]`.

- `[a-z]`: Matches any lowercase letter
- `[A-Z]`: Matches any uppercase letter
- `[0-9]`: Matches any digit

**Example**:
```python
pattern = r"[a-z]+"
text = "Hello World 123"
matches = re.findall(pattern, text)
print("Matches found:", matches)
```
**Output**:
```
Matches found: ['ello', 'orld']
```
**Explanation**: The pattern `[a-z]+` matches sequences of lowercase letters.

#### 5. Quantifiers
Quantifiers define the number of occurrences to match:
- `{m}`: exactly m occurrences
- `{m,n}`: between m and n occurrences

**Example**:
```python
pattern = r"\d{3}"
text = "My number is 1234567890"
matches = re.findall(pattern, text)
print("Matches found:", matches)
```
**Output**:
```
Matches found: ['123', '456', '789']
```
**Explanation**: `\d{3}` matches sequences of exactly 3 digits.

#### 6. The Dot Character (`.`)
The dot character matches any character except a newline.

**Example**:
```python
pattern = r"h.llo"
text = "hello"
match = re.search(pattern, text)
print("Match found:", match.group() if match else "No match")
```
**Output**:
```
Match found: hello
```

#### 7. Greedy Matches
By default, regex is greedy, meaning it matches the longest possible string. To make it lazy (match as few characters as possible), use `?`.

**Example**:
```python
pattern = r"<.*>"
text = "<tag>content</tag>"
match = re.search(pattern, text)
print("Greedy match:", match.group())

pattern_lazy = r"<.*?>"
match_lazy = re.search(pattern_lazy, text)
print("Lazy match:", match_lazy.group())
```
**Output**:
```
Greedy match: <tag>content</tag>
Lazy match: <tag>
```

#### 8. Grouping
Parentheses `()` are used to group parts of a pattern for extraction or backreference.

**Example**:
```python
pattern = r"(\d{3})-(\d{2})"
text = "Phone number: 123-45"
match = re.search(pattern, text)
print("Area code:", match.group(1))
print("Local code:", match.group(2))
```
**Output**:
```
Area code: 123
Local code: 45
```

#### 9. Matching at Beginning or End
- `^`: Match at the start
- `$`: Match at the end

**Example**:
```python
pattern = r"^Hello"
text = "Hello world"
match = re.search(pattern, text)
print("Match at start:", match.group() if match else "No match")

pattern = r"world$"
match = re.search(pattern, text)
print("Match at end:", match.group() if match else "No match")
```
**Output**:
```
Match at start: Hello
Match at end: world
```

#### 10. Match Objects
The `match` object contains details about the match. Use `.group()` to get matched text, and `.start()` / `.end()` to get positions.

**Example**:
```python
pattern = r"world"
text = "Hello world"
match = re.search(pattern, text)
print("Matched text:", match.group())
print("Start position:", match.start())
print("End position:", match.end())
```

#### 11. Substituting
`re.sub()` replaces parts of the string that match a pattern.

**Example**:
```python
pattern = r"cat"
text = "The cat sat on the mat."
result = re.sub(pattern, "dog", text)
print("After substitution:", result)
```
**Output**:
```
After substitution: The dog sat on the mat.
```

#### 12. Splitting a String
`re.split()` splits a string at each match of the pattern.

**Example**:
```python
pattern = r"\s+"
text = "Split this sentence by spaces"
result = re.split(pattern, text)
print("Split result:", result)
```
**Output**:
```
Split result: ['Split', 'this', 'sentence', 'by', 'spaces']
```

#### 13. Compiling Regular Expressions
You can compile regular expressions for repeated use with `re.compile()`.

**Example**:
```python
pattern = re.compile(r"\d+")
text = "123 apples, 456 bananas"
matches = pattern.findall(text)
print("Matches:", matches)
```
**Output**:
```
Matches: ['123', '456']
```

#### 14. Flags
Flags modify the behavior of regex. Common flags:
- `re.IGNORECASE` or `re.I`: case-insensitive matching
- `re.DOTALL`: makes `.` match newline characters
- `re.MULTILINE`: changes `^` and `$` to match the start/end of lines.

**Example**:
```python
pattern = r"hello"
text = "Hello"
match = re.search(pattern, text, re.IGNORECASE)
print("Case-insensitive match:", match.group() if match else "No match")
```
**Output**:
```
Case-insensitive match: Hello
```

### Summary
- Regular expressions provide powerful tools for matching, searching, and manipulating strings.
- Using the `re` module in Python, we can perform complex string operations with patterns.
- Concepts like character classes, quantifiers, groups, and flags extend the capabilities of regex.

---

### Dummy Text

Test using [regex101.com](https://regex101.com/r/b3PSAj/1)

```
John Doe, 35, lives at 123 Main St., Springfield. His email is john.doe@example.com, and his phone number is (123) 456-7890.
He works for ABC Corp., and his employee ID is EMP-0001. 

His friend, Jane Smith, 29, lives at 456 Oak St., Shelbyville. Her email is jane.smith@workmail.com, and her phone number is 987-654-3210.
Her employee ID is EMP-2003.

They both visited the website https://www.example.org/contact-us last week to submit a form.
The form had an address field, and they typed:
Address: 12b, Parkside Ave, Apt 3C.
```

### Comments and Hints:

1. **Match all names** (capitalized first name followed by capitalized last name):
   - **Hint**: Use the pattern for capitalized words. Example: `[A-Z][a-z]+ [A-Z][a-z]+`.

2. **Extract all ages** (two-digit numbers following a comma):
   - **Hint**: You can look for digits after a comma and a space. Example: `,\s*\d{2}`.

3. **Find all street addresses**:
   - **Hint**: Start with the digits, followed by the street name. Example: `\d+\s+[A-Za-z]+\s+[A-Za-z]+\.`.

4. **Extract all email addresses**:
   - **Hint**: Look for characters before and after `@`. Example: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`.

5. **Find all phone numbers**:
   - **Hint**: Look for patterns with digits and parentheses, or just digits and dashes. Example: `\(\d{3}\)\s*\d{3}-\d{4}` for numbers with area code in parentheses, and `\d{3}-\d{3}-\d{4}` for others.

6. **Extract all employee IDs** (starts with `EMP-` followed by digits):
   - **Hint**: Use a pattern for alphanumeric IDs. Example: `EMP-\d{4}`.

7. **Find all URLs** (starts with `http://` or `https://`):
   - **Hint**: Look for `http` followed by optional `s` and the domain name. Example: `https?://[a-zA-Z0-9./-]+`.

8. **Match all apartment numbers** (can include letters and numbers, like `Apt 3C`):
   - **Hint**: Use a pattern for `Apt` followed by numbers and possibly letters. Example: `Apt\s*\w+`.

9. **Match all multi-word organization names** (like "ABC Corp."):
   - **Hint**: Use capitalized words followed by `.`. Example: `[A-Z][a-z]*\s+[A-Z][a-z]*\.`.

10. **Match all words that start with a capital letter**:
   - **Hint**: Use a pattern that starts with a capital letter. Example: `[A-Z][a-z]+`.

### Test the Text:

You can copy the dummy text above into your code and use the following script to test your regex skills:

```python
import re

# Dummy text
text = """
John Doe, 35, lives at 123 Main St., Springfield. His email is john.doe@example.com, and his phone number is (123) 456-7890.
He works for ABC Corp., and his employee ID is EMP-0001. 

His friend, Jane Smith, 29, lives at 456 Oak St., Shelbyville. Her email is jane.smith@workmail.com, and her phone number is 987-654-3210.
Her employee ID is EMP-2003.

They both visited the website https://www.example.org/contact-us last week to submit a form.
The form had an address field, and they typed:
Address: 12b, Parkside Ave, Apt 3C.
"""

# Test each pattern
pattern = r"[A-Z][a-z]+ [A-Z][a-z]+"  # Example: pattern to match full names
matches = re.findall(pattern, text)
print("Names found:", matches)

# Try other patterns here
```

### Challenge Ideas:
- Try modifying the patterns to match different kinds of names or addresses.
- Combine multiple patterns using `|` (or operator) to match both phone number formats (`(123)` and `123-`).
- Experiment with using flags like `re.IGNORECASE` or `re.MULTILINE` in your searches.
