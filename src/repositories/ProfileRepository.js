import { supabase } from '../supabaseClient';

export const ProfileRepository = {
    /**
     * Gets public profile by user ID.
     */
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.error("Error fetching profile:", error);
            return null;
        }

        return data;
    },

    /**
     * Updates an existing profile.
     */
    async updateProfile(userId, profileData) {
        const { error } = await supabase
            .from('profiles')
            .update({
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) throw error;
    },

    /**
     * Upload avatar image and update profile.
     */
    async uploadAvatar(userId, file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('memories') // Reusing memories bucket as setup indicates
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('memories')
            .getPublicUrl(filePath);

        await this.updateProfile(userId, { avatar_url: publicUrl });
        return publicUrl;
    }
};
