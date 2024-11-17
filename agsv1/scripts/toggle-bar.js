// Quick script to toggle bar(s)
// Needed for multiple monitors

import('gi://Gdk').then(({
  default: Gdk
}) => {
  const monitors = Gdk.Display.get_default()?.get_n_monitors() || 1;

  for(let i = 0; i < monitors; i++) {
    App.toggleWindow(`bar-${i}`);
  }
});