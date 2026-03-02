import { supabase } from '../supabaseClient';

export const GiftRepository = {
    /**
     * Gets all gifts ordered by creation date.
     */
    async getGifts() {
        const { data, error } = await supabase.from('gifts').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching gifts:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Obtains the list of all gift IDs existing in the database.
     * Useful for checking unseen gifts notifications.
     */
    async getAllGiftIds() {
        const { data, error } = await supabase.from('gifts').select('id');

        if (error) {
            console.error("Error fetching gift IDs from repository:", error);
            return [];
        }

        return data || [];
    },

    /**
     * Creates a new gift.
     */
    async createGift(giftData) {
        const { error } = await supabase.from('gifts').insert([giftData]);
        if (error) throw error;
    },

    /**
     * Updates a gift.
     */
    async updateGift(id, giftData) {
        const { error } = await supabase.from('gifts').update(giftData).eq('id', id);
        if (error) throw error;
    },

    /**
     * Toggles lock on a gift.
     */
    async toggleLock(id, currentStatus) {
        const { error } = await supabase.from('gifts').update({ is_received: !currentStatus }).eq('id', id);
        if (error) throw error;
    },

    /**
     * Deletes a gift.
     */
    async deleteGift(id) {
        const { error } = await supabase.from('gifts').delete().eq('id', id);
        if (error) throw error;
    },

    /**
     * Checks how many unseen gifts the user currently has.
     * Temporary logic that relies on localStorage.
     * @returns {Promise<number>} Number of unseen gifts.
     */
    async getUnseenGiftsCount() {
        const gifts = await this.getAllGiftIds();

        if (!gifts.length) return 0;

        const unseenGifts = gifts.filter(gift => {
            return !localStorage.getItem(`vdpcza_seen_${gift.id}`);
        });

        return unseenGifts.length;
    },

    /**
     * Subscribes to real-time changes on the 'gifts' table.
     * @param {Function} callback - Function to run when a change occurs.
     * @returns {Object} The subscription channel to allow unsubscribing.
     */
    subscribeToGifts(callback) {
        return supabase
            .channel('gifts-nav-global')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'gifts' }, callback)
            .subscribe();
    }
};
