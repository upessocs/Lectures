# Nix Development Environments: From `nix-shell` to Flakes

A hands-on, incremental guide. Every stage ends with a short exercise and the output you should expect to see.

> **NixOS is not required.** Everything in Parts 0-9 works on Ubuntu, Debian, Fedora, macOS and WSL once Nix is installed. NixOS-only material is marked **[NixOS]**.

## How to use this tutorial

```text
CORE PATH (do these in order)
  Part 0   Setup
  Part 1   Why Nix
  Part 2   Temporary shells        nix shell / nix-shell -p
  Part 3   shell.nix
  Part 4   Language environments   Python, Node, Go, Rust, C/C++
  Part 5   Variables and hooks
  Part 6   Your first flake        flake.nix + flake.lock
  Part 7   Multiple environments in one repo

EXTENSIONS (pick what you need)
  Part 8   Common real-world use cases
  Part 9   direnv (auto-activation)
  Part 10  CI
  Part 11  Packages and container images
  Part 12  Templates
  Part 13  NixOS integration
  Part 14  Common errors
  Part 15  Cheat sheet
  Part 16  Learning path and lab repo
```

---

# Part 0 - Setup

## 0.1 Install Nix (non-NixOS)

```bash
# Determinate installer: multi-user install with flakes enabled by default
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install

# Open a NEW terminal, then verify
nix --version
# expected: nix (Nix) 2.xx.x

# Smoke test: run a program without installing it
nix run nixpkgs#hello
# expected: Hello, world!
```

## 0.2 Already have Nix? Enable flakes manually

```bash
# Flakes and the new `nix` command are still "experimental features" in upstream Nix
mkdir -p ~/.config/nix
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf

# Verify
nix flake --help | head -n 3
# if you see "experimental Nix feature 'flakes' is disabled", the line above is missing
```

## 0.3 [NixOS] Enable flakes system-wide

```nix
# /etc/nixos/configuration.nix
{
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
}
```

```bash
sudo nixos-rebuild switch
```

## 0.4 Two things to know before you start

```bash
# 1. Flakes only see files tracked by git. Always run:
git init
git add flake.nix        # and every new file the flake needs

# 2. Nix downloads a lot. Reclaim disk space at any time with:
nix-collect-garbage -d
```

> **Exercise:** run `nix run nixpkgs#cowsay -- "Nix works"` and confirm a cow appears.

---

# Part 1 - What problem does Nix solve?

Three projects, three conflicting toolchains:

```text
project-python/   Python 3.12, numpy, pandas
project-node/     Node.js 22, npm packages
project-rust/     rustc, cargo
```

Installing everything globally (`/usr/bin/python`, `/usr/bin/node`) leads to:

```text
Project A needs Python 3.11     Project B needs Python 3.12
Project A needs Node 20         Project B needs Node 22
```

Nix lets each project **declare what tools it needs** instead of assuming they are installed globally:

```text
Project A: Python 3.11 + numpy      Project B: Node 22 + npm
```

without touching the rest of your operating system.

## The Nix store

Packages live in `/nix/store`, each in a directory whose name contains a hash of its inputs:

```text
/nix/store/abc123...-python3-3.11.9
/nix/store/def456...-python3-3.12.4     <- both exist side by side
/nix/store/ghi789...-nodejs-22.4.0
```

Different versions never overwrite each other. That is the foundation of reproducibility.

## Finding packages

```bash
# Search nixpkgs (the huge package collection)
nix search nixpkgs ripgrep
nix search nixpkgs python312
nix search nixpkgs nodejs

# Or browse https://search.nixos.org/packages

# Check the exact name/version of a package
nix eval nixpkgs#git.name
# expected: "git-2.xx.x"
```

---

# Part 2 - Temporary environments

Try tools without installing anything permanently.

```bash
# New CLI (preferred): add packages to your current shell
nix shell nixpkgs#git nixpkgs#curl nixpkgs#jq

git --version
curl --version
jq --version
exit                       # back to your normal shell; nothing was installed

# Old CLI (still common in docs and Stack Overflow answers)
nix-shell -p git curl jq

# Run one program once, no shell at all
nix run nixpkgs#cowsay -- "hello"
```

```text
Your normal system
   |-- git may not even be installed
   `-- nix shell
         `-- git available until you `exit`
```

> **Exercise:** enter a shell with `ripgrep` (`nix shell nixpkgs#ripgrep`), run `rg --version`, exit, then run `rg --version` again. It should now say `command not found`.

