# Path
path+=('/home/tiong/.local')

export path

# Extra files
source ~/.config/zsh/.zsh_aliases

# Oh my posh
eval "$(oh-my-posh init zsh --config ~/.config/zsh/M365Princess.omp.json)"

# Zoxide
eval "$(zoxide init zsh --cmd cd)"

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Remove EOL mark 
# https://unix.stackexchange.com/questions/167582/why-zsh-ends-a-line-with-a-highlighted-percent-symbol
#PROMPT_EOL_MARK=

