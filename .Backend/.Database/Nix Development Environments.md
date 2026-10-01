# Nix Development Environments: From `nix-shell` to Flakes

A hands-on, incremental guide. Every stage ends with a short exercise and the output you should expect to see.

> **NixOS is not required.** Everything in Parts 0-10 works on Ubuntu, Debian, Fedora, macOS and WSL once Nix is installed. NixOS-only material is marked **[NixOS]**.

## How to use this tutorial

```text
CORE PATH (do these in order)
  Part 0   Setup
  Part 1   Why Nix
  Part 2   The Nix language        types, functions, evaluation, with/inherit
  Part 3   Temporary shells        nix shell / nix-shell -p
  Part 4   shell.nix
  Part 5   Language environments   Python, Node, Go, Rust, C/C++
  Part 6   Variables and hooks
  Part 7   Your first flake        flake.nix + flake.lock
  Part 8   Multiple environments in one repo

EXTENSIONS (pick what you need)
  Part 9   Common real-world use cases
  Part 10   direnv (auto-activation)
  Part 11  CI
  Part 12  Packages and container images
  Part 13  Templates
  Part 14  NixOS integration
  Part 15  Common errors
  Part 16  Cheat sheet
  Part 17  Learning path and lab repo
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

# Part 2 - The Nix language

Before writing shells, learn to read the language they are written in. `shell.nix`, `flake.nix` and even NixOS configurations are all just Nix expressions. Thirty minutes here makes every later part easier.

```text
Nix the language is:
  small            a handful of types, one kind of function
  functional       you describe values; you never "run steps"
  pure             same inputs => same output, no hidden state
  lazy             things are only computed when something needs them
  dynamically typed  types are checked when evaluated, not before
```

The key idea: **a Nix file is one expression, and evaluating it produces one value.** There are no statements, no loops and no reassignment of variables.

```text
shell.nix  --evaluates to-->  a derivation (a description of a shell)
flake.nix  --evaluates to-->  an attribute set (devShells, packages, ...)
1 + 2      --evaluates to-->  3
```

## 2.1 How to evaluate things (try everything as you read)

```bash
# Evaluate a single expression
nix eval --expr '1 + 2'
# 3

nix eval --expr '"hello"'
# "hello"

nix eval --raw --expr '"hello"'          # --raw prints strings without quotes
# hello

nix eval --json --expr '{ a = 1; b = [ 1 2 ]; }'
# {"a":1,"b":[1,2]}

# Evaluate a file
echo '1 + 2' > test.nix
nix eval --file test.nix
# 3
nix-instantiate --eval test.nix          # old-style equivalent

# The best way to learn: the REPL
nix repl
# nix-repl> 1 + 2
# 3
# nix-repl> builtins.typeOf 1
# "int"
# nix-repl> :?                           help
# nix-repl> :l ./test.nix                load a file
# nix-repl> :r                           reload what you loaded
# nix-repl> :p { a = { b = 1; }; }       print fully (not just { a = «thunk»; })
# nix-repl> :q                           quit
```

### Loading nixpkgs into the REPL

```bash
# With channels / <nixpkgs> available:
nix repl --expr 'import <nixpkgs> {}'
# nix-repl> hello.name
# "hello-2.12.x"

# Flake-style (no channel needed):
nix repl nixpkgs
# nix-repl> pkgs = legacyPackages.${builtins.currentSystem}
# nix-repl> pkgs.hello.name
# nix-repl> pkgs.lib.strings.toUpper "nix"
# "NIX"
```

> **Habit to build:** whenever you do not understand a piece of Nix, paste it into `nix repl` or `nix eval --expr` and see what value it produces.

## 2.2 Data types

```bash
nix repl
```

```nix
# --- Scalars ---------------------------------------------------
42                      # integer          builtins.typeOf -> "int"
3.14                    # float                              "float"
true  false             # booleans                           "bool"
null                    # nothing                            "null"
"hello"                 # string                             "string"
./shell.nix             # path (unquoted, relative to THIS file)  "path"

# --- Compound --------------------------------------------------
[ 1 "two" 3.0 ]         # list (elements separated by SPACES)     "list"
{ name = "nix"; v = 2; }  # attribute set (key = value;)          "set"