---

# Part 3 - `shell.nix`: put the environment in the repo

`nix-shell -p git curl jq python gcc pkg-config` is impossible to remember. Commit the description instead.

```bash
mkdir myproject && cd myproject
```

```nix
# myproject/shell.nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    pkgs.git
    pkgs.curl
    pkgs.jq
  ];
}
```

```bash
nix-shell                  # finds shell.nix automatically
jq --version
exit
```

## Reading the file

```nix
{ pkgs ? import <nixpkgs> {} }:   # "use nixpkgs, call it pkgs" (default argument)

pkgs.mkShell {                    # build a development shell
  packages = [ ... ];             # tools available inside it
}
```

```text
shell.nix -> import nixpkgs -> pick git, curl, jq -> mkShell -> dev shell
```

> **Exercise:** add `pkgs.ripgrep` to the list, re-run `nix-shell`, and confirm `rg --version` works.

---

# Part 4 - Language environments

Each example is a complete `shell.nix`. Run `nix-shell` in the folder.

## 4.1 Python (idiomatic: `withPackages`)

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    # One interpreter that already contains these libraries
    (pkgs.python312.withPackages (ps: [
      ps.requests
      ps.numpy
      ps.pandas
    ]))
  ];
}
```

```bash
nix-shell
python --version                                   # Python 3.12.x
python -c "import numpy; print(numpy.__version__)"
```

### Libraries that are not in nixpkgs: use a venv with `uv`

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    pkgs.python312
    pkgs.uv                    # fast pip/venv replacement
  ];

  shellHook = ''
    # Create the venv once, activate on every entry
    [ -d .venv ] || python -m venv .venv
    source .venv/bin/activate
  '';
}
```

```bash
nix-shell
pip install flask              # pure-Python wheels work normally
```

> **Heads-up:** wheels with native code (numpy, torch, pillow) may fail with `libstdc++.so.6: cannot open shared object file`, because Nix does not use `/usr/lib`. Prefer the Nix-packaged version (`ps.numpy`) or add the missing library and set `LD_LIBRARY_PATH`:

```nix
pkgs.mkShell {
  packages = [ pkgs.python312 pkgs.uv ];
  shellHook = ''
    export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [ pkgs.stdenv.cc.cc.lib pkgs.zlib ]}:$LD_LIBRARY_PATH
  '';
}
```

## 4.2 Node.js

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [ pkgs.nodejs_22 ];
}
```

```bash
nix-shell
node --version                 # v22.x
npm init -y
npm install express            # npm still manages app dependencies
```

```text
Nix -> the Node.js runtime        npm -> your app's dependencies
```

## 4.3 Go

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    pkgs.go                    # compiler + stdlib
    pkgs.gopls                 # language server for your editor
  ];
}
```

```bash
nix-shell
go version
go mod init example.com/hello  # Go modules are still handled by Go
```

## 4.4 Rust

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    pkgs.rustc
    pkgs.cargo
    pkgs.rust-analyzer
  ];
}
```

```bash
nix-shell
cargo new hello && cd hello && cargo run
# expected: Hello, world!
```

(Need an exact Rust version or extra targets? See Part 8.5.)

## 4.5 C/C++ (and `buildInputs` vs `nativeBuildInputs`)

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # Tools that RUN during the build (compilers, build systems)
  nativeBuildInputs = [
    pkgs.gcc
    pkgs.cmake
    pkgs.gnumake
    pkgs.pkg-config
  ];

  # Libraries your code LINKS against (headers + .so files)
  buildInputs = [
    pkgs.openssl
    pkgs.zlib
  ];

  # Debugging and version control
  packages = [ pkgs.gdb pkgs.git ];
}
```

```bash
nix-shell
pkg-config --modversion openssl      # pkg-config can now find the library
```

Rule of thumb: **tools go in `nativeBuildInputs`, libraries go in `buildInputs`.** `pkg-config` uses `buildInputs` to locate libraries.

> **Exercise:** write a `hello.c` that includes `<zlib.h>`, compile it with `gcc hello.c -lz`, and confirm it builds only inside the shell.

---

