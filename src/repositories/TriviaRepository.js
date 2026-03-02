import { supabase } from '../supabaseClient';

export const TriviaRepository = {
    /**
     * Retrieves the daily trivia question based on the current date.
     * @returns {Promise<Object|null>} The trivia question object or null if none found.
     */
    async getDailyQuestion() {
        try {
            const { data, error } = await supabase.from('trivia_questions').select('*');

            if (error) {
                console.error("Error fetching trivia questions:", error);
                return null;
            }

            if (data && data.length > 0) {
                const today = new Date().toDateString();
                const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % data.length;
                return data[index];
            }

            return null;
        } catch (error) {
            console.error("Unexpected error in TriviaRepository:", error);
            return null;
        }
    }
};