# --- Functions are values too ----------------------------------
x: x + 1                # a function                              "lambda"
```

```bash
# Check any value's type
nix eval --expr 'builtins.typeOf [ 1 2 ]'        # "list"
nix eval --expr 'builtins.typeOf { a = 1; }'     # "set"
nix eval --expr 'builtins.typeOf (x: x)'         # "lambda"
```

### Operators

```nix
# Arithmetic
1 + 2          # 3
7 / 2          # 3     (integer division)
7.0 / 2        # 3.5
# NOTE: write spaces around `/`. `a/b` (no spaces) is parsed as a PATH.

# Comparison and logic
1 == 1         # true
1 != 2         # true
3 < 4          # true
true && false  # false
true || false  # true
!true          # false

# Strings and lists
"foo" + "bar"          # "foobar"
[ 1 2 ] ++ [ 3 ]       # [ 1 2 3 ]

# Attribute sets
{ a = 1; b = 2; } // { b = 3; c = 4; }   # { a = 1; b = 3; c = 4; }   (right side wins)
{ a = 1; } ? a                           # true   (does attribute `a` exist?)
{ a = 1; }.b or 0                        # 0      (default if missing)

# No implicit conversion
"n=" + 1                 # ERROR
"n=" + toString 1        # "n=1"
```

### Strings in detail

```nix
# Normal strings, with interpolation using ${ ... }
let name = "Yash"; in "Hello ${name}"                # "Hello Yash"
let n = 3; in "count: ${toString n}"                 # "count: 3"

# Multi-line strings use two single quotes; common indentation is stripped
''
  line one
  line two
''
# "line one\nline two\n"

# Inside shellHook the text is BASH, but ${...} is still NIX interpolation.
shellHook = ''
  echo "Node is ${pkgs.nodejs_22}"     # Nix substitutes the store path
  echo "Home is $HOME"                  # $HOME (no braces) is left for bash
  echo "Literal: ''${HOME}"             # ''${ ... } produces a literal ${HOME} for bash
'';
```

### Paths

```nix
./app                  # a path relative to the file that contains it
../other/dir
<nixpkgs>              # looked up via NIX_PATH (channels); avoided in flakes

# Putting a path inside a string copies it into the Nix store:
"${./app}"             # "/nix/store/<hash>-app"
# This is why flakes only see git-tracked files: the flake is copied into the store.
```

### Lists: the classic gotcha

```nix
[ 1 2 3 ]                    # three elements; NO commas

[ pkgs.git pkgs.curl ]       # two packages: fine

[ f 1 ]                      # TWO elements: the function f, and 1  (NOT f applied to 1)
[ (f 1) ]                    # ONE element: the result of calling f with 1

# This is why you will see parentheses in dev shells:
packages = [
  (pkgs.python312.withPackages (ps: [ ps.requests ]))   # a function call needs ( )
  pkgs.git
];
```

### Attribute sets (the most important type)

```nix
# Definition: every binding ends with a semicolon
{
  name = "demo";
  version = "1.0";
  tags = [ "a" "b" ];
  meta = { author = "Yash"; };
}

# Access
s.name                         # "demo"
s.meta.author                  # "Yash"

# Reference siblings with `rec`
rec { a = 1; b = a + 1; }      # { a = 1; b = 2; }

# Without rec, `a` would be undefined inside b.

# Quoted and dynamic names
{ "my-key" = 1; }              # names with special characters
{ ${"dyn" + "amic"} = 1; }     # { dynamic = 1; }   <- same idea as  devShells.${system}

# Inspect
builtins.attrNames { b = 1; a = 2; }    # [ "a" "b" ]
builtins.hasAttr "a" { a = 1; }         # true
removeAttrs { a = 1; b = 2; } [ "a" ]   # { b = 2; }
```

## 2.3 `let ... in`: local names

```nix
let
  x = 2;
  y = x * 3;      # later bindings can use earlier ones
in
  x + y           # 8

# Names live only inside the `in` body. They can shadow outer names.
```

```bash
nix eval --expr 'let x = 2; y = x * 3; in x + y'
# 8
```

Compare with the flake you will write later:

```nix
let
  system = "x86_64-linux";
  pkgs = import nixpkgs { inherit system; };
in
{
  devShells.${system}.default = pkgs.mkShell { packages = [ pkgs.git ]; };
}
```

## 2.4 Functions

Every Nix function takes **exactly one argument**. There are no parentheses or commas for calls: you just write the function, a space, then the argument.

```nix
# Define:  argument : body
x: x + 1

# Call:    function argument
(x: x + 1) 5            # 6

# Name it with let
let inc = x: x + 1; in inc 5      # 6
```

### Several arguments = functions returning functions (currying)

```nix
let add = a: b: a + b; in add 2 3          # 5

