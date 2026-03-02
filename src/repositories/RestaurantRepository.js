import { supabase } from '../supabaseClient';

export const RestaurantRepository = {
    /**
     * Gets all restaurants.
     */
    async getRestaurants() {
        const { data, error } = await supabase.from('restaurants').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching restaurants:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Creates a new restaurant record.
     * @param {Object} restaurantData 
     */
    async createRestaurant(restaurantData) {
        const { error } = await supabase.from('restaurants').insert([restaurantData]);
        if (error) throw error;
    },

    /**
     * Updates an existing restaurant record.
     * @param {string} id 
     * @param {Object} restaurantData 
     */
    async updateRestaurant(id, restaurantData) {
        const { error } = await supabase.from('restaurants').update(restaurantData).eq('id', id);
        if (error) throw error;
    },

    /**
     * Deletes a restaurant record.
     * @param {string} id 
     */
    async deleteRestaurant(id) {
        const { error } = await supabase.from('restaurants').delete().eq('id', id);
        if (error) throw error;
    },

    /**
     * Fetch all reviews for a specific restaurant.
     * @param {string} restaurantId 
     */
    async getReviews(restaurantId) {
        const { data, error } = await supabase.from('restaurant_reviews').select('*').eq('restaurant_id', restaurantId).order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Adds a review to a restaurant.
     * @param {Object} reviewData 
     */
    async addReview(reviewData) {
        const { error } = await supabase.from('restaurant_reviews').insert([reviewData]);
        if (error) throw error;
    },

    /**
     * Deletes a review.
     * @param {string} id 
     */
    async deleteReview(id) {
        const { error } = await supabase.from('restaurant_reviews').delete().eq('id', id);
        if (error) throw error;
    }
};
