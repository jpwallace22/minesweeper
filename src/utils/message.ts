import { message as tauriMessage } from '@tauri-apps/api/dialog';

interface UseMessageProps {
  message: string;
  title?: string;
  isWeb: boolean;
}

export const message = ({ message, title, isWeb }: UseMessageProps) => {
  if (isWeb) {
    alert(`${title}
        
${message}`);
  } else {
    tauriMessage(message, title);
  }
};
