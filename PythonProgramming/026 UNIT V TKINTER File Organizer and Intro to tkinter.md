# Question:

Write a Python function using the `os` module that organizes files in a given directory into folders such as Videos, Audios, Images, Documents, and Misc. Use `os.system` to move files, detect if the operating system is "nt" (Windows) or not using `os.name`, and check if the file already exists before moving it. Finally, show how to use the function by taking a directory path as input from the user.

### Code:

```python
import os

# Function to organize files into different folders
def organize_files(directory):
    # Detect the operating system using os.name
    is_windows = os.name == 'nt'

    # Define file categories and corresponding file extensions
    file_types = {
        'Videos': ['.mp4', '.mkv', '.avi', '.mov'],
        'Audios': ['.mp3', '.wav', '.aac', '.flac'],
        'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
        'Documents': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
        'Misc': []
    }

    # Create folders for each file category if they don't already exist
    for folder in file_types.keys():
        folder_path = os.path.join(directory, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

    # Iterate over the files in the directory
    for file_name in os.listdir(directory):
        file_path = os.path.join(directory, file_name)

        # Skip directories
        if os.path.isdir(file_path):
            continue
        
        # Determine the file extension
        file_extension = os.path.splitext(file_name)[1].lower()

        # Find the appropriate category for the file
        moved = False
        for folder, extensions in file_types.items():
            if file_extension in extensions:
                # Move the file to the corresponding folder
                destination = os.path.join(directory, folder, file_name)
                
                # Check if file already exists at the destination
                if not os.path.exists(destination):
                    if is_windows:
                        os.system(f'move "{file_path}" "{destination}"')
                    else:
                        os.system(f'mv "{file_path}" "{destination}"')
                moved = True
                break
        
        # If no matching category is found, move to the 'Misc' folder
        if not moved:
            misc_destination = os.path.join(directory, 'Misc', file_name)
            if not os.path.exists(misc_destination):
                if is_windows:
                    os.system(f'move "{file_path}" "{misc_destination}"')
                else:
                    os.system(f'mv "{file_path}" "{misc_destination}"')

    print("Files have been organized!")


# Example usage
if __name__ == "__main__":
    user_input = input("Enter the directory path to organize: ")
    if os.path.exists(user_input):
        organize_files(user_input)
    else:
        print("Invalid directory path!")
```

### Explanation:

1. **Detecting the Operating System**: The program uses `os.name` to detect if the system is Windows (`'nt'`) or Unix-like (`'posix'`). This helps in selecting the correct command for moving files:
- For Windows (`nt`): the `move` command is used.
- For Unix-like systems (`posix`): the `mv` command is used.

2. **File Categories**: A dictionary (`file_types`) is used to map different file categories (Videos, Audios, Images, Documents, Misc) to their corresponding file extensions (e.g., `.mp4`, `.mp3`, `.jpg`).

3. **Creating Folders**: For each file category, the function creates a folder if it doesn’t already exist using `os.makedirs`.

4. **File Movement**: The function iterates over all the files in the directory. For each file, it checks its extension to determine its category. Then:
- If the file doesn’t already exist in the target folder, it is moved to the correct folder using `os.system`.
- If the file doesn’t match any category, it is placed in the "Misc" folder.

5. **Input Handling**: The function takes the directory path as input from the user. If the path is valid (`os.path.exists`), it proceeds to organize the files. Otherwise, it notifies the user that the directory path is invalid.

This method ensures the code works on both Windows and Unix-like systems by handling OS-specific file operations correctly.

---

Here’s an introduction to `tkinter`, the standard Python library for creating graphical user interfaces (GUIs). Below is a simple example that creates a window with an input block (Entry widget) and a button. When the button is clicked, it will display the text entered by the user in the console.

```python
import tkinter as tk

# Create the main window
root = tk.Tk()
root.title("Simple Input and Button GUI")
root.geometry("300x150")  # Set the window size

# Function to be called when the button is clicked
def show_input():
    user_input = entry.get()  # Get text from the entry box
    print("User input:", user_input)

# Label for entry
label = tk.Label(root, text="Enter something:")
label.pack(pady=10)  # Add padding around the label

# Entry (input block) where user can type text
entry = tk.Entry(root, width=30)
entry.pack(pady=5)

# Button to trigger the function show_input
button = tk.Button(root, text="Submit", command=show_input)
button.pack(pady=10)

# Start the GUI event loop
root.mainloop()
```