# `add 2 3` means `(add 2) 3`
let add = a: b: a + b;
    addTwo = add 2;                         # partially applied
in addTwo 10                                # 12
```

### Attribute-set arguments (what you see in almost every `.nix` file)

```nix
# A function whose single argument is an attribute set with named fields
{ a, b }: a + b

# Call it with a set:
({ a, b }: a + b) { a = 1; b = 2; }          # 3

# Default values with `?`
({ a, b ? 10 }: a + b) { a = 1; }            # 11

# `...` accepts extra fields you do not name
({ a, ... }: a) { a = 1; z = 99; }           # 1
# Without `...`, passing z would be an error: "unexpected argument 'z'"

# `@` binds the whole argument to a name too
(args@{ a, ... }: args.z) { a = 1; z = 99; } # 99
```

Now the first line of every `shell.nix` is readable:

```nix
{ pkgs ? import <nixpkgs> {} }:
#  ^        ^
#  |        default value if the caller does not pass `pkgs`
#  the argument is a set with one field named `pkgs`
pkgs.mkShell { ... }
```

And the flake's `outputs`:

```nix
outputs = { self, nixpkgs }: { ... };
# a function. Nix calls it with { self = <this flake>; nixpkgs = <input>; }

outputs = { self, nixpkgs, ... }@inputs: { ... };
# same, but accepts any number of inputs and also names the whole set `inputs`
```

### Function application rules

```nix
f x y            # (f x) y
f (g x)          # parentheses when the argument is itself a call
f x.y            # f (x.y): attribute access binds tighter than calling
f { a = 1; }     # a set literal is a single argument; no parentheses needed
```

## 2.5 Conditionals

`if` is an expression, so `else` is mandatory.

```nix
let n = 5; in if n > 3 then "big" else "small"       # "big"

# Common in flakes: choose a package per platform
packages = [ pkgs.git ] ++ (if pkgs.stdenv.isDarwin then [ pkgs.libiconv ] else [ ]);

# Same idea, shorter, using lib
packages = [ pkgs.git ] ++ pkgs.lib.optionals pkgs.stdenv.isDarwin [ pkgs.libiconv ];
```

## 2.6 Built-ins and `lib`

```nix
# Always available (no prefix needed):
map (x: x * 2) [ 1 2 3 ]                  # [ 2 4 6 ]
toString 42                               # "42"
import ./file.nix                         # evaluate another file, return its value
throw "something is wrong"                # abort with an error
removeAttrs { a = 1; b = 2; } [ "a" ]     # { b = 2; }

# Available under `builtins.`:
builtins.filter (x: x > 1) [ 1 2 3 ]      # [ 2 3 ]
builtins.length [ 1 2 3 ]                 # 3
builtins.elem 2 [ 1 2 3 ]                 # true
builtins.attrNames { a = 1; b = 2; }      # [ "a" "b" ]
builtins.readFile ./README.md             # file contents as a string
builtins.currentSystem                    # "x86_64-linux" (impure; only in non-pure eval)

# Many more helpers live in nixpkgs' `lib`  (pkgs.lib or nixpkgs.lib)
lib.genAttrs [ "x86_64-linux" "aarch64-linux" ] (system: "env for ${system}")
# { aarch64-linux = "env for aarch64-linux"; x86_64-linux = "env for x86_64-linux"; }
#   ^ this is exactly the trick behind `forAllSystems` in Part 8
lib.optionals true [ "a" ]                # [ "a" ]
lib.strings.toUpper "nix"                 # "NIX"
```

## 2.7 `import`: reading other files

```nix
# import FILE  evaluates FILE and returns whatever it evaluates to
import ./math.nix              # if math.nix contains  x: x * 2  you get a function
(import ./math.nix) 4          # 8

# Now decode the line from shell.nix:
import <nixpkgs> {}
#  1. `import <nixpkgs>`  evaluates nixpkgs' top-level file. That file is a FUNCTION.
#  2. `{}` is the argument we call it with (an empty set = "all defaults").
#  3. The result is the big attribute set of all packages, which we name `pkgs`.

# And in flakes:
import nixpkgs { inherit system; }
#  same idea, but `nixpkgs` is the pinned input and we pass { system = system; }
```

## 2.8 Writing the same thing in a shorter way

Experienced Nix authors rarely write the long form. Learn the shorthands so you can read their code, and so you know when the long form is clearer.

### `inherit`: copy names from the current scope

```nix
# Long
{ system = system; pkgs = pkgs; }
# Short
{ inherit system pkgs; }

