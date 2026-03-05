import { supabase } from '../supabaseClient';

export const MemoriesRepository = {
    /**
     * Retrieves all photo albums.
     */
    async getAlbums() {
        const { data, error } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching albums:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Retrieves memories (photos) specific to an album.
     * @param {string} albumId
     */
    async getMemoriesByAlbum(albumId) {
        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .eq('album_id', albumId)
            .order('date', { ascending: false });

        if (error) {
            console.error("Error fetching memories:", error);
            return [];
        }
        return data || [];
    },

    /**
     * Creates a new album.
     * @param {string} name 
     */
    async createAlbum(name) {
        const { data, error } = await supabase
            .from('albums')
            .insert([{ name }])
            .select();

        if (error) {
            throw error;
        }
        return data ? data[0] : null;
    },

    /**
     * Uploads a file to Supabase storage.
     * @param {string} filePath 
     * @param {File} file 
     */
    async uploadMemoryFile(filePath, file) {
        const { error } = await supabase.storage
            .from('memories')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('memories')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    /**
     * Inserts memory metadata into the database.
     */
    async insertMemoryMetadata(publicUrl, albumId) {
        const { error } = await supabase
            .from('memories')
            .insert([{
                image_url: publicUrl,
                date: new Date().toISOString(),
                description: '',
                album_id: albumId
            }]);

        if (error) throw error;
    },

    /**
     * Updates an album's cover image.
     */
    async updateAlbumCover(albumId, coverUrl) {
        const { error } = await supabase
            .from('albums')
            .update({ cover_image_url: coverUrl })
            .eq('id', albumId);

        if (error) throw error;
    },

    /**
     * Updates an album's name.
     */
    async updateAlbumName(albumId, newName) {
        const { error } = await supabase
            .from('albums')
            .update({ name: newName })
            .eq('id', albumId);

        if (error) throw error;
    },

    /**
     * Deletes a memory from DB and Storage.
     * @param {string} memoryId
     * @param {string} imageUrl
     */
    async deleteMemory(memoryId, imageUrl) {
        // Delete from Storage
        if (imageUrl) {
            try {
                const imagePath = imageUrl.split('/memories/')[1];
                if (imagePath) {
                    const { error: storageError } = await supabase.storage
                        .from('memories')
                        .remove([imagePath]);
                    if (storageError) console.error("Error deleting from storage:", storageError);
                }
            } catch (e) {
                console.error("Error extracting image path:", e);
            }
        }

        // Delete from DB
        const { error: dbError } = await supabase
            .from('memories')
            .delete()
            .eq('id', memoryId);

        if (dbError) throw dbError;
    },

    /**
     * Deletes an album and all its associated memories.
     * @param {string} albumId
     */
    async deleteAlbum(albumId) {
        // First get all memories to delete from storage
        const memories = await this.getMemoriesByAlbum(albumId);
        const imagePaths = memories.map(m => {
            try {
                return m.image_url.split('/memories/')[1];
            } catch (e) {
                return null;
            }
        }).filter(Boolean);

        if (imagePaths.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('memories')
                .remove(imagePaths);
            if (storageError) console.error("Error deleting album files from storage:", storageError);
        }

        // Delete memories from DB (just in case cascade isn't on)
        await supabase.from('memories').delete().eq('album_id', albumId);

        // Delete album from DB
        const { error: dbError } = await supabase
            .from('albums')
            .delete()
            .eq('id', albumId);

        if (dbError) throw dbError;
    }
};