# Part 5 - Environment variables and shell hooks

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [ pkgs.nodejs_22 ];

  # Variables exist only inside this shell
  DATABASE_URL = "postgresql://localhost/mydb";
  NODE_ENV     = "development";
  API_PORT     = "3000";

  # Runs every time you enter the shell
  shellHook = ''
    echo "Backend dev environment"
    echo "Node: $(node --version)"
    alias t="npm test"         # aliases vanish when you leave
  '';
}
```

```bash
nix-shell
# expected: Backend dev environment
#           Node: v22.x
echo $DATABASE_URL
```

Good uses for `shellHook`: tool checks, creating a venv, exporting paths, printing onboarding instructions.

---

# Part 6 - Your first flake

## 6.1 The weakness of `shell.nix`

```nix
{ pkgs ? import <nixpkgs> {} }:     # WHICH nixpkgs?
```

`<nixpkgs>` depends on each machine's channel configuration. Developer A and Developer B can silently get different package versions. Flakes fix this by **pinning** the exact revision.

```text
flake.nix   (you write)    "I want nixpkgs from this branch"
flake.lock  (Nix writes)   "...specifically THIS commit"
        => everyone gets the same dependency graph
```

## 6.2 A minimal flake

```bash
mkdir hello-nix && cd hello-nix
git init
```

```nix
# hello-nix/flake.nix
{
  description = "Simple Python development environment";

  inputs = {
    # Use a stable release branch for teaching. Replace with the current one
    # (see https://status.nixos.org). nixos-unstable is newer but moves faster.
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";   # see Part 7.2 for multi-platform
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = [ pkgs.python312 ];
      };
    };
}
```

```bash
git add flake.nix          # REQUIRED: flakes ignore untracked files
nix develop                # creates flake.lock on first run
python --version
exit

git add flake.lock         # commit the lock file with the project
```

## 6.3 Reading the flake

```nix
inputs  = { nixpkgs.url = "..."; };        # what the project depends on
outputs = { self, nixpkgs }: { ... };      # what the project provides
devShells.${system}.default                # the shell `nix develop` enters
```

## 6.4 Updating dependencies

```bash
# Move the pin to the newest commit of the tracked branch
nix flake update

# See exactly what changed
git diff flake.lock

# Update just one input
nix flake update nixpkgs

# Validate the flake
nix flake check
```

`flake.lock` plays the same role as `package-lock.json`, `Cargo.lock` or `poetry.lock`.

> **Exercise:** add `pkgs.jq` to the flake, run `nix develop`, and confirm `jq --version` works. Then run `git diff` to see that `flake.lock` did not change (you changed packages, not the pin).

---

# Part 7 - Multiple environments and platforms

## 7.1 Several shells in one repository

```bash
nix develop                # default
nix develop .#frontend     # named shell
nix develop .#backend
```

## 7.2 Supporting several CPU architectures

```nix
{
  description = "Portable multi-environment flake";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];

      # Build the same attribute set once per system
      forAllSystems = f:
        nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {

        default = pkgs.mkShell {
          packages = [ pkgs.git pkgs.curl pkgs.jq ];
        };

        frontend = pkgs.mkShell {
          packages = [ pkgs.nodejs_22 pkgs.git ];
        };

        backend = pkgs.mkShell {
          packages = [
            (pkgs.python312.withPackages (ps: [ ps.flask ps.requests ]))
            pkgs.postgresql
            pkgs.curl
            pkgs.jq
          ];
        };
      });
    };
}
```

```bash
git add flake.nix
nix flake show             # lists every shell for every system
nix develop .#backend
```

> `legacyPackages` is the simplest approach. It does not allow unfree packages; see Part 14 if you need one.

## 7.3 Course-repository layout

```text
BackendDevelopment/
|-- flake.nix        shells: default, node, python, database, devops
|-- flake.lock
|-- lectures/
|-- examples/
`-- assignments/
```

```bash
# Students clone once, then pick a lab environment
git clone https://github.com/upessocs/<course-repo> && cd <course-repo>
nix develop .#python
nix develop .#devops
```

One repository becomes a reproducible lab: same tools, same versions, on every student machine.

---

# Part 8 - Common real-world use cases

Each block is the `devShells` entry for the `forAllSystems` flake from Part 7.2.

## 8.1 Backend with a project-local PostgreSQL

