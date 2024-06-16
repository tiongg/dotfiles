#!/usr/bin/env bash

# Updates stuff after changing the theme
echo "Settings up " + $THEME + " mode..."

# Update colors
# wal -i $HOME/.config/wallpaper/$THEME/main.png --saturate 0.7
wal --theme ~/.config/wal/colorschemes/$THEME/custom-$THEME.json

# Updates sddm
# Theme + Background
SSDM_THEME="sugar-candy"
sudo cp ~/.config/sddm/theme-$THEME.conf /usr/share/sddm/themes/$SSDM_THEME/theme.conf
sudo cp ~/.config/wallpaper/$THEME/login.png /usr/share/sddm/themes/$SSDM_THEME/Backgrounds/1.png

echo "Done, restart hyprland"
echo "TODO: Make it so I don't"