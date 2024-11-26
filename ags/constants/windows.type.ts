export enum Windows {
  /**
   * Calandar menu.
   *
   * Used by bar to show dropdown calandar.
   */
  CALANDAR = 'time-menu',

  /**
   * Notifications control center
   *
   * Used to show Notifications
   */
  NOTIFICATIONS_CENTER = 'notifications-menu',

  /**
   * Notifications popup
   *
   * Used to display popups when notifications are sent
   */
  NOTIFICATIONS_POPUP = 'notification-popups',

  /**
   * Control center
   *
   * General control center for managing system settings
   */
  CONTROL_CENTER = 'control-center',

  /**
   * Application launcher
   *
   * Used to search and launch applications, similar to wofi
   */
  APPLICATION_LAUNCHER = 'application-launcher',
}
