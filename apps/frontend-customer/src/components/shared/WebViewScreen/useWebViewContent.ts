import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { contentApi } from '../../../api/contentApi';

export const useWebViewContent = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { title, serviceId, type } = route.params || { title: 'Page' };

    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchContent = useCallback(async () => {
        try {
            setLoading(true);
            let data;
            if (type === 'service' && serviceId) {
                data = await contentApi.getServiceDetails(serviceId);
            } else {
                const pageNameMap: { [key: string]: string } = {
                    'About Us': 'about',
                    'Terms of Service': 'terms',
                    'Privacy Policy': 'privacy',
                    'Refer & Earn': 'referral',
                };
                const pageName = pageNameMap[title] || 'privacy';
                data = await contentApi.getPageContent(pageName);
            }
            setPageData(data);
            setError(false);
        } catch (err) {
            console.error('Error fetching CMS content:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [title, serviceId, type]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const handleClose = useCallback(() => navigation.goBack(), [navigation]);

    return {
        title,
        pageData,
        loading,
        error,
        handleClose,
        navigation,
    };
};