### Explanation:
1. **tk.Tk()**: Initializes the main window (the root of the application).
2. **tk.Label()**: Creates a label to prompt the user.
3. **tk.Entry()**: Creates a text input block where the user can type.
4. **tk.Button()**: Creates a button. The `command` argument tells the button to call the `show_input` function when clicked.
5. **show_input()**: This function retrieves the text from the `Entry` widget and prints it to the console.
6. **root.mainloop()**: Starts the event loop that waits for user interaction.

This creates a basic GUI where a user can input text and submit it by clicking the button. The submitted text will be printed to the terminal.
---
# Practie Assignment

Create a File organiser GUI software and save it with name `FileOrganizer_<SapID>.py`


---

`tkinter` offers a wide range of widgets and functions to create versatile and interactive graphical user interfaces (GUIs). Below are explanations of some additional common widgets and functions in `tkinter`:

### 1. **Labels**
Labels are used to display text or images.

```python
label = tk.Label(root, text="This is a label", font=("Arial", 14))
label.pack(pady=10)
```

- **font**: Specifies the font type and size.
- **pady**: Adds vertical padding around the label.

### 2. **Buttons**
Buttons trigger an action when clicked. You can style them and link them to functions.

```python
button = tk.Button(root, text="Click me", command=my_function, bg="blue", fg="white")
button.pack(pady=10)
```

- **command**: Links the button to a function that will be called when clicked.
- **bg** and **fg**: Set the background and foreground (text) colors of the button.

### 3. **Entry (Input Block)**
The `Entry` widget allows users to input text.

```python
entry = tk.Entry(root, show="*")
entry.pack(pady=5)
```

- **show**: If set to `"*"`, the entry will mask the characters (useful for password fields).

### 4. **Text Box**
For multi-line text input, use the `Text` widget instead of `Entry`.

```python
text_box = tk.Text(root, height=5, width=40)
text_box.pack(pady=10)
```

- **height** and **width**: Specify the size of the text box in rows and columns.

### 5. **Checkbutton**
Creates a checkbox that can be toggled on or off.

```python
var = tk.IntVar()  # To store the checkbox state
check = tk.Checkbutton(root, text="I agree", variable=var)
check.pack(pady=5)
```

- **variable**: Links the checkbox to a Tkinter variable (e.g., `IntVar`, `BooleanVar`) to store its state (0 or 1).

### 6. **Radiobutton**
Presents mutually exclusive options (only one can be selected).

```python
var = tk.IntVar()
radio1 = tk.Radiobutton(root, text="Option 1", variable=var, value=1)
radio2 = tk.Radiobutton(root, text="Option 2", variable=var, value=2)
radio1.pack(pady=5)
radio2.pack(pady=5)
```

- **variable**: Stores the selected value.
- **value**: Each radio button has a unique value to differentiate it from others.

### 7. **Listbox**
Displays a list of options. Users can select one or multiple items from the list.

```python
listbox = tk.Listbox(root, selectmode=tk.SINGLE)  # Or use selectmode=tk.MULTIPLE
listbox.insert(1, "Item 1")
listbox.insert(2, "Item 2")
listbox.pack(pady=10)
```

- **insert()**: Adds items to the list.
- **selectmode**: Allows single or multiple selections.

### 8. **Scale**
Creates a slider that allows users to select a value from a range.

```python
scale = tk.Scale(root, from_=0, to=100, orient=tk.HORIZONTAL)
scale.pack(pady=10)
```

- **from_** and **to**: Define the range of the slider.
- **orient**: Defines the orientation of the scale (horizontal or vertical).

### 9. **Message Box**
Displays a pop-up message (using `tkinter.messagebox` module).

```python
from tkinter import messagebox

def show_message():
    messagebox.showinfo("Information", "This is a message")

button = tk.Button(root, text="Show Message", command=show_message)
button.pack(pady=10)
```

- **messagebox.showinfo()**: Displays an information dialog with a title and a message.

### 10. **Canvas**
For drawing shapes like lines, rectangles, and circles, you can use the `Canvas` widget.

```python
canvas = tk.Canvas(root, width=300, height=200)
canvas.create_line(0, 0, 300, 200, fill="blue")
canvas.create_oval(50, 50, 150, 150, fill="red")
canvas.pack(pady=10)
```

- **create_line()**: Draws a line between two points.
- **create_oval()**: Draws an oval (or circle) within the specified bounding box.

### 11. **Combobox (from ttk module)**
A dropdown menu that allows users to select an option.

```python
from tkinter import ttk

combo = ttk.Combobox(root, values=["Option 1", "Option 2", "Option 3"])
combo.current(0)  # Set default option
combo.pack(pady=10)
```

- **values**: Provides the list of options in the dropdown.
- **current()**: Sets the default option.

