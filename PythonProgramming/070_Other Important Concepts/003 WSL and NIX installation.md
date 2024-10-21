# Install WSL and NIX on windows and use python and jupyter-lab in it
## An alternative way to work with python

To install and run these three commands are required for first time

- open cmd powershell on windows

```cmd
wsl --install -d ubuntu

wsl

curl -L https://nixos.org/nix/install | sh

nix-shell -p python3 python3Packages.jupyterlab python3Packages.numpy python3Packages.pandas python3Packages.matplotlib --run "jupyter-lab ."



```
For detaile read next slide
---

## Step 1: Install WSL on Windows

1. **Enable WSL Feature:**
#### Open **PowerShell** as Administrator and run the following command to enable WSL:
```powershell
wsl --install
wsl --install -d ubuntu
```
#### This command installs WSL along with the latest Ubuntu distribution by default.

2. **Restart Your Computer:**
#### After the installation is complete, restart your computer if prompted.

3. **Set Up Your Linux Distribution:**
#### After the restart, WSL will automatically launch Ubuntu (or the distribution you installed) to complete the setup.
#### You will be prompted to create a new user account and password for your Linux environment.

4. **Update WSL:**
#### Ensure you have the latest version of WSL by running:
```powershell
wsl --update
```

5. **Check WSL Version:**
#### Confirm that you’re using WSL 2 (which is more efficient) by running:
```powershell
wsl -l -v
```
#### If your installed distribution is using WSL 1, you can upgrade it to WSL 2 with:
```powershell
wsl --set-version <distribution_name> 2
```

### Step 2: Install Nix in WSL

1. **Install Prerequisites:**
#### Open your WSL terminal (e.g., Ubuntu) and update the package lists:
```powershell
wsl
```

```bash
sudo apt update
sudo apt upgrade -y
```

2. **Download and Install Nix:**
#### Run the following command to install Nix:
```bash
curl -L https://nixos.org/nix/install | sh
```
#### Follow the on-screen instructions. This script will install the Nix package manager and set up your environment.

3. **Source Nix Environment:**
#### After installation, source your shell configuration to load Nix:
```bash
. ~/.nix-profile/etc/profile.d/nix.sh
```
#### Alternatively, you can close and reopen your terminal to automatically load the environment.

4. **Test Nix Installation:**
#### Verify that Nix is working by running:
```bash
nix-env --version
```

## Run `jupyter-lab` with some other python packages in `wsl` where nix is installed
```bash
nix-shell -p python3 python3Packages.jupyterlab python3Packages.numpy python3Packages.pandas python3Packages.matplotlib --run "jupyter-lab ."
```


---


# More Info on Nix installation.

[more info about nixos on https://nixos.org/download/](https://nixos.org/download/)