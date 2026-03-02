export const notifyPartner = async (senderId, title, message, url = '/gifts') => {
    try {
        const response = await fetch('/api/send_push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ senderId, title, message, url })
        });

        if (!response.ok) {
            console.warn('Push API response:', response.status, '(Es normal si estás en local sin Vercel Dev)');
        }
    } catch (error) {
        console.error('Network error triggering push:', error);
    }
};
