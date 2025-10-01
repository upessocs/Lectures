# **Experiment 12: Building a Rule-Based Expert System - Complete Guide**

## **Theory**

### **Process Automation and Job Scheduling**

**cron** - Time-based job scheduler for repetitive tasks
- Edit user crontab with `crontab -e`
- Syntax: `minute hour day month day_of_week command`
- Example: `0 9 * * * /home/user/backup.sh` executes daily at 9 AM

**at** - One-time job scheduling
- Schedule commands to run once at specific time
- Example: `echo "backup.sh" | at 2:00 AM tomorrow`

### **System Administration Scripts**

Automation scripts for routine system management:
- **Backups** - Regular data backup and archiving
- **User Management** - Automated user creation and permission setup
- **Log Monitoring** - Real-time log analysis and alert generation
- **System Health Checks** - Resource monitoring and maintenance

### **Services and Daemons**

System service management using `systemctl`:
- `systemctl start service` - Start a service
- `systemctl stop service` - Stop a service  
- `systemctl status service` - Check service status
- `systemctl enable service` - Enable auto-start at boot
- `systemctl disable service` - Disable auto-start

---

## **Lab Solution**

### **Expert System Script**
```bash
#!/bin/bash
echo "Welcome to the Medical Expert System"
echo "Enter your symptoms (fever, sore_throat, cough, headache, cold, stomach_pain):"
read symptoms

if [[ "$symptoms" == *"fever"* ]]; then
    echo "Recommendation: Take fever reducer medication and rest."
fi
if [[ "$symptoms" == *"sore_throat"* ]]; then
    echo "Recommendation: Gargle with warm saltwater and stay hydrated."
fi
if [[ "$symptoms" == *"cough"* ]]; then
    echo "Recommendation: Drink warm fluids and take cough syrup."
fi
if [[ "$symptoms" == *"headache"* ]]; then
    echo "Recommendation: Rest in a quiet room and consider pain relief medication."
fi
if [[ "$symptoms" == *"cold"* ]]; then
    echo "Recommendation: Get plenty of rest and use decongestants if needed."
fi
if [[ "$symptoms" == *"stomach_pain"* ]]; then
    echo "Recommendation: Avoid solid foods initially and drink clear fluids."
fi

if [[ "$symptoms" != *"fever"* && "$symptoms" != *"sore_throat"* && "$symptoms" != *"cough"* && "$symptoms" != *"headache"* && "$symptoms" != *"cold"* && "$symptoms" != *"stomach_pain"* ]]; then
    echo "General Recommendation: Consult a doctor for accurate diagnosis."
fi
```

---

## **Assignment Solutions**

### **1. Extended Expert System with Additional Symptoms**

```bash
#!/bin/bash
echo "Welcome to the Enhanced Medical Expert System"
echo "Enter your symptoms separated by commas (fever, sore_throat, cough, headache, cold, stomach_pain, fatigue, nausea):"
read symptoms

# Convert to lowercase for case-insensitive matching
symptoms_lower=$(echo "$symptoms" | tr '[:upper:]' '[:lower:]')

echo ""
echo "Medical Recommendations:"
echo "========================="

# Initialize counter for recommendations
recommendation_count=0

if [[ "$symptoms_lower" == *"fever"* ]]; then
    echo " Take fever reducer medication (paracetamol/ibuprofen)"
    echo "  - Monitor temperature every 4 hours"
    echo "  - Stay hydrated with water and electrolytes"
    ((recommendation_count++))
fi

if [[ "$symptoms_lower" == *"sore_throat"* ]]; then
    echo " Gargle with warm saltwater 3 times daily"
    echo "  - Use throat lozenges for temporary relief"
    echo "  - Avoid cold drinks and smoking"
    ((recommendation_count++))
fi

if [[ "$symptoms_lower" == *"cough"* ]]; then
    echo " Drink warm fluids like tea with honey"
    echo "  - Use cough syrup as directed"
    echo "  - Use a humidifier in your room"
    ((recommendation_count++))
fi

if [[ "$symptoms_lower" == *"headache"* ]]; then
    echo " Rest in a dark, quiet room"
    echo "  - Apply cold compress to forehead"
    echo "  - Consider pain relief medication if severe"
    ((recommendation_count++))
fi

if [[ "$symptoms_lower" == *"cold"* ]]; then
    echo " Get plenty of rest and sleep"
    echo "  - Use saline nasal spray for congestion"
    echo "  - Take vitamin C supplements"
    ((recommendation_count++))
fi

if [[ "$symptoms_lower" == *"stomach_pain"* ]]; then
    echo " Avoid solid foods for few hours"
    echo "  - Drink clear fluids (water, broth)"
    echo "  - Apply warm compress to abdomen"
    ((recommendation_count++))
fi

if [[ "$symptoms_lower" == *"fatigue"* ]]; then
    echo " Ensure 7-8 hours of quality sleep"
    echo "  - Maintain balanced diet with iron-rich foods"
    echo "  - Practice light exercise like walking"
    ((recommendation_count++))
fi

if [[ "$symptoms_lower" == *"nausea"* ]]; then
    echo " Drink ginger tea or peppermint tea"
    echo "  - Eat small, frequent meals"
    echo "  - Avoid strong smells and fatty foods"
    ((recommendation_count++))
fi

echo "========================="
if [ $recommendation_count -eq 0 ]; then
    echo "No specific symptoms recognized."
    echo "General Advice: Consult a healthcare professional for proper diagnosis."
else
    echo "Total recommendations provided: $recommendation_count"
    echo "Note: If symptoms persist for more than 3 days, consult a doctor."
fi
```

