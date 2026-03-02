import { supabase } from '../supabaseClient';

export const BucketListRepository = {
    /**
     * Gets all bucket list items ordered by creation date.
     * @returns {Promise<Array>} Array of bucket list items.
     */
    async getItems() {
        const { data, error } = await supabase.from('bucket_list').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching bucket list items:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Creates a new bucket list item.
     * @param {Object} item - The new item details ({title, description}).
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    async createItem(item) {
        const { error } = await supabase.from('bucket_list').insert([item]);
        if (error) {
            console.error("Error creating bucket list item:", error);
            return false;
        }
        return true;
    },

    /**
     * Toggles the completion status of a bucket list item.
     * @param {string} id - The ID of the item.
     * @param {boolean} newStatus - The new completion status.
     * @returns {Promise<boolean>} True if successful.
     */
    async updateStatus(id, newStatus) {
        const { error } = await supabase.from('bucket_list').update({ is_completed: newStatus }).eq('id', id);
        if (error) {
            console.error("Error updating bucket list status:", error);
            return false;
        }
        return true;
    },

    /**
     * Deletes a bucket list item.
     * @param {string} id - The ID of the item to delete.
     * @returns {Promise<boolean>} True if successful.
     */
    async deleteItem(id) {
        const { error } = await supabase.from('bucket_list').delete().eq('id', id);
        if (error) {
            console.error("Error deleting bucket list item:", error);
            return false;
        }
        return true;
    }
};
