import React from 'react';
import { StyleSheet, View, ActivityIndicator, Platform, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

const WebViewScreen = () => {
    const route = useRoute<any>();
    const { title } = route.params || { title: 'Page' };

    // Placeholder content for "Coming Soon"
    const comingSoonHtml = `
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f8f9fa;
                        color: #333;
                        text-align: center;
                        padding: 20px;
                    }
                    h1 { color: #5856D6; margin-bottom: 10px; }
                    p { font-size: 18px; color: #666; }
                    .footer { margin-top: 30px; font-size: 14px; color: #999; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Coming Soon!</p>
                <div>We are working hard to bring you this content. Stay tuned!</div>
                <div class="footer">&copy; 2026 Business App</div>
            </body>
        </html>
    `;

    if (Platform.OS === 'web') {
        return (
            <View style={styles.webContainer}>
                <Text style={styles.webTitle}>{title}</Text>
                <Text style={styles.webText}>Coming Soon!</Text>
                <Text style={styles.webSubText}>
                    We are working hard to bring you this content. Stay tuned!
                </Text>
                <Text style={styles.webFooter}>&copy; 2026 Business App</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ html: comingSoonHtml }}
                style={styles.webview}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#5856D6" />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    webContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    webTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#5856D6',
        marginBottom: 10,
    },
    webText: {
        fontSize: 24,
        color: '#333',
        marginBottom: 10,
    },
    webSubText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    webFooter: {
        marginTop: 30,
        fontSize: 14,
        color: '#999',
    },
});

export default WebViewScreen;
