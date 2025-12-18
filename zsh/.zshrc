# Add deno completions to search path
if [[ ":$FPATH:" != *":/home/tiong/.zsh/completions:"* ]]; then export FPATH="/home/tiong/.zsh/completions:$FPATH"; fi
# Path
path+=('/home/tiong/.local')
path+=('/home/tiong/.cargo/bin')

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

# Fly stuff
export FLYCTL_INSTALL="/home/tiong/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

. "/home/tiong/.deno/env"
## [Completion]
## Completion scripts setup. Remove the following line to uninstall
[[ -f /home/tiong/.dart-cli-completion/zsh-config.zsh ]] && . /home/tiong/.dart-cli-completion/zsh-config.zsh || true
## [/Completion]

# Java autocomplete for some reason
complete -o default java
