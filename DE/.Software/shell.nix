{ pkgs ? import <nixpkgs> {} }:
# { pkgs ? import (fetchTarball  "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11") {} }:
let
  message = "Lets Start Development";
in 
pkgs.mkShellNoCC {
  buildInputs = with pkgs; [ cowsay python3 python3Packages.pip pipenv];

  packages = with pkgs; [
    (python3.withPackages (ps: [ps.numpy ps.matplotlib ps.tensorflow ps.jupyterlab ps.openpyxl ps.pandas]))
    vim 
    curl     
    vscodium 
    firefox 
    cinnamon.nemo
  ];

  shellHook = ''
    cowsay ${message}
    # nemo . & codium . & jupyter-lab
    echo "y" | codium . & jupyter-lab'';
}