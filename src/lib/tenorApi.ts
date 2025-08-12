// Tenor API integration for educational GIFs
import { supabase } from './supabase';

const TENOR_API_KEY = import.meta.env.VITE_TENOR_API_KEY || 'AIzaSyAyimkuYQhD-LHXDX-5NcEab8sC7TqJBFU'; // Demo key
const TENOR_BASE_URL = 'https://tenor.googleapis.com/v2';

export interface TenorGif {
  id: string;
  title: string;
  media_formats: {
    gif: {
      url: string;
      dims: [number, number];
      size: number;
    };
    tinygif: {
      url: string;
      dims: [number, number];
      size: number;
    };
  };
  content_description: string;
  tags: string[];
}

export interface GifUsageRecord {
  id: string;
  user_id: string;
  date: string;
  count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Check daily GIF usage limit for user (max 3 per day)
 */
export const checkGifUsageLimit = async (userId: string): Promise<{ canUse: boolean; usageCount: number }> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: usage, error } = await supabase
      .from('gif_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking GIF usage:', error);
      return { canUse: false, usageCount: 0 };
    }

    const currentCount = usage?.count || 0;
    return {
      canUse: currentCount < 3,
      usageCount: currentCount
    };
  } catch (error) {
    console.error('Exception checking GIF usage:', error);
    return { canUse: false, usageCount: 0 };
  }
};

/**
 * Update daily GIF usage count
 */
export const updateGifUsage = async (userId: string): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existing, error: fetchError } = await supabase
      .from('gif_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching GIF usage:', fetchError);
      return;
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('gif_usage')
        .update({ 
          count: existing.count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating GIF usage:', updateError);
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('gif_usage')
        .insert({
          user_id: userId,
          date: today,
          count: 1
        });

      if (insertError) {
        console.error('Error inserting GIF usage:', insertError);
      }
    }
  } catch (error) {
    console.error('Exception updating GIF usage:', error);
  }
};

/**
 * Search for educational GIFs using Tenor API
 */
export const searchEducationalGifs = async (
  query: string,
  subject: string,
  limit: number = 3
): Promise<TenorGif[]> => {
  try {
    // Sanitize and enhance query for educational content
    const educationalQuery = sanitizeQuery(query, subject);
    
    const url = new URL(`${TENOR_BASE_URL}/search`);
    url.searchParams.append('key', TENOR_API_KEY);
    url.searchParams.append('q', educationalQuery);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('media_filter', 'gif,tinygif');
    url.searchParams.append('contentfilter', 'high'); // High content filtering
    url.searchParams.append('ar_range', 'standard'); // Standard aspect ratio
    url.searchParams.append('locale', 'pt_BR');

    console.log('🔍 Searching Tenor for:', educationalQuery);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Tenor API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log('⚠️ No GIFs found for query:', educationalQuery);
      return [];
    }

    // Filter and validate GIFs
    const filteredGifs = data.results
      .filter((gif: any) => isEducationalContent(gif, subject))
      .slice(0, limit)
      .map((gif: any) => ({
        id: gif.id,
        title: gif.title || gif.content_description || 'Educational GIF',
        media_formats: {
          gif: {
            url: gif.media_formats?.gif?.url || '',
            dims: gif.media_formats?.gif?.dims || [300, 200],
            size: gif.media_formats?.gif?.size || 0
          },
          tinygif: {
            url: gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url || '',
            dims: gif.media_formats?.tinygif?.dims || gif.media_formats?.gif?.dims || [150, 100],
            size: gif.media_formats?.tinygif?.size || 0
          }
        },
        content_description: gif.content_description || gif.title || '',
        tags: gif.tags || []
      }));

    console.log(`✅ Found ${filteredGifs.length} educational GIFs`);
    return filteredGifs;

  } catch (error) {
    console.error('❌ Error searching Tenor GIFs:', error);
    return [];
  }
};

/**
 * Sanitize query to ensure educational and safe content
 */