# From another set:
{ git = pkgs.git; curl = pkgs.curl; }
# Short
{ inherit (pkgs) git curl; }

# In flakes you constantly see:
import nixpkgs { inherit system; }        # = import nixpkgs { system = system; }
```

### `with`: bring a set's names into scope

```nix
# Long
packages = [ pkgs.git pkgs.curl pkgs.jq pkgs.ripgrep ];
# Short
packages = with pkgs; [ git curl jq ripgrep ];
```

Trade-offs: `with` is very readable for package lists, but editors cannot tell where a name came from, and it is easy to shadow names by accident (names from `let` and function arguments take priority over `with`). Prefer it for short lists, avoid it for big files.

### Nested attribute paths

```nix
# Long
{
  devShells = {
    x86_64-linux = {
      default = pkgs.mkShell { };
    };
  };
}

# Short: a dotted path creates the nesting
{
  devShells.x86_64-linux.default = pkgs.mkShell { };
}

# Dynamic part with ${ }
{
  devShells.${system}.default = pkgs.mkShell { };
}

# Several bindings that share a prefix merge into one set
{
  devShells.${system}.default  = pkgs.mkShell { packages = [ pkgs.git ]; };
  devShells.${system}.frontend = pkgs.mkShell { packages = [ pkgs.nodejs_22 ]; };
}
```

### Function shorthands

```nix
# Long: a function taking a set, using .field access
args: args.pkgs.mkShell { packages = [ args.pkgs.git ]; }
# Short: pattern in the argument
{ pkgs }: pkgs.mkShell { packages = [ pkgs.git ]; }

# Long: nested one-argument functions
a: b: c: a + b + c
# That IS the short form; call it as  f 1 2 3

# Pass a function without naming it
map (p: p.name) [ pkgs.git pkgs.curl ]       # [ "git-2.x" "curl-8.x" ]
```

### Avoid repetition with `genAttrs` and `map`

```nix
# Long
{
  x86_64-linux  = mkEnv "x86_64-linux";
  aarch64-linux = mkEnv "aarch64-linux";
}
# Short
nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" ] mkEnv

# Long
[ (f 1) (f 2) (f 3) ]
# Short
map f [ 1 2 3 ]
```

### Cheat sheet

```text
Long form                                  Short form
-----------------------------------------  -----------------------------------
{ a = a; b = b; }                          { inherit a b; }
{ a = s.a; b = s.b; }                      { inherit (s) a b; }
[ pkgs.x pkgs.y pkgs.z ]                   with pkgs; [ x y z ]
{ a = { b = { c = 1; }; }; }               { a.b.c = 1; }
args: args.x + args.y                      { x, y }: x + y
f (a) (b)                                  f a b
[ (f 1) (f 2) ]                            map f [ 1 2 ]
{ s1 = g "s1"; s2 = g "s2"; }              lib.genAttrs [ "s1" "s2" ] g
builtins.map f xs                          map f xs
"a" + toString n + "b"                     "a${toString n}b"
if c then [ x ] else [ ]                   lib.optionals c [ x ]
```

## 2.9 Laziness

Nix only computes a value when something actually uses it.

```bash
nix eval --expr 'let boom = throw "never evaluated"; in 42'
# 42

nix eval --expr '{ a = 1; b = throw "boom"; }.a'
# 1
```

This is why nixpkgs can contain tens of thousands of packages: `pkgs.git` only evaluates the `git` definition, not the whole collection. It also explains why the REPL shows `«thunk»` (a not-yet-computed value); use `:p` to force it.

## 2.10 Evaluate versus build

```text
Nix expression --(evaluate)--> value / derivation --(build)--> files in /nix/store
```

A **derivation** is a build recipe: an attribute set that says "run this builder, with these inputs, to produce this output". Evaluating produces the recipe. Building runs it. `pkgs.mkShell` returns a derivation, and `nix develop` / `nix-shell` builds it and drops you into its environment.

```bash
# Evaluate only: cheap, nothing is built
nix eval nixpkgs#hello.name
# "hello-2.12.x"

nix eval nixpkgs#hello.drvPath               # path of the .drv recipe file
# "/nix/store/<hash>-hello-2.12.x.drv"

nix eval nixpkgs#hello.type
# "derivation"

# Build: realise the recipe into /nix/store (downloads from the cache if possible)
nix build nixpkgs#hello --no-link --print-out-paths
# /nix/store/<hash>-hello-2.12.x

