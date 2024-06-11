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
[ -z "$NVM_DIR" ] && export NVM_DIR="$HOME/.nvm"
source /usr/share/nvm/nvm.sh
source /usr/share/nvm/bash_completion
source /usr/share/nvm/install-nvm-exec

# Remove EOL mark 
# https://unix.stackexchange.com/questions/167582/why-zsh-ends-a-line-with-a-highlighted-percent-symbol
#PROMPT_EOL_MARK=