```nix
backend-db = pkgs.mkShell {
  packages = [ pkgs.nodejs_22 pkgs.postgresql pkgs.curl pkgs.jq ];

  shellHook = ''
    # Keep database files and socket inside the project
    export PGDATA="$PWD/.pgdata"
    export PGHOST="$PWD/.pgsocket"
    export DATABASE_URL="postgresql:///postgres?host=$PGHOST"
    mkdir -p "$PGHOST"

    # Initialise the cluster on first run only
    [ -d "$PGDATA" ] || initdb --no-locale -E UTF8 >/dev/null

    # Start the server if it is not already running (unix socket only, no TCP)
    pg_ctl status >/dev/null 2>&1 || \
      pg_ctl start -o "-k $PGHOST -c listen_addresses=" -l "$PGDATA/log" >/dev/null

    # Stop it when this shell exits
    trap 'pg_ctl stop >/dev/null 2>&1' EXIT
  '';
};
```

```bash
echo ".pgdata/" >> .gitignore && echo ".pgsocket/" >> .gitignore
nix develop .#backend-db
psql -c "select version();"
```

## 8.2 DevOps / Kubernetes

```nix
devops = pkgs.mkShell {
  packages = [
    pkgs.docker-client      # CLI only. The Docker daemon is NOT included (see note)
    pkgs.kubectl
    pkgs.kubernetes-helm
    pkgs.k9s
    pkgs.kind               # local Kubernetes clusters in Docker
    pkgs.yq-go
    pkgs.jq
    pkgs.git
  ];

  shellHook = ''
    alias k=kubectl
    echo "kubectl: $(kubectl version --client 2>/dev/null | head -n 1)"
  '';
};
```

```bash
nix develop .#devops
k version --client
```

> **Docker daemon note.** A dev shell can only provide the *client*. The daemon (`dockerd`) is a system service. On Ubuntu/Debian install Docker Engine normally. **[NixOS]**: set `virtualisation.docker.enable = true;` and add your user to the `docker` group.

## 8.3 Infrastructure as code (OpenTofu, Ansible)

```nix
iac = pkgs.mkShell {
  packages = [
    pkgs.opentofu           # open-source Terraform fork
    pkgs.ansible
    pkgs.awscli2
    pkgs.git
  ];
  # Terraform itself is "unfree" (BSL license). See Part 14 if you need pkgs.terraform
};
```

## 8.4 Data science with Jupyter

```nix
data = pkgs.mkShell {
  packages = [
    (pkgs.python312.withPackages (ps: [
      ps.jupyter
      ps.pandas
      ps.matplotlib
      ps.scikit-learn
    ]))
  ];
};
```

```bash
nix develop .#data
jupyter notebook
```

## 8.5 Rust with a pinned toolchain (`rust-overlay`)

`pkgs.rustc` gives whatever version the nixpkgs revision has. To choose the version yourself:

```nix
# flake.nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    rust-overlay.url = "github:oxalica/rust-overlay";
    rust-overlay.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, rust-overlay }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ rust-overlay.overlays.default ];
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = [
          # Exact version, plus extra components
          (pkgs.rust-bin.stable."1.85.0".default.override {
            extensions = [ "rust-src" "rust-analyzer" ];
          })
        ];
      };
    };
}
```

## 8.6 Java with Maven/Gradle (switching JDK versions)

```nix
java = pkgs.mkShell {
  packages = [ pkgs.jdk21 pkgs.maven pkgs.gradle ];
  shellHook = ''
    export JAVA_HOME="${pkgs.jdk21}"
    java -version
  '';
};

# To test on another JDK, swap pkgs.jdk21 for pkgs.jdk17 (in both places)
```

## 8.7 Frontend with native Node modules (`node-gyp`)

```nix
frontend-native = pkgs.mkShell {
  nativeBuildInputs = [ pkgs.python3 pkgs.gcc pkgs.gnumake pkgs.pkg-config ];
  buildInputs       = [ pkgs.vips ];     # example: native lib needed by `sharp`
  packages          = [ pkgs.nodejs_22 ];
};
```

## 8.8 Run one tool without any config

```bash
nix run nixpkgs#cowsay -- "one-off"          # run once
nix shell nixpkgs#httpie -c http example.com # tool for a single command
nix run nixpkgs#python312 -- -m http.server 8000   # quick static file server
```

---

# Part 9 - direnv: the environment loads when you `cd`

This is the biggest day-to-day usability win.

```bash
# Install direnv + nix-direnv (faster, caches the environment)
nix profile install nixpkgs#direnv nixpkgs#nix-direnv
# [NixOS] instead set: programs.direnv.enable = true;
#                      programs.direnv.nix-direnv.enable = true;

# Hook direnv into your shell (bash shown; zsh: `direnv hook zsh`)
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc

# Enable nix-direnv
mkdir -p ~/.config/direnv
echo 'source $HOME/.nix-profile/share/nix-direnv/direnvrc' >> ~/.config/direnv/direnvrc

# Per project
cd myproject
echo "use flake" > .envrc            # for shell.nix projects use: use nix
direnv allow                         # approve this .envrc once
echo ".direnv/" >> .gitignore

# Now: cd into the folder => tools appear, cd out => tools disappear
node --version

# VS Code: install the "direnv" extension so the editor sees the same PATH
```

