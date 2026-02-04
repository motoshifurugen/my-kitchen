/**
 * Error Messages Utility
 *
 * User-friendly error messages following the microcopy guidelines.
 * Messages are designed to be:
 * - Non-blaming
 * - Non-rushing
 * - Not over-explaining
 * - Free of technical terms
 *
 * @see docs/ux/phase-1/06-microcopy.md §エラーメッセージ
 */

/**
 * Error message types
 */
export type ErrorMessageType = 'save' | 'load' | 'photoAccess';

/**
 * Get error message for Alert.alert
 * Returns an object with title and message for Alert.alert(title, message)
 */
export const getErrorMessage = (
  type: ErrorMessageType
): { title: string; message: string } => {
  switch (type) {
    case 'save':
      return {
        title: '保存できませんでした。',
        message: 'もう一度お試しください。',
      };
    case 'load':
      return {
        title: '読み込めませんでした。',
        message: '少し待ってから、\nもう一度お試しください。',
      };
    case 'photoAccess':
      return {
        title: '写真にアクセスできませんでした。',
        message: '設定から許可をご確認ください。',
      };
    default:
      return {
        title: 'エラーが発生しました。',
        message: 'もう一度お試しください。',
      };
  }
};

/**
 * Show error alert using Alert.alert
 * Convenience function that uses getErrorMessage internally
 */
export const showErrorAlert = (type: ErrorMessageType): void => {
  const { title, message } = getErrorMessage(type);
  // Note: Alert is imported in the calling component
  // This function returns the message parts for the caller to use
  // The caller should import Alert from 'react-native' and call Alert.alert(title, message)
};

