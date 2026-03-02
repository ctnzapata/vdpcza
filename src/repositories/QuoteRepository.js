import { supabase } from '../supabaseClient';

export const QuoteRepository = {
    /**
     * Retrieves a random daily quote from the database.
     * Implements early return on error.
     * @returns {Promise<{text: string, author: string} | null>}
     */
    async getRandomQuote() {
        const { data, error } = await supabase.from('quotes').select('*');

        if (error) {
            console.error("Error fetching quotes from repository:", error);
            return null;
        }

        if (!data || data.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    }
};
