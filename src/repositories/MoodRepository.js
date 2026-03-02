import { supabase } from '../supabaseClient';

export const MoodRepository = {
    /**
     * Retrieves the latest moods.
     */
    async getLatestMoods() {
        const { data, error } = await supabase
            .from('moods')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching moods:', error);
            return [];
        }
        return data || [];
    },

    /**
     * Subscribes to real-time mood inserts.
     * @param {string} userId 
     * @param {Function} onNewMood 
     */
    subscribeToMoods(userId, onNewMood) {
        return supabase
            .channel('moods_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'moods' }, payload => {
                onNewMood(payload.new);
            })
            .subscribe();
    },

    /**
     * Saves a new mood entry.
     * @param {string} userId 
     * @param {string} type 
     */
    async insertMood(userId, type) {
        const { error } = await supabase
            .from('moods')
            .insert([{ user_id: userId, mood: type }]);

        if (error) throw error;
    }
};