const sanitizeQuery = (query: string, subject: string): string => {
  // Remove potentially inappropriate terms
  const inappropriateTerms = [
    'sex', 'sexy', 'violence', 'violent', 'fight', 'blood', 'kill', 'death',
    'nude', 'naked', 'adult', 'porn', 'explicit', 'inappropriate'
  ];

  let sanitizedQuery = query.toLowerCase();
  
  inappropriateTerms.forEach(term => {
    sanitizedQuery = sanitizedQuery.replace(new RegExp(term, 'gi'), '');
  });

  // Add educational context
  const educationalTerms = {
    'Matemática': 'mathematics education learning study',
    'Física': 'physics science education learning',
    'Química': 'chemistry science education learning',
    'Biologia': 'biology science education learning',
    'História': 'history education learning study',
    'Literatura': 'literature education learning study',
    'Português': 'portuguese language education learning',
    'Filosofia': 'philosophy education learning study'
  };

  const subjectTerms = educationalTerms[subject as keyof typeof educationalTerms] || 'education learning';
  
  return `${sanitizedQuery} ${subjectTerms} educational animated explanation`.trim();
};

/**
 * Validate if GIF content is appropriate for educational use
 */
const isEducationalContent = (gif: any, subject: string): boolean => {
  const title = (gif.title || '').toLowerCase();
  const description = (gif.content_description || '').toLowerCase();
  const tags = (gif.tags || []).join(' ').toLowerCase();
  
  const content = `${title} ${description} ${tags}`;

  // Block inappropriate content
  const blockedTerms = [
    'sex', 'sexy', 'violence', 'violent', 'fight', 'blood', 'kill', 'death',
    'nude', 'naked', 'adult', 'porn', 'explicit', 'inappropriate', 'nsfw',
    'drug', 'alcohol', 'beer', 'wine', 'smoking', 'cigarette'
  ];

  const hasInappropriateContent = blockedTerms.some(term => 
    content.includes(term)
  );

  if (hasInappropriateContent) {
    console.log('🚫 Blocked inappropriate GIF:', title);
    return false;
  }

  // Prefer educational content
  const educationalTerms = [
    'education', 'learning', 'study', 'school', 'science', 'math', 'physics',
    'chemistry', 'biology', 'history', 'literature', 'language', 'philosophy',
    'explain', 'demonstration', 'example', 'concept', 'theory', 'formula'
  ];

  const hasEducationalContent = educationalTerms.some(term => 
    content.includes(term)
  );

  return hasEducationalContent || content.length > 0; // Allow if educational or has basic content
};

/**
 * Get GIF usage statistics for admin
 */
export const getGifUsageStats = async (): Promise<{
  totalUsage: number;
  dailyUsage: number;
  topUsers: Array<{ user_id: string; count: number }>;
}> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get total usage
    const { data: totalData, error: totalError } = await supabase
      .from('gif_usage')
      .select('count');

    if (totalError) {
      console.error('Error fetching total GIF usage:', totalError);
      return { totalUsage: 0, dailyUsage: 0, topUsers: [] };
    }

    const totalUsage = totalData?.reduce((sum, record) => sum + record.count, 0) || 0;

    // Get daily usage
    const { data: dailyData, error: dailyError } = await supabase
      .from('gif_usage')
      .select('count')
      .eq('date', today);

    if (dailyError) {
      console.error('Error fetching daily GIF usage:', dailyError);
    }

    const dailyUsage = dailyData?.reduce((sum, record) => sum + record.count, 0) || 0;

    // Get top users (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const { data: topUsersData, error: topUsersError } = await supabase
      .from('gif_usage')
      .select('user_id, count')
      .gte('date', weekAgoStr)
      .order('count', { ascending: false })
      .limit(5);

    if (topUsersError) {
      console.error('Error fetching top GIF users:', topUsersError);
    }

    const topUsers = topUsersData || [];

    return {
      totalUsage,
      dailyUsage,
      topUsers
    };
  } catch (error) {
    console.error('Exception getting GIF usage stats:', error);
    return { totalUsage: 0, dailyUsage: 0, topUsers: [] };
  }
};

/**
 * Test Tenor API connection
 */
export const testTenorConnection = async (): Promise<boolean> => {
  try {
    const url = new URL(`${TENOR_BASE_URL}/search`);
    url.searchParams.append('key', TENOR_API_KEY);
    url.searchParams.append('q', 'test');
    url.searchParams.append('limit', '1');

    const response = await fetch(url.toString());
    return response.ok;
  } catch (error) {
    console.error('Tenor API connection test failed:', error);
    return false;
  }
};

/**
 * Get Tenor API status for debugging
 */
export const getTenorStatus = () => {
  return {
    hasApiKey: !!TENOR_API_KEY && TENOR_API_KEY !== 'your-tenor-api-key',
    apiKey: TENOR_API_KEY ? `${TENOR_API_KEY.substring(0, 10)}...` : 'Not configured',
    baseUrl: TENOR_BASE_URL
  };
};