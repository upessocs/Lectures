
# GitHub Pages → PDF using Pandoc (WSL / macOS)

This guide helps you convert your **GitHub Pages lab website** (index + experiment pages) into a **single PDF** for submission.


> This single pdf needs to be uploaded on LMS
---

# 1) Install Dependencies (One-Time Setup)

## WSL / Ubuntu

```bash
sudo apt update
sudo apt install pandoc -y
sudo apt install texlive-xetex texlive-latex-recommended texlive-latex-extra -y
```

## macOS

```bash
brew install pandoc
brew install --cask mactex
```

---

# 2) Simple Script (Edit Details + URLs)

Create a file: `makepdf.sh`

```bash
#!/bin/bash

# ===== STUDENT DETAILS (EDIT THIS) =====
TITLE="DevOps Lab Report"
AUTHOR="Your Name"
SAPID="Your SAP ID"

# ===== URLs (ADD/REMOVE AS NEEDED) =====
URLS=(
  "https://username.github.io/repo/"
  "https://username.github.io/repo/exp1/"
  "https://username.github.io/repo/exp2/"
  "https://username.github.io/repo/exp3/"
)

# ===== GENERATE PDF =====
pandoc "${URLS[@]}" \
  -o output.pdf \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  -V geometry:margin=1in \
  -M title="$TITLE" \
  -M author="$AUTHOR ($SAPID)"

echo "PDF generated: output.pdf"
```

### Run:

```bash
chmod +x makepdf.sh
./makepdf.sh
```

---

# 3) Optional: Try Interactive Script (No Editing Needed)

Create a file: `makepdf_interactive.sh`

```bash
#!/bin/bash

echo "===== PDF Generator ====="

read -p "Enter Title: " TITLE
read -p "Enter Author Name: " AUTHOR
read -p "Enter SAP ID: " SAPID

# Initialize URL array
URLS=()

# Get index page first
read -p "Enter INDEX URL: " INDEX_URL
URLS+=("$INDEX_URL")

echo "Enter experiment URLs (press ENTER without input to finish):"

while true; do
  read -p "Add URL: " URL
  [ -z "$URL" ] && break
  URLS+=("$URL")
done

echo "Generating PDF..."

pandoc "${URLS[@]}" \
  -o output.pdf \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  -V geometry:margin=1in \
  -M title="$TITLE" \
  -M author="$AUTHOR ($SAPID)"

echo "PDF generated: output.pdf"
```

### Run:

```bash
chmod +x makepdf_interactive.sh
./makepdf_interactive.sh
```

---

# Notes

* Put URLs in correct order:

  * First = **index page**
  * Then = experiment pages
* Your GitHub Pages site must be public
* Output file: `output.pdf`
* Submit this PDF