### **2. Scheduling with Cron**

**To schedule the script to run daily at 8 AM:**

1. **Open crontab editor:**
   ```bash
   crontab -e
   ```

2. **Add the following line:**
   ```cron
   0 8 * * * /path/to/your/expert_system.sh
   ```

3. **Make script executable:**
   ```bash
   chmod +x /path/to/your/expert_system.sh
   ```

**Alternative scheduling examples:**
```cron
# Run every day at 8 AM
0 8 * * * /home/user/medical_expert.sh

# Run every 6 hours
0 */6 * * * /home/user/medical_expert.sh

# Run on weekdays at 9 AM
0 9 * * 1-5 /home/user/medical_expert.sh
```

### **3. Enhanced Multi-Recommendation System**

```bash
#!/bin/bash
echo "Welcome to the Advanced Medical Expert System"
echo "Enter your symptoms separated by commas:"
read symptoms

# Convert to lowercase and array
symptoms_lower=$(echo "$symptoms" | tr '[:upper:]' '[:lower:]' | tr ',' ' ')
declare -A recommendations
declare -a matched_symptoms

# Define symptom-recommendation rules
recommendations["fever"]="Take fever reducer medication|Monitor temperature every 4 hours|Stay hydrated"
recommendations["sore_throat"]="Gargle with warm saltwater|Use throat lozenges|Avoid cold drinks"
recommendations["cough"]="Drink warm fluids with honey|Use cough syrup|Use humidifier"
recommendations["headache"]="Rest in dark room|Apply cold compress|Consider pain relief"
recommendations["cold"]="Get plenty of rest|Use saline nasal spray|Take vitamin C"
recommendations["stomach_pain"]="Avoid solid foods|Drink clear fluids|Apply warm compress"
recommendations["fatigue"]="Ensure 7-8 hours sleep|Eat iron-rich foods|Light exercise"
recommendations["nausea"]="Drink ginger tea|Eat small frequent meals|Avoid strong smells"

echo ""
echo "=== MEDICAL ADVICE REPORT ==="
echo "Input Symptoms: $symptoms"
echo ""

# Check each symptom and collect matches
for symptom in "${!recommendations[@]}"; do
    if [[ " $symptoms_lower " == *" $symptom "* ]]; then
        matched_symptoms+=("$symptom")
    fi
done

# Display recommendations for matched symptoms
if [ ${#matched_symptoms[@]} -gt 0 ]; then
    echo "RECOMMENDATIONS:"
    echo "----------------"
    for symptom in "${matched_symptoms[@]}"; do
        echo "● For $symptom:" # added ascii character for bulled
        IFS='|' read -ra advice <<< "${recommendations[$symptom]}"
        for item in "${advice[@]}"; do
            echo "  - $item"
        done
        echo ""
    done
else
    echo "No specific symptoms recognized."
    echo "General Advice: Consult a healthcare professional."
fi

# Additional general advice
echo "GENERAL PRECAUTIONS:"
echo "-------------------"
echo " Wash hands frequently"
echo " Maintain social distance if infectious"
echo " Get adequate rest and nutrition"
echo " Seek emergency care for severe symptoms like:"
echo "  - Difficulty breathing"
echo "  - Chest pain" 
echo "  - High fever (over 103°F)"
echo "  - Severe dehydration"
```

