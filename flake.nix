{
  description = "ACM FEUP web and API development tools";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShellNoCC {
          packages = with pkgs; [
            nodejs_24
            # Corepack reads packageManager from package.json, including the
            # pnpm version. Do not also install nixpkgs' independent pnpm.
            corepack_24
            git
            docker-client
            postgresql_18
          ];

          COREPACK_ENABLE_DOWNLOAD_PROMPT = "0";
        };
      });
}
