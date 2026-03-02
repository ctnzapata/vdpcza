import { supabase } from '../supabaseClient';

export const TimeCapsuleRepository = {
    /**
     * Gets all time capsules ordered by unlock date.
     */
    async getCapsules() {
        const { data, error } = await supabase
            .from('capsules')
            .select('*')
            .order('unlock_date', { ascending: true });

        if (error) {
            console.error("Error fetching capsules:", error);
            return [];
        }

        return data || [];
    }
};
