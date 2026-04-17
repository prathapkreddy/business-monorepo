/**
 * WebViewScreen.tsx
 *
 * Cross-platform full-screen content screen:
 *  • iOS / Android  → react-native-webview renders the HTML directly
 *  • Web            → Native RN ScrollView renders equivalent JSX
 *                     (no iframe / WebView dependency needed on web)
 *
 * Navigator setup (stack presented as modal so tab bar is hidden):
 *   <Stack.Screen
 *     name="WebView"
 *     component={WebViewScreen}
 *     options={{ headerShown: false, presentation: 'modal' }}
 *   />
 */

import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import content from './webViewContent.json';

// react-native-webview is only used on native; avoid the import on web
// to prevent bundler errors when the package isn't installed for web.
let WebView: React.ComponentType<any> | null = null;
if (Platform.OS !== 'web') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    WebView = require('react-native-webview').WebView;
}

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (kept in sync with the HTML CSS vars)
// ─────────────────────────────────────────────────────────────────────────────
const C = {
    bg: '#fafaf8',
    surface: '#ffffff',
    text: '#1a1a18',
    muted: '#6b6b67',
    accent: '#2d6a4f',
    accentLight: '#d8f3e8',
    border: '#e8e8e4',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// HTML for native WebView (iOS + Android)
// ─────────────────────────────────────────────────────────────────────────────
const buildHtml = (body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#fafaf8;--surface:#fff;--text:#1a1a18;--muted:#6b6b67;
      --accent:#2d6a4f;--al:#d8f3e8;--border:#e8e8e4;
      --serif:'DM Serif Display',Georgia,serif;
      --sans:'DM Sans',system-ui,sans-serif;
    }
    html{background:var(--bg)}
    body{
      font-family:var(--sans);color:var(--text);background:var(--bg);
      padding:32px 24px 72px;max-width:640px;margin:0 auto;
      font-size:15px;line-height:1.7;
      animation:up .4s ease both;
    }
    @keyframes up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    .hero{margin-bottom:36px;padding-bottom:28px;border-bottom:1px solid var(--border)}
    .eyebrow{font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
    h1{font-family:var(--serif);font-size:clamp(26px,6vw,36px);line-height:1.15;margin-bottom:14px}
    .sub{font-size:15px;color:var(--muted);line-height:1.65}
    .tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
    .tag{font-size:13px;font-weight:500;color:var(--accent);background:var(--al);padding:5px 12px;border-radius:100px}
    section{margin-bottom:32px}
    h2{font-family:var(--serif);font-size:20px;margin-bottom:10px}
    p{color:var(--muted);margin-bottom:10px}p:last-child{margin-bottom:0}
    ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:8px}
    ul li{display:flex;align-items:flex-start;gap:10px;color:var(--muted)}
    ul li::before{content:'✓';color:var(--accent);font-weight:700;flex-shrink:0;margin-top:1px}
    ol{padding:0;counter-reset:s;display:flex;flex-direction:column;gap:24px}
    ol>li{list-style:none;counter-increment:s;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px}
    ol>li h3{font-family:var(--serif);font-size:17px;margin-bottom:8px;display:flex;align-items:center;gap:10px}
    ol>li h3::before{content:counter(s,decimal-leading-zero);font-family:var(--sans);font-size:11px;font-weight:500;color:var(--accent);background:var(--al);padding:3px 8px;border-radius:100px;flex-shrink:0}
    ol>li p,ol>li ul li{color:var(--muted);font-size:14px}
    ol>li ul{margin-top:8px;gap:6px}
    ol>li ul li::before{content:'·';font-size:18px;line-height:1}
    .card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px;display:flex;align-items:center;gap:14px;margin-top:12px}
    .card-icon{font-size:22px}
    .card-lbl{font-size:12px;color:var(--muted);margin-bottom:2px}
    .card-val{font-weight:500;color:var(--accent);font-size:14px}
    .badge{display:inline-block;font-size:12px;color:var(--muted);background:var(--border);padding:4px 10px;border-radius:100px;margin-bottom:20px}
    strong{color:var(--text)}
  </style>
</head>
<body>${body}</body>
</html>`;

const ABOUT_HTML = buildHtml(`
  <div class="hero">
    <div class="eyebrow">${content.about.eyebrow}</div>
    <h1>${content.about.title}</h1>
    <p class="sub">${content.about.sub}</p>
    <div class="tags">
      ${content.about.tags.map((tag) => `<span class="tag">${tag}</span>`).join('\n      ')}
    </div>
  </div>
  ${content.about.sections
      .map(
          (s) => `
  <section>
    <h2>${s.title}</h2>
    ${s.content ? `<p>${s.content}</p>` : ''}
    ${s.items ? `<ul>${s.items.map((item) => `<li>${item}</li>`).join('\n      ')}</ul>` : ''}
  </section>`
      )
      .join('')}
