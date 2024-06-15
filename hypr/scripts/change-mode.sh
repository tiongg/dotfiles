#!/usr/bin/env bash

# Updates stuff after changing the theme
echo "Settings up " + $THEME + " mode..."

# Update colors
wal --theme ~/.config/wal/colorschemes/$THEME/custom-$THEME.json

# Updates sddm
# Theme + Background
SSDM_THEME="sugar-candy"
sudo cp ~/.config/sddm/theme-$THEME.conf /usr/share/sddm/themes/$SSDM_THEME/theme.conf
sudo cp ~/.config/wallpaper/$THEME/login.png /usr/share/sddm/themes/$SSDM_THEME/Backgrounds/1.png

## Used to have different imgs for different schemes
# if [[ "$THEME" == "light" ]]; then
#   echo "Setting up light mode..."

#   # Colors
#   # wal -i $HOME/.config/wallpaper/light/login.png --saturate 0.7
#   wal --theme ~/.config/wal/colorschemes/light/custom-light.json
# else
#   echo "Setting up dark mode..."
#   # wal -i $HOME/.config/wallpaper/dark/main.png --saturate 0.7
#   wal --theme ~/.config/wal/colorschemes/dark/custom-dark.json
# fi

echo "Done, restart hyprland"
echo "TODO: Make it so I don't"