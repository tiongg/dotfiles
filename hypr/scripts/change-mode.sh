#!/usr/bin/env bash

if [[ "$THEME" == "light" ]]; then
  echo "Setting up light mode..."
  wal -i $HOME/.config/wallpaper/light/login.png --saturate 0.7
  
else
  echo "Setting up dark mode..."
  wal -i $HOME/.config/wallpaper/dark/main.png --saturate 0.7
fi

echo "Done, restart hyprland"
echo "TODO: Make it so I don't"