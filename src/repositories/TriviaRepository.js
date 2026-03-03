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
    },

    /**
     * Retrieves all trivia questions (Admin only).
     */
    async getAllQuestions() {
        try {
            const { data, error } = await supabase.from('trivia_questions').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching all trivia questions:", error);
            throw error;
        }
    },

    /**
     * Creates a new trivia question.
     */
    async createQuestion(questionData) {
        try {
            const { data, error } = await supabase.from('trivia_questions').insert([questionData]).select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error creating trivia question:", error);
            throw error;
        }
    },

    /**
     * Updates an existing trivia question.
     */
    async updateQuestion(id, questionData) {
        try {
            const { data, error } = await supabase.from('trivia_questions').update(questionData).eq('id', id).select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error updating trivia question:", error);
            throw error;
        }
    },

    /**
     * Deletes a trivia question.
     */
    async deleteQuestion(id) {
        try {
            const { error } = await supabase.from('trivia_questions').delete().eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error deleting trivia question:", error);
            throw error;
        }
    }
};
