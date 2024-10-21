# pyinstaller
## Compile python script for distribution

> It do not hides your source code.

To compile a Python script (`main.py`) that uses `tkinter` into an executable (`.exe`) using `PyInstaller` on different operating systems (Windows, Linux, macOS), follow these steps:

### Steps for Windows (using `pyinstaller`):

1. **Install PyInstaller:**
```bash
pip install pyinstaller
```

2. **Compile the `main.py` into an executable:**
In the terminal, navigate to the directory containing `main.py` and run:
```bash
pyinstaller main.py
```
or 
```bash
pyinstaller --onefile --windowed main.py
```
- `--onefile`: Packs everything into a single `.exe` file.
- `--windowed`: Ensures the GUI app runs without opening a command-line window.

3. **Find the `.exe` file:**
After the build process completes, the `.exe` will be located in the `dist/` folder. You can distribute this `.exe` file.

### For Linux:

1. **Install PyInstaller:**
```bash
pip install pyinstaller
```

2. **Compile `main.py` into a binary:**
Similar to Windows, run:
```bash
pyinstaller --onefile --windowed main.py
```
This will create an executable file in the `dist/` folder. The generated file will not be a `.exe` but a Linux binary.

3. **Modifications (Linux-specific):**
- You might need to install `tkinter` on Linux, especially on systems where it is not pre-installed:
```bash
sudo apt-get install python3-tk
```

- Linux binaries typically require the same libraries to be present on the target machine. For a truly portable executable, you may want to use a tool like `AppImage` or `Flatpak`.

### For macOS:

1. **Install PyInstaller:**
```bash
pip install pyinstaller
```

2. **Compile `main.py` into an executable:**
Similar to Windows and Linux, run:
```bash
pyinstaller --onefile --windowed main.py
```

3. **Modifications (macOS-specific):**
- macOS apps often need additional handling to be signed and notarized to run without issues. To avoid gatekeeper restrictions, you might have to sign the binary:
```bash
codesign --deep --force --sign - /path/to/your/executable
```

- You may also need to ensure that `tkinter` is installed on macOS:
```bash
brew install python-tk
```

- To create a macOS app bundle (`.app`), you can use:
```bash
pyinstaller --onefile --windowed --icon=app_icon.icns --name=AppName main.py
```

### Common Issues:
- **Missing Libraries**: Ensure that the machine you're running the compiled program on has the necessary dependencies, especially `tkinter`.
- **Permissions**: On Linux and macOS, ensure that the generated binary has executable permissions:
```bash
chmod +x dist/main
```

---


To pack a Python application with all its dependencies (including third-party libraries) into a standalone executable, you can use **PyInstaller** or **cx_Freeze**. This ensures that the end user doesn’t need to install Python or any libraries separately. Below are steps for packing a Python script with all dependencies.

### Using PyInstaller

1. **Install PyInstaller:**
```bash
pip install pyinstaller
```

2. **Check and install dependencies:**
Ensure all dependencies are installed in your environment. You can check the dependencies in your `requirements.txt` (if you have one) and install them with:
```bash
pip install -r requirements.txt
```

3. **Generate the standalone executable:**
To pack your `main.py` script with all dependencies into one executable file, use the following command:
```bash
pyinstaller --onefile main.py
```
- `--onefile`: Packs all dependencies and files into a single executable.
- The executable will be created in the `dist/` folder.

4. **Customizing the build (optional):**
- **Icon**: If you want to add an icon to your executable, use the `--icon` option.
```bash
pyinstaller --onefile --icon=app_icon.ico main.py
```
- **Windowed GUI**: If your app is a GUI application (e.g., using `tkinter`), add the `--windowed` option to prevent opening a terminal window.
```bash
pyinstaller --onefile --windowed main.py
```

### Bundling in a Virtual Environment (Optional)

If you want to ensure that the exact dependencies used are bundled into the executable, you can create a virtual environment first:

1. **Create a virtual environment:**
```bash
python -m venv myenv
```

2. **Activate the virtual environment:**
- On Windows:
```bash
myenv\Scripts\activate
```
- On Linux/macOS:
```bash
source myenv/bin/activate
```

3. **Install your dependencies inside the virtual environment:**
```bash
pip install -r requirements.txt
```

4. **Run PyInstaller in the virtual environment:**
```bash
pyinstaller --onefile main.py
```

### Using cx_Freeze (Alternative to PyInstaller)

If you prefer using **cx_Freeze**, you can also pack Python scripts with dependencies into an executable.

1. **Install cx_Freeze:**
```bash
pip install cx_Freeze
```

2. **Create a `setup.py` file:**
This file will define how to build your application.

```python
from cx_Freeze import setup, Executable

# Dependencies are automatically detected, but some modules need to be included/excluded manually.
options = {
  'build_exe': {
      'packages': [],  # Add packages required for your app.
      'excludes': [],
  }
}

setup(
  name="AppName",
  version="1.0",
  description="Your app description",
  options=options,
  executables=[Executable("main.py")]
)
```

3. **Build the executable:**
Run the following command:
```bash
python setup.py build
```

4. **The output** will be in the `build/` directory, with all the dependencies included.

### Common Issues:
- **Large Executables**: Using `--onefile` with `PyInstaller` or bundling all dependencies can result in large executable sizes. To reduce the size, you may need to exclude unnecessary libraries with the `--exclude-module` option in `PyInstaller`.
- **Cross-Platform Builds**: PyInstaller does not support building for other platforms from one operating system (e.g., creating a Windows executable on Linux or macOS). You'll need to build the executable on each platform.
