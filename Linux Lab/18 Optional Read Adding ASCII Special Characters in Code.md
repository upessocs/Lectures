# **Adding ASCII Special Characters in Code**

## **Method 1: Direct Unicode Input**

### **Common Symbols and Their Codes:**

**Check Marks & Ticks:**
- ✓ `U+2713` CHECK MARK
- ✔ `U+2714` HEAVY CHECK MARK  
- ✅ `U+2705` WHITE HEAVY CHECK MARK
- 🗹 `U+1F5F9` BALLOT BOX WITH BALLOT

**Bullets & Dots:**
- • `U+2022` BULLET
- ◦ `U+25E6` WHITE BULLET
- ▪ `U+25AA` BLACK SMALL SQUARE
- ▫ `U+25AB` WHITE SMALL SQUARE
- ⬤ `U+2B24` BLACK LARGE CIRCLE

**Arrows:**
- → `U+2192` RIGHTWARDS ARROW
- ⇒ `U+21D2` RIGHTWARDS DOUBLE ARROW
- ↳ `U+21B3` DOWNWARDS ARROW WITH TIP RIGHTWARDS

**Box Drawing:**
- │ `U+2502` BOX DRAWINGS LIGHT VERTICAL
- ─ `U+2500` BOX DRAWINGS LIGHT HORIZONTAL
- ├ `U+251C` BOX DRAWINGS LIGHT VERTICAL AND RIGHT
- └ `U+2514` BOX DRAWINGS LIGHT UP AND RIGHT

## **Method 2: Keyboard Shortcuts**

### **Windows:**
- **Alt Codes**: Hold `Alt` + type number code
  - ✓ : `Alt` + `10003`
  - • : `Alt` + `0149`
  - → : `Alt` + `26`

### **Linux:**
- **Compose Key**: `Compose` + `+` + `>`
- **Unicode**: `Ctrl` + `Shift` + `U` + `unicode`

### **macOS:**
- **Character Viewer**: `Ctrl` + `Cmd` + `Space`
- **Unicode Hex Input**: Enable in Keyboard settings

## **Method 3: Using Escape Sequences in Code**

### **Bash/Python/Programming:**
```bash
# Using printf with Unicode
printf "\u2713 Task completed\n"
printf "\u2022 List item\n"
printf "\u2192 Next step\n"

# In bash scripts
echo -e "\u2713 Operation successful"
echo -e "\u2022 First item"
echo -e "\u2022 Second item"
```

### **HTML:**
```html
✓ ✓
✔ ✔ 
• •
→ →
```

### **Python:**
```python
print("\u2713 Check mark")
print("\u2022 Bullet point") 
print("\u2192 Arrow")
```

## **Method 4: Copy-Paste from Character Map**

### **Built-in Character Tools:**
- **Windows**: Character Map app
- **macOS**: Character Viewer (`Ctrl+Cmd+Space`)
- **Linux**: Character Map or `gucharmap`

## **Practical Code Examples**

### **Bash Script with Symbols:**
```bash
#!/bin/bash

# Define symbols
CHECK_MARK="\u2713"
BULLET="\u2022"
ARROW="\u2192"

echo -e "${CHECK_MARK} System check completed"
echo -e "${BULLET} Item 1"
echo -e "${BULLET} Item 2" 
echo -e "${ARROW} Proceeding to next step"
```

### **Enhanced Expert System with Symbols:**
```bash
#!/bin/bash

# Define symbols
CHECK="\u2713"
BULLET="\u2022"
ARROW="\u2192"
WARNING="\u26A0"

echo -e "${CHECK} Welcome to Medical Expert System"
echo -e "${BULLET} Fever detection: Active"
echo -e "${BULLET} Cough analysis: Active"
echo -e "${ARROW} Processing your symptoms..."
echo -e "${WARNING} Remember: This is not a substitute for professional medical advice"
```

### **Python Script:**
```python
#!/usr/bin/env python3

# Unicode symbols
CHECK = "\u2713"
BULLET = "\u2022"
ARROW = "\u2192"

print(f"{CHECK} Task completed successfully")
print(f"{BULLET} First item in list")
print(f"{BULLET} Second item in list")
print(f"{ARROW} Moving to next phase")
```

## **Quick Reference - Most Useful Symbols**

| Symbol | Unicode | Use Case |
|--------|---------|----------|
| `✓` | `U+2713` | Success, completion |
| `✔` | `U+2714` | Heavy check mark |
| `•` | `U+2022` | Bullet points |
| `→` | `U+2192` | Navigation, next steps |
| `⚠` | `U+26A0` | Warnings, alerts |
| `ⓘ` | `U+24D8` | Information |
| `✗` | `U+2717` | Failure, errors |
| `…` | `U+2026` | Ellipsis |

## **Pro Tips**

1. **Consistency**: Use the same symbols throughout your application
2. **Accessibility**: Ensure symbols have proper alt text in web applications
3. **Font Support**: Test that your chosen font displays the symbols correctly
4. **Fallbacks**: Have text alternatives for systems that don't support Unicode

> This approach makes your code more visually appealing and easier to understand!