### 12. **Frame**
Frames are containers that group other widgets together. You can use them to structure complex layouts.

```python
frame = tk.Frame(root, borderwidth=2, relief="sunken")
frame.pack(pady=10)
label_in_frame = tk.Label(frame, text="Label inside frame")
label_in_frame.pack()
```

- **borderwidth** and **relief**: Customize the border and appearance of the frame.

### 13. **Menu**
A menu bar provides a way to organize commands in a hierarchical manner.

```python
menu_bar = tk.Menu(root)

# Create a file menu
file_menu = tk.Menu(menu_bar, tearoff=0)
file_menu.add_command(label="New")
file_menu.add_command(label="Open")
file_menu.add_command(label="Save")
file_menu.add_separator()
file_menu.add_command(label="Exit", command=root.quit)

menu_bar.add_cascade(label="File", menu=file_menu)
root.config(menu=menu_bar)
```

- **add_command()**: Adds a clickable command to the menu.
- **add_cascade()**: Creates a hierarchical menu (e.g., File > New, Open, etc.).
- **root.config(menu=menu_bar)**: Attaches the menu to the window.

### 14. **Grid Layout**
You can organize widgets in rows and columns using the `grid()` layout manager instead of `pack()`.

```python
label1 = tk.Label(root, text="Row 0, Column 0")
label1.grid(row=0, column=0)

label2 = tk.Label(root, text="Row 0, Column 1")
label2.grid(row=0, column=1)

button = tk.Button(root, text="Button in row 1")
button.grid(row=1, column=0, columnspan=2)  # Span across two columns
```

- **grid()**: Organizes widgets in a table-like structure.
- **row** and **column**: Specify the row and column positions for the widget.
- **columnspan**: Makes the widget span multiple columns.




---
# pack, grid and place methods of tkinter
In `tkinter`, you can easily customize widgets like labels and buttons by setting various attributes (such as text, font, color, etc.) and then attaching them to the main window (`root`) using methods like `pack()`, `grid()`, or `place()`.

### Example: Customizing a Label and Button

Here’s how you can customize a label and a button and attach them to the `root` window:

```python
import tkinter as tk

# Create the root window
root = tk.Tk()
root.title("My Custom Window")  # Set window title

# Customizing a Label
label = tk.Label(root, 
                 text="Hello, Tkinter!",  # Text displayed on the label
                 font=("Helvetica", 16),  # Set font family and size
                 fg="blue",  # Text color
                 bg="yellow",  # Background color
                 padx=10,  # Padding in the x direction
                 pady=10)  # Padding in the y direction

# Attaching the label to the root window using pack
label.pack()  # You can use pack(), grid(), or place() for layout

# Customizing a Button
def on_button_click():
    label.config(text="Button Clicked!")  # Change label text when button is clicked

button = tk.Button(root, 
                   text="Click Me",  # Text displayed on the button
                   font=("Arial", 14),  # Font for button text
                   fg="white",  # Button text color
                   bg="green",  # Button background color
                   activebackground="lightgreen",  # Background when pressed
                   command=on_button_click)  # Function to call when clicked

# Attaching the button to the root window
button.pack(pady=20)  # Adds some space between the button and the label

# Start the main event loop
root.mainloop()
```

### Breakdown of Customizations:

#### For the Label (`tk.Label`):
- `text`: The text that appears on the label.
- `font`: Sets the font family and size (e.g., `("Helvetica", 16)`).
- `fg`: The color of the text (foreground).
- `bg`: The background color of the label.
- `padx` and `pady`: Padding around the label, in the x and y directions, respectively.

#### For the Button (`tk.Button`):
- `text`: The text that appears on the button.
- `font`: Font and size for the button text.
- `fg`: Color of the text on the button.
- `bg`: The button's background color.
- `activebackground`: The background color when the button is pressed.
- `command`: The function to be executed when the button is clicked. Here, clicking the button changes the label’s text to "Button Clicked!".

#### Layout:
- `pack()`: Used to place the widgets in the window. It places the label and button vertically, one after the other.
   - `pady=20`: Adds vertical space between the button and the label.

You can also use other layout managers like `grid()` or `place()` to position your widgets more precisely:
- `grid()` allows placing widgets in a table-like structure.
- `place()` positions widgets at an exact x and y position within the window.



---

### Summary
- `tkinter` offers various widgets (buttons, labels, text boxes, etc.) and layout managers (`pack()`, `grid()`, etc.) to build GUIs.
- You can control the layout, style, and behavior of each widget.
- Additional modules like `ttk` (Themed Tkinter) and `messagebox` can further extend its functionality for advanced UIs.