The onboarding story for a new student or teammate becomes:

```bash
git clone <repo> && cd <repo>
direnv allow
# done: every tool is on PATH at the pinned versions
```

---

# Part 10 - Same environment in CI

```bash
# Run a command inside the dev shell and exit (no interactive shell)
nix develop --command pytest
nix develop --command npm test
nix develop .#devops --command kubectl version --client
```

```yaml
# .github/workflows/test.yml
name: test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Installs Nix with flakes enabled
      - uses: DeterminateSystems/nix-installer-action@main

      # Caches /nix/store between runs
      - uses: DeterminateSystems/magic-nix-cache-action@main

      # Same toolchain as local development, pinned by flake.lock
      - run: nix flake check
      - run: nix develop --command pytest
```

If CI passes, it passes with exactly the versions developers use locally.

---

# Part 11 - Flakes are more than dev shells

```text
flake.nix
   |-- devShells            nix develop
   |-- packages             nix build
   |-- apps                 nix run
   |-- checks               nix flake check
   |-- formatter            nix fmt
   `-- nixosConfigurations  nixos-rebuild --flake
```

## 11.1 Package your app

```nix
# in outputs, next to devShells
packages.${system}.default = pkgs.writeShellApplication {
  name = "hello-app";
  runtimeInputs = [ pkgs.curl pkgs.jq ];
  text = ''
    curl -s https://api.github.com/zen
  '';
};
```

```bash
nix build                  # result -> /nix/store/...-hello-app
./result/bin/hello-app
nix run                    # build + run in one step
```

## 11.2 Build a container image with Nix (great for a containerization course)

```text
app/
`-- main.py          print("hello from a Nix-built image")
```

```nix
# in outputs
packages.${system}.image =
  let
    # Copy the app source into the image under /app
    appSrc = pkgs.runCommand "app-src" {} ''
      mkdir -p $out/app
      cp ${./app}/main.py $out/app/main.py
    '';
  in
  pkgs.dockerTools.buildImage {
    name = "hello-app";
    tag = "latest";
    copyToRoot = pkgs.buildEnv {
      name = "image-root";
      paths = [ pkgs.python312 appSrc ];      # only what the app needs
      pathsToLink = [ "/bin" "/app" ];
    };
    config.Cmd = [ "python" "/app/main.py" ];
  };
```

```bash
git add app flake.nix
nix build .#image                 # produces ./result (an image tarball)
docker load < result              # import into Docker
docker run --rm hello-app:latest  # expected: hello from a Nix-built image

# Compare with a Dockerfile build
docker images hello-app           # size
nix path-info -Sh .#image         # closure size
```

Discussion points for students: no base-image OS, no `apt`, bit-for-bit reproducible layers, tiny attack surface.

---

# Part 12 - Start from templates

```bash
# Generate a starter flake in the current directory
nix flake init -t templates#utils-generic

# Inspect what any flake offers
nix flake show
nix flake show github:NixOS/templates

# Validate before committing
nix flake check
```

---

# Part 13 - [NixOS] Flakes for the whole system

```text
Nix
|-- Packages
|-- Development environments  (nix-shell, shell.nix, flakes)
`-- NixOS                     (operating-system configuration)
```

On NixOS one flake can describe everything:

```nix
{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

  outputs = { self, nixpkgs }: {

    # The machine itself
    nixosConfigurations.my-machine = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [ ./configuration.nix ];
    };

    # Dev shells, packages, etc. live in the same file
    # devShells.x86_64-linux.default = ...;
  };
}
```

```bash
sudo nixos-rebuild switch --flake .#my-machine
```

Things that only work or are only needed on NixOS: `nixosConfigurations`, `virtualisation.docker.enable`, `programs.direnv.enable`, and `programs.nix-ld.enable` (lets unpatched binaries such as downloaded wheels or IDE-bundled tools run).

---

# Part 14 - Common errors

```bash
# 1) error: experimental Nix feature 'flakes' is disabled
#    -> enable flakes (Part 0.2 / 0.3)