# Inspect your own shell.nix without entering it
nix-instantiate --eval -E 'builtins.typeOf (import ./shell.nix)'    # "lambda"  (it is a function)
nix eval --impure --expr '(import ./shell.nix {}).name'             # "nix-shell"
```

## 2.11 Reading your first `shell.nix` as a language exercise

```nix
{ pkgs ? import <nixpkgs> {} }:       # function; argument is a set with default `pkgs`
                                      # default = call nixpkgs' function with {}
pkgs.mkShell {                        # call pkgs.mkShell with ONE argument: a set
  packages = [                        #   `packages` is a list
    pkgs.git                          #   attribute access: pkgs is a set, git is a field
    pkgs.curl
  ];
}                                     # the whole file evaluates to a derivation
```

The same file written the short way:

```nix
{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  packages = with pkgs; [ git curl ];
}
```

And as a function you can call yourself:

```bash
# Pass a different pkgs (for example a pinned one) from the command line
nix-shell --arg pkgs 'import <nixpkgs> { config.allowUnfree = true; }'
```

## 2.12 Common syntax and evaluation errors

```text
Message                                   Usual cause and fix
----------------------------------------  ------------------------------------------------
syntax error, unexpected '}'              missing `;` after the previous binding
syntax error, unexpected ','              commas in lists or sets; Nix uses spaces / semicolons
undefined variable 'pkgs'                 argument not declared, or `with` / `let` missing
attribute 'foo' missing                   typo, or package renamed; check with `nix search`
value is a function while a set was ...   forgot to call it: `import <nixpkgs>` needs `{}`
cannot coerce an integer to a string      use toString, or "${toString n}"
infinite recursion encountered            a binding refers to itself; try `rec` or restructure
function called with unexpected argument  add `...` to the pattern, or stop passing that field
```

```bash
# Get a full trace when an error is confusing
nix eval --show-trace --expr '...'
nix develop --show-trace
```

## 2.13 Exercises

```bash
nix repl
```

```nix
# 1. Predict, then check
[ 1 2 ] ++ [ 3 ]
{ a = 1; } // { a = 2; }
let f = x: y: x * y; in f 3 4
({ a, b ? 5 }: a + b) { a = 1; }
builtins.typeOf (x: x)

# 2. Rewrite the short way (use inherit / with / dotted paths):
{ git = pkgs.git; curl = pkgs.curl; jq = pkgs.jq; }
{ a = { b = { c = 1; d = 2; }; }; }

# 3. Fix the bug (hint: how many elements does this list have?)
[ pkgs.python312.withPackages (ps: [ ps.requests ]) pkgs.git ]

# 4. Write a function `mkEnv` that takes { name, tools } and returns
#    "Env <name> has <N> tools". Use builtins.length and toString.
#    expected: mkEnv { name = "web"; tools = [ "git" "curl" ]; }  =>  "Env web has 2 tools"
```

Answers for 4: `mkEnv = { name, tools }: "Env ${name} has ${toString (builtins.length tools)} tools";`

---

# Part 3 - Temporary environments

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

# Part 4 - `shell.nix`: put the environment in the repo

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

## Same file, shorter

Now that you know the language (Part 2), you can write the list with `with`:

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # with pkgs; => write git instead of pkgs.git
  packages = with pkgs; [ git curl jq ];
}
```

> **Exercise:** add `ripgrep` to the list, re-run `nix-shell`, and confirm `rg --version` works.

---

# Part 5 - Language environments

Each example is a complete `shell.nix`. Run `nix-shell` in the folder.

## 5.1 Python (idiomatic: `withPackages`)

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

## 5.2 Node.js

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

## 5.3 Go

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

## 5.4 Rust

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

(Need an exact Rust version or extra targets? See Part 9.5.)

## 5.5 C/C++ (and `buildInputs` vs `nativeBuildInputs`)

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

# Part 6 - Environment variables and shell hooks

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

# Part 7 - Your first flake

## 7.1 The weakness of `shell.nix`

```nix
{ pkgs ? import <nixpkgs> {} }:     # WHICH nixpkgs?
```

`<nixpkgs>` depends on each machine's channel configuration. Developer A and Developer B can silently get different package versions. Flakes fix this by **pinning** the exact revision.

```text
flake.nix   (you write)    "I want nixpkgs from this branch"
flake.lock  (Nix writes)   "...specifically THIS commit"
        => everyone gets the same dependency graph
```

## 7.2 A minimal flake

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
      system = "x86_64-linux";   # see Part 8.2 for multi-platform
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

## 7.3 Reading the flake

