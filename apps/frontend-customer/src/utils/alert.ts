import { Alert, Platform } from 'react-native';

export type AlertButton = {
    text?: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
};

const customAlert = (title: string, message?: string, buttons?: AlertButton[]) => {
    if (Platform.OS === 'web') {
        if (buttons && buttons.length > 0) {
            // Filter for the first non-cancel button as the "confirm" action
            const confirmButton = buttons.find((b) => b.style !== 'cancel') || buttons[0];
            const cancelButton = buttons.find((b) => b.style === 'cancel');

            const confirmed = window.confirm(`${title}${message ? `\n\n${message}` : ''}`);

            if (confirmed) {
                if (confirmButton.onPress) confirmButton.onPress();
            } else {
                if (cancelButton && cancelButton.onPress) cancelButton.onPress();
            }
        } else {
            window.alert(`${title}${message ? `\n\n${message}` : ''}`);
        }
    } else {
        Alert.alert(title, message, buttons as any);
    }
};

export default customAlert;