### **4. Documentation Report**

**Expert System Documentation Report**

**System Overview:**
The rule-based medical expert system provides preliminary health recommendations based on user-reported symptoms using pattern matching and conditional logic.

**Rules and Logic:**
1. **Input Processing**: Case-insensitive symptom matching using string comparison
2. **Rule Structure**: IF-THEN rules for each symptom-recommendation pair
3. **Multiple Recommendations**: Support for concurrent multiple symptom analysis
4. **Default Handling**: General medical advice for unrecognized symptoms

**Symptom-Recommendation Mapping:**
- **Fever** → Medication, temperature monitoring, hydration
- **Sore Throat** → Saltwater gargle, lozenges, avoid irritants  
- **Cough** → Warm fluids, cough syrup, humidifier
- **Headache** → Rest, cold compress, pain relief
- **Cold** → Rest, nasal spray, vitamin C
- **Stomach Pain** → Dietary adjustment, fluids, warm compress
- **Fatigue** → Sleep optimization, nutrition, light exercise
- **Nausea** → Ginger tea, meal management, odor avoidance

**Improvements Made:**
1. **Enhanced Symptom Coverage**: Added 3 new symptoms (headache, cold, stomach pain) plus fatigue and nausea
2. **Multiple Recommendation Display**: Implemented array-based system to handle concurrent symptoms
3. **Structured Output**: Organized recommendations with bullet points and categories
4. **Cron Integration**: Automated daily execution capability
5. **User Experience**: Case-insensitive input, clear formatting, general precautions
6. **Error Handling**: Default advice for unrecognized inputs

**Technical Implementation:**
- Bash string manipulation for pattern matching
- Associative arrays for symptom-recommendation storage
- Cron scheduling for automation
- Modular rule structure for easy expansion

---
# tmux (Optional)
## **tmux - Terminal Multiplexer**

### **Installation**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install tmux
```

**CentOS/RHEL:**
```bash
sudo yum install tmux
```

**macOS:**
```bash
brew install tmux
```

### **Basic Usage**

**Starting tmux:**
```bash
tmux
```

**Creating named session:**
```bash
tmux new-session -s session_name
```

**Detaching from session:**
```bash
# Keyboard shortcut
Ctrl+b d
```

**Listing sessions:**
```bash
tmux list-sessions
```

**Attaching to session:**
```bash
tmux attach-session -t session_name
```

### **Essential Commands**

**Pane Management:**
- **Split vertically**: `Ctrl+b %`
- **Split horizontally**: `Ctrl+b "`
- **Switch panes**: `Ctrl+b arrow-keys`
- **Close pane**: `Ctrl+b x`

**Window Management:**
- **New window**: `Ctrl+b c`
- **Next window**: `Ctrl+b n`
- **Previous window**: `Ctrl+b p`
- **Rename window**: `Ctrl+b ,`

**Session Management:**
- **Kill session**: `tmux kill-session -t session_name`
- **Kill server**: `tmux kill-server`

### **Advanced Features**

**Scroll Mode:**
```bash
Ctrl+b [  # Enter scroll mode
q         # Exit scroll mode
```

**Copy Mode:**
- Enter copy mode: `Ctrl+b [`
- Navigate with arrow keys
- Select text: `Space` to start, `Enter` to copy
- Paste: `Ctrl+b ]`

**Configuration (~/.tmux.conf):**
```bash
# Enable mouse support
set -g mouse on

# Set prefix to Ctrl+a
unbind C-b
set -g prefix C-a

# Reload config
bind r source-file ~/.tmux.conf
```

### **Practical Usage Examples**

**Running long-term processes:**
```bash
tmux new -d -s backup './backup_script.sh'
```

**Monitoring multiple services:**
```bash
# Create session with multiple panes
tmux new -s monitoring
# Split and run different monitoring commands in each pane
```

**Session persistence:**
- Processes continue running when detached
- Reattach from any terminal
- Ideal for remote servers and long-running scripts