# 2) error: path '/nix/store/...-source/flake.nix' does not exist
#    Cause: flakes ignore files git does not know about
git add flake.nix        # and any other new file the flake references
nix develop

# 3) error: ... has an unfree license ('unfreeRedistributable'/'unfree'), refusing to evaluate
#    One-off:
NIXPKGS_ALLOW_UNFREE=1 nix develop --impure
#    Permanent, inside flake.nix:
#      pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };

# 4) nix develop puts me in bash instead of zsh/fish
nix develop -c $SHELL

# 5) error: attribute 'python312Packages' missing / package not found
nix search nixpkgs python        # names change between nixpkgs releases

# 6) My change to flake.nix is ignored
git add flake.nix                # staged content is what Nix reads

# 7) A pip-installed wheel fails with libstdc++.so.6 / libz.so.1 not found
#    -> use the Nix package (ps.numpy) or set LD_LIBRARY_PATH (Part 4.1)
#    -> [NixOS] programs.nix-ld.enable = true;

# 8) Disk is filling up
nix-collect-garbage -d           # delete unreferenced store paths
nix store gc                     # newer equivalent

# 9) Everything is slow the first time
#    Normal: Nix is downloading binaries. Second run is instant.
#    If it is BUILDING from source, the pinned nixpkgs may be too new/old for the cache:
#    check you are on a release branch and that `nix flake update` finished.

# 10) Debug what a shell actually contains
nix develop --command bash -c 'echo $PATH | tr ":" "\n"'
```

---

# Part 15 - Cheat sheet: old vs new commands

```text
Task                          Old (nix-*)               New (nix ...)
----------------------------  ------------------------  -----------------------------
Temporary shell with tools    nix-shell -p git          nix shell nixpkgs#git
Run a program once            nix-shell -p x --run x    nix run nixpkgs#x
Project dev shell             nix-shell                 nix develop
Run a command in dev shell    nix-shell --run "cmd"     nix develop --command cmd
Build a package               nix-build                 nix build
Update dependencies           nix-channel --update      nix flake update
Garbage collect               nix-collect-garbage -d    nix store gc
Search packages               nix-env -qaP              nix search nixpkgs foo
Config file                   shell.nix / default.nix   flake.nix + flake.lock
```

```text
Works on any OS with Nix:     everything in Parts 0-12, 14, 15
NixOS-specific:               Part 13, Docker daemon, nix-ld, programs.direnv.enable
```

---

# Part 16 - Learning path and lab repository

## Stages

```bash
# Stage 1: Nix packages
nix search nixpkgs foo ; nix shell ; nix run ; nix profile list

# Stage 2: temporary environments
nix shell nixpkgs#python312 nixpkgs#nodejs_22 nixpkgs#git nixpkgs#jq

# Stage 3: shell.nix + mkShell + packages + shellHook + variables
# Stage 4: real project environments (Python, Node, Go, Rust, C/C++, DB, Kubernetes)
# Stage 5: flakes
nix develop ; nix flake update ; nix flake check
# Stage 6: multiple environments
nix develop .#python ; nix develop .#node ; nix develop .#devops
# Stage 7: direnv + CI
# Stage 8: builds and containers
nix build ; nix run
# Stage 9: NixOS + flakes
sudo nixos-rebuild switch --flake .#my-machine
```

## One repository that teaches everything

```text
nix-learning-lab/
|-- 00-setup/          install + enable flakes + `nix run nixpkgs#hello`
|-- 01-temporary/      nix shell exercises
|-- 02-shell-nix/      shell.nix, shellHook, variables
|-- 03-python/         shell.nix, main.py, venv with uv
|-- 04-node/           shell.nix, package.json
|-- 05-rust/           shell.nix, Cargo.toml
|-- 06-database/       Postgres-in-project shell
|-- 07-devops/         kubectl, helm, kind, k9s
|-- 08-flake/          flake.nix, flake.lock
|-- 09-multi-env/      forAllSystems, default/frontend/backend/devops
|-- 10-direnv-ci/      .envrc, GitHub Actions workflow
|-- 11-container/      dockerTools image vs Dockerfile
`-- 12-nixos/          flake.nix, configuration.nix
```

Each folder should evolve from the previous one and include a `README.md` with the commands, the **expected output**, and a 2-3 line exercise.

## The key conceptual transition

It is **not** "shell.nix to flakes". It is:

> **"I manually install tools" -> "I declare the environment" -> "I pin the environment" -> "I can build and deploy the same declaration."**