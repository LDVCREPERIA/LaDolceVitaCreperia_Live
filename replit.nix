
{ pkgs }: {
    deps = [
        pkgs.zip
        pkgs.nodejs-18_x
        pkgs.nodePackages.vite
        pkgs.nodePackages.typescript
    ];
}