(Every piece here is covered in Part 2: `outputs` is a function with a set argument, `let ... in` defines local names, `inherit system` is shorthand for `system = system`, and `${system}` is a dynamic attribute name.)

```nix
inputs  = { nixpkgs.url = "..."; };        # what the project depends on
outputs = { self, nixpkgs }: { ... };      # what the project provides
devShells.${system}.default                # the shell `nix develop` enters
```

## 7.4 Updating dependencies

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

# Part 8 - Multiple environments and platforms

## 8.1 Several shells in one repository

```bash
nix develop                # default
nix develop .#frontend     # named shell
nix develop .#backend
```

## 8.2 Supporting several CPU architectures

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

> `legacyPackages` is the simplest approach. It does not allow unfree packages; see Part 15 if you need one.

## 8.3 Course-repository layout

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

# Part 9 - Common real-world use cases

Each block is the `devShells` entry for the `forAllSystems` flake from Part 8.2.

## 9.1 Backend with a project-local PostgreSQL

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

## 9.2 DevOps / Kubernetes

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

## 9.3 Infrastructure as code (OpenTofu, Ansible)

```nix
iac = pkgs.mkShell {
  packages = [
    pkgs.opentofu           # open-source Terraform fork
    pkgs.ansible
    pkgs.awscli2
    pkgs.git
  ];
  # Terraform itself is "unfree" (BSL license). See Part 15 if you need pkgs.terraform
};
```

## 9.4 Data science with Jupyter

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

## 9.5 Rust with a pinned toolchain (`rust-overlay`)

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

## 9.6 Java with Maven/Gradle (switching JDK versions)

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

## 9.7 Frontend with native Node modules (`node-gyp`)

```nix
frontend-native = pkgs.mkShell {
  nativeBuildInputs = [ pkgs.python3 pkgs.gcc pkgs.gnumake pkgs.pkg-config ];
  buildInputs       = [ pkgs.vips ];     # example: native lib needed by `sharp`
  packages          = [ pkgs.nodejs_22 ];
};
```

## 9.8 Run one tool without any config

```bash
nix run nixpkgs#cowsay -- "one-off"          # run once
nix shell nixpkgs#httpie -c http example.com # tool for a single command
nix run nixpkgs#python312 -- -m http.server 8000   # quick static file server
```

---

# Part 10 - direnv: the environment loads when you `cd`

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

# Part 11 - Same environment in CI

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

# Part 12 - Flakes are more than dev shells

```text
flake.nix
   |-- devShells            nix develop
   |-- packages             nix build
   |-- apps                 nix run
   |-- checks               nix flake check
   |-- formatter            nix fmt
   `-- nixosConfigurations  nixos-rebuild --flake
```

## 12.1 Package your app

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

## 12.2 Build a container image with Nix (great for a containerization course)

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

# Part 13 - Start from templates

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

# Part 14 - [NixOS] Flakes for the whole system

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

# Part 15 - Common errors

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
#    -> use the Nix package (ps.numpy) or set LD_LIBRARY_PATH (Part 5.1)
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

# Part 16 - Cheat sheet: old vs new commands

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
Works on any OS with Nix:     everything in Parts 0-13, 15, 16
NixOS-specific:               Part 14, Docker daemon, nix-ld, programs.direnv.enable
```

---

# Part 17 - Learning path and lab repository

## Stages

```bash
# Stage 1: Nix packages
nix search nixpkgs foo ; nix shell ; nix run ; nix profile list

# Stage 2: the Nix language
nix repl ; nix eval --expr '...'     # types, functions, attrsets, with/inherit

# Stage 3: temporary environments
nix shell nixpkgs#python312 nixpkgs#nodejs_22 nixpkgs#git nixpkgs#jq

# Stage 4: shell.nix + mkShell + packages + shellHook + variables
# Stage 5: real project environments (Python, Node, Go, Rust, C/C++, DB, Kubernetes)
# Stage 6: flakes
nix develop ; nix flake update ; nix flake check
# Stage 7: multiple environments
nix develop .#python ; nix develop .#node ; nix develop .#devops
# Stage 8: direnv + CI
# Stage 9: builds and containers
nix build ; nix run
# Stage 10: NixOS + flakes
sudo nixos-rebuild switch --flake .#my-machine
```

## One repository that teaches everything

```text
nix-learning-lab/
|-- 00-setup/          install + enable flakes + `nix run nixpkgs#hello`
|-- 01-language/       nix repl notebook: types, functions, with/inherit exercises
|-- 01b-temporary/     nix shell exercises
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