import { supabase } from '../supabaseClient';

export const TravelRepository = {
    /**
     * Retrieves all trips ordered by start_date ascending.
     * @returns {Promise<Array>} List of trips.
     */
    async getTrips() {
        const { data, error } = await supabase.from('trips').select('*').order('start_date', { ascending: true });

        if (error) {
            console.error("Error fetching trips:", error);
            return [];
        }

        return data || [];
    },

    /**
     * Retrieves travels sorted by order.
     */
    async getTravels() {
        const { data, error } = await supabase
            .from('travels')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Creates a new travel.
     */
    async createTravel(travelData) {
        const { error } = await supabase.from('travels').insert([travelData]);
        if (error) throw error;
    },

    /**
     * Toggles lock on a travel.
     */
    async toggleTravelLock(id, currentStatus) {
        const { error } = await supabase.from('travels').update({ unlocked: !currentStatus }).eq('id', id);
        if (error) throw error;
    },

    /**
     * Real-time subscription to travels table.
     */
    subscribeToTravels(callback) {
        return supabase
            .channel('public:travels')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'travels' }, callback)
            .subscribe();
    }
};
