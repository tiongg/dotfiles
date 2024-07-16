## References
https://github.com/sameemul-haque/dotfiles
https://github.com/zDyanTB/HyprNova/tree/master
https://github.com/cenunix/dotfiles-old/blob/main/dot_config/eww/fool_moon/menu/time-menu/time-menu.yuck

## Packages
1. Hyprland - Tiling manager
2. Waybar - Status bar
3. Kitty - Terminal
4. Zsh - Shell
5. Hyprlock - Lock screen

## Managers
1. Wireplumber/Pipewire - Audio manager
2. Rofi - Window manager
3. Dolphin - File manager
4. Yay - Package manager
5. Hypridle - Idle manager
6. Hyprpaper - Wallpaper manager
7. SDDM - Login display manager

## Utils
1. Hyprshot - Screenshot tool
2. pywal - Generate colors from wallpaper
3. sddm-sugar-dark - SDDM theme

## Random notes:
Remember to symlink zsh config!!
Set sddm theme here: /usr/lib/sddm/sddm.conf.d/default.conf
Send notification: notify-send 'Ryan Katto' 'Eh prod die' -i telegram -a org.telegram.desktop -u normal -c im.received -t 9999999

Ags: ags -b hypr
Open menu: ags -b hypr -r "App.toggleWindow('time-menu');" 
Currently symlinking esbuild to /usr/bin in order for auto start to work
If css is not loaded, run:
`ags -b hypr -q | ags -b hypr &`
Icons: https://github.com/GNOME/gtk/blob/main/demos/icon-browser/icon.list

## TODO:
BTOP

Ags:
- Scroll left/right to adjust volume