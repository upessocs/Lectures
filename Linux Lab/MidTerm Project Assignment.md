
#  Mid Term Project 
## **Daily User Log Archiver**

**Goal:**
Create a shell script that logs current system information (user, date, running processes, disk usage), rotates logs, and schedules itself to run daily.

---

### Features to Implement

1. **Identify user**

   * Use `whoami` to log which user ran the script.
   * Example: `echo "User: $(whoami)"`.

2. **File manipulation**

   * Store logs in a directory like `~/daily_logs`.
   * Create the directory if it doesn’t exist.
   * Write data (date, uptime, top 5 processes, disk usage) to a file named with the current date.
   * Example: `logfile="log_$(date +%Y-%m-%d).txt"`.

3. **Archiving**

   * Compress old logs into a `.tar.gz` archive at the end of each week.
   * Example: `tar -czf weekly_logs_$(date +%Y-%m-%d).tar.gz log_*.txt`.

4. **Loops & conditions**

   * Loop through logs older than 7 days and move them to an archive directory.
   * Example:

     ```bash
     for file in log_*.txt; do
       if [ condition-to-check-age ]; then
         mv "$file" archive/
       fi
     done
     ```

5. **Scheduling (cron job)**

   * Use `crontab -e` to schedule the script to run every day at a fixed time.
   * Example:

     ```
     0 20 * * * /home/user/daily_log.sh
     ```

---

### Hints for Implementation

* **Date handling:**
  Use `date +%Y-%m-%d` for filenames.
* **Checking old files:**
  `find . -name "log_*.txt" -mtime +7` can help detect logs older than 7 days.
* **Disk usage:**
  `df -h` or `du -sh ~/daily_logs`.
* **Process listing:**
  `ps -eo pid,comm,%mem,%cpu --sort=-%cpu | head -n 6`.
* **Archiving weekly logs:**
  Place archive files in a folder `~/daily_logs/archive`.
* **Scheduling check:**
  Run `crontab -l` to confirm your cron job is registered.

---

### Explore ways to to following using scripting and list your selection here

1.  Send an email with the log as an attachment (`mail` command).
2. Add error handling (e.g., check if archive directory exists).
3. Add a menu (case statement) for manual archive, log cleanup, or viewing latest log.