`);

const PRIVACY_HTML = buildHtml(`
  <div class="hero">
    <div class="eyebrow">${content.privacy.eyebrow}</div>
    <h1>${content.privacy.title}</h1>
    <p class="sub">${content.privacy.sub}</p>
  </div>
  <span class="badge">${content.privacy.badge}</span>
  <ol>
    ${content.privacy.items
        .map(
            (item) => `
    <li>
      <h3>${item.title}</h3>
      ${item.content ? `<p>${item.content}</p>` : ''}
      ${item.highlight ? `<p><strong>${item.highlight}</strong></p>` : ''}
      ${item.bullets ? `<ul>${item.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>` : ''}
      ${
          item.card
              ? `
      <div class="card">
        <span class="card-icon">${item.card.icon}</span>
        <div><div class="card-lbl">${item.card.label}</div><div class="card-val">${item.card.value}</div></div>
      </div>`
              : ''
      }
    </li>`
        )
        .join('')}
  </ol>
`);

// ─────────────────────────────────────────────────────────────────────────────
// Web-platform native render  (no WebView / iframe needed)
// ─────────────────────────────────────────────────────────────────────────────
const Tag = ({ label }: { label: string }) => (
    <View className="py-1.25 rounded-full bg-[#d8f3e8] px-3">
        <Text className="text-[13px] font-medium text-[#2d6a4f]">{label}</Text>
    </View>
);

const CheckItem = ({ text }: { text: string }) => (
    <View className="mb-1.5 flex-row items-start gap-2.5">
        <Text className="mt-0.5 text-sm font-bold text-[#2d6a4f]">✓</Text>
        <Text className="flex-1 text-[15px] leading-6 text-[#6b6b67]">{text}</Text>
    </View>
);

const BulletList = ({ items }: { items: string[] }) => (
    <View className="mt-2 gap-1.5">
        {items.map((item) => (
            <View key={item} className="mb-1.5 flex-row items-start gap-2.5">
                <Text className="mt-0.5 text-lg font-bold leading-5 text-[#6b6b67]">·</Text>
                <Text className="flex-1 text-sm leading-6 text-[#6b6b67]">{item}</Text>
            </View>
        ))}
    </View>
);

const PrivacyItem = ({
    num,
    title,
    children,
}: {
    num: string;
    title: string;
    children: React.ReactNode;
}) => (
    <View className="rounded-[12px] border border-[#e8e8e4] bg-white p-5">
        <View className="mb-2 flex-row items-center gap-2.5">
            <View className="rounded-full bg-[#d8f3e8] px-2 py-[3px]">
                <Text className="text-[11px] font-medium text-[#2d6a4f]">{num}</Text>
            </View>
            <Text className="flex-1 text-[17px] font-normal text-[#1a1a18]">{title}</Text>
        </View>
        {children}
    </View>
);

const WebAboutUs = () => (
    <ScrollView
        className="flex-1 bg-[#fafaf8]"
        style={{ flex: 1 }}
        contentContainerStyle={{
            padding: 24,
            paddingBottom: 64,
            maxWidth: 640,
            alignSelf: 'center',
            width: '100%',
            flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
    >
        <View className="mb-9 border-b border-[#e8e8e4] pb-7">
            <Text className="mb-3 text-[11px] font-medium uppercase tracking-[1.5px] text-[#2d6a4f]">
                {content.about.eyebrow}
            </Text>
            <Text className="mb-3.5 text-[32px] font-normal leading-[38px] text-[#1a1a18]">
                {content.about.title}
            </Text>
            <Text className="text-[15px] leading-[26px] text-[#6b6b67]">{content.about.sub}</Text>
            <View className="mt-3.5 flex-row flex-wrap gap-2">
                {content.about.tags.map((t) => (
                    <Tag key={t} label={t} />
                ))}
            </View>
        </View>

        {content.about.sections.map((s, idx) => (
            <View
                key={idx}
                className={`mb-8 ${idx === content.about.sections.length - 1 ? 'mb-0' : ''}`}
            >
                <Text className="mb-2.5 text-xl font-normal text-[#1a1a18]">{s.title}</Text>
                {s.content && (
                    <Text className="text-[15px] leading-[26px] text-[#6b6b67]">{s.content}</Text>
                )}
                {s.items && s.items.map((item) => <CheckItem key={item} text={item} />)}
            </View>
        ))}
    </ScrollView>
);

const WebPrivacyPolicy = () => (
    <ScrollView
        className="flex-1 bg-[#fafaf8]"
        style={{ flex: 1 }}
        contentContainerStyle={{
            padding: 24,
            paddingBottom: 64,
            maxWidth: 640,
            alignSelf: 'center',
            width: '100%',
            flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
    >
        <View className="mb-9 border-b border-[#e8e8e4] pb-7">
            <Text className="mb-3 text-[11px] font-medium uppercase tracking-[1.5px] text-[#2d6a4f]">
                {content.privacy.eyebrow}
            </Text>
            <Text className="mb-3.5 text-[32px] font-normal leading-[38px] text-[#1a1a18]">
                {content.privacy.title}
            </Text>
            <Text className="text-[15px] leading-[26px] text-[#6b6b67]">{content.privacy.sub}</Text>
        </View>

        <View className="mb-5 self-start rounded-full bg-[#e8e8e4] px-2.5 py-1">
            <Text className="text-xs text-[#6b6b67]">{content.privacy.badge}</Text>
        </View>

        <View className="gap-4">
            {content.privacy.items.map((item) => (
                <PrivacyItem key={item.num} num={item.num} title={item.title}>
                    {item.content && (
                        <Text className="text-sm leading-[22px] text-[#6b6b67]">
                            {item.content}
                        </Text>
                    )}
                    {item.highlight && (
                        <Text className="text-sm font-medium leading-[22px] text-[#1a1a18]">
                            {item.highlight}
                        </Text>
                    )}
                    {item.bullets && <BulletList items={item.bullets} />}
                    {item.card && (
                        <View className="mt-3.5 flex-row items-center gap-3.5 rounded-[12px] border border-[#e8e8e4] bg-white p-4">
                            <Text style={{ fontSize: 22 }}>{item.card.icon}</Text>
                            <View>
                                <Text className="mb-0.5 text-xs text-[#6b6b67]">
                                    {item.card.label}
                                </Text>
                                <Text className="text-sm font-medium text-[#2d6a4f]">
                                    {item.card.value}
                                </Text>
                            </View>
                        </View>
                    )}
                </PrivacyItem>
            ))}
        </View>
    </ScrollView>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
const WebViewScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { title } = route.params || { title: 'Page' };

    const handleClose = useCallback(() => navigation.goBack(), [navigation]);

    const htmlContent =
        title === 'About Us' ? ABOUT_HTML : title === 'Privacy Policy' ? PRIVACY_HTML : undefined;

    // ── Shared header ────────────────────────────────────────────────────────
    const Header = (
        <View
            className="flex-row items-center justify-between border-b border-[#e8e8e4] bg-[#fafaf8] px-5 pb-3.5"
            style={{ paddingTop: insets.top > 0 ? insets.top + 8 : 16 }}
        >
            <Text className="text-[15px] font-semibold tracking-tight text-[#1a1a18]">{title}</Text>
            <TouchableOpacity
                className="h-8 w-8 items-center justify-center rounded-full bg-[#f0f0ec]"
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Close"
                accessibilityRole="button"
            >
                <Text className="text-[13px] font-semibold color-[#6b6b67]">✕</Text>
            </TouchableOpacity>
        </View>
    );

    // ── Web ──────────────────────────────────────────────────────────────────
    if (Platform.OS === 'web') {
        const WebContent =
            title === 'About Us' ? (
                <WebAboutUs />
            ) : title === 'Privacy Policy' ? (
                <WebPrivacyPolicy />
            ) : null;

        return (
            <View className="flex-1 bg-[#fafaf8]">
                {Header}
                {WebContent ?? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-base text-[#6b6b67]">Coming Soon</Text>
                    </View>
                )}
            </View>
        );
    }

    // ── iOS / Android ────────────────────────────────────────────────────────
    const fallbackHtml = `<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:system-ui;color:#999;background:#fafaf8">Coming Soon</body></html>`;

    return (
        <View className="flex-1 bg-[#fafaf8]">
            {Header}
            {WebView ? (
                <WebView
                    source={{ html: htmlContent ?? fallbackHtml }}
                    className="flex-1 bg-[#fafaf8]"
                    startInLoadingState
                    renderLoading={() => (
                        <View className="absolute inset-0 items-center justify-center bg-[#fafaf8]">
                            <ActivityIndicator size="large" color="#2d6a4f" />
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    bounces={false}
                />
            ) : null}
        </View>
    );
};

export default WebViewScreen;
