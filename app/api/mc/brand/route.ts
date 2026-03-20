import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

const CACHE_FILE = path.join(process.cwd(), 'data', 'brand-analysis.json');

// Brand configuration
const BRAND_CONFIG = {
  yippy: {
    website: 'https://yippypouches.com',
    instagram: 'yippypouches',
    twitter: 'yippypouches',
    tiktok: 'yippypouches',
    facebook: 'YippyPouches'
  },
  competitors: [
    { name: 'Ultra Pouches', website: 'https://takeultra.com/' },
    { name: 'NZE Pouches', website: 'https://www.nzepouches.com/' }
  ],
  admired: {
    name: 'Poppi',
    focus: 'Marketing reference - soda brand'
  }
};

// Helper: Fetch with timeout
async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Analyze website SEO and structure
async function analyzeWebsite(url: string) {
  try {
    const response = await fetchWithTimeout(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    const h1s = $('h1').map((_, el) => $(el).text().trim()).get();
    
    // SEO scoring (basic)
    let seoScore = 0;
    const issues: string[] = [];
    const strengths: string[] = [];

    if (title) {
      seoScore += 20;
      if (title.length > 30 && title.length < 60) {
        seoScore += 10;
        strengths.push('Title length is optimal (30-60 chars)');
      } else if (title.length < 30) {
        issues.push('Title is too short (< 30 chars)');
      } else {
        issues.push('Title is too long (> 60 chars)');
      }
    } else {
      issues.push('Missing page title');
    }

    if (description) {
      seoScore += 20;
      if (description.length > 120 && description.length < 160) {
        seoScore += 10;
        strengths.push('Meta description length is optimal (120-160 chars)');
      } else if (description.length < 120) {
        issues.push('Meta description is too short');
      } else {
        issues.push('Meta description is too long');
      }
    } else {
      issues.push('Missing meta description');
    }

    if (h1s.length === 1) {
      seoScore += 15;
      strengths.push('Single H1 tag (best practice)');
    } else if (h1s.length === 0) {
      issues.push('Missing H1 tag');
    } else {
      issues.push(`Multiple H1 tags found (${h1s.length})`);
      seoScore += 5;
    }

    // Check for structured data
    const hasSchema = $('script[type="application/ld+json"]').length > 0;
    if (hasSchema) {
      seoScore += 15;
      strengths.push('Structured data (Schema.org) present');
    } else {
      issues.push('No structured data found');
    }

    // Check for Open Graph tags
    const hasOG = $('meta[property^="og:"]').length > 0;
    if (hasOG) {
      seoScore += 10;
      strengths.push('Open Graph tags present');
    } else {
      issues.push('Missing Open Graph tags');
    }

    // Check images have alt text
    const images = $('img');
    const imagesWithAlt = $('img[alt]');
    if (images.length > 0) {
      const altPercentage = (imagesWithAlt.length / images.length) * 100;
      if (altPercentage > 90) {
        seoScore += 10;
        strengths.push('Most images have alt text');
      } else if (altPercentage < 50) {
        issues.push('Many images missing alt text');
      }
    }

    return {
      url,
      title,
      description,
      seoScore: Math.min(seoScore, 100),
      issues,
      strengths,
      h1s
    };
  } catch (error) {
    console.error(`Error analyzing website ${url}:`, error);
    return {
      url,
      title: '',
      description: '',
      seoScore: 0,
      issues: [`Failed to fetch website: ${error instanceof Error ? error.message : 'Unknown error'}`],
      strengths: []
    };
  }
}

// Scrape Instagram (basic public data)
async function scrapeInstagram(username: string) {
  try {
    const response = await fetchWithTimeout(`https://www.instagram.com/${username}/`, 8000);
    const html = await response.text();
    
    // Instagram embeds data in script tags
    const match = html.match(/"edge_followed_by":\{"count":(\d+)\}/);
    const followersMatch = match ? parseInt(match[1]) : 0;
    
    const postsMatch = html.match(/"edge_owner_to_timeline_media":\{"count":(\d+)\}/);
    const posts = postsMatch ? parseInt(postsMatch[1]) : 0;
    
    // Extract bio from meta tag
    const bioMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const bio = bioMatch ? bioMatch[1].split(' - ')[0] : '';

    return {
      followers: followersMatch,
      posts,
      bio,
      avgEngagement: 'Unknown (requires API)',
      postFrequency: posts > 0 ? 'Active' : 'Inactive'
    };
  } catch (error) {
    console.error(`Error scraping Instagram @${username}:`, error);
    return {
      followers: 0,
      posts: 0,
      bio: 'Unable to fetch',
      avgEngagement: 'Unknown',
      postFrequency: 'Unknown'
    };
  }
}

// Scrape Twitter/X
async function scrapeTwitter(username: string) {
  try {
    // Twitter now requires login for most data, but we can try the public API endpoint
    const response = await fetchWithTimeout(`https://twitter.com/${username}`, 8000);
    const html = await response.text();
    
    // Twitter data is often in JSON-LD
    const bioMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const bio = bioMatch ? bioMatch[1] : 'Unable to fetch';

    return {
      followers: 0, // Requires API or login
      tweets: 0,
      bio,
      note: 'Full data requires Twitter API access'
    };
  } catch (error) {
    console.error(`Error scraping Twitter @${username}:`, error);
    return {
      followers: 0,
      tweets: 0,
      bio: 'Unable to fetch',
      note: 'Scraping blocked or requires authentication'
    };
  }
}

// Scrape TikTok
async function scrapeTikTok(username: string) {
  try {
    const response = await fetchWithTimeout(`https://www.tiktok.com/@${username}`, 8000);
    const html = await response.text();
    
    // TikTok embeds data in script tags
    const followersMatch = html.match(/"followerCount":(\d+)/);
    const followers = followersMatch ? parseInt(followersMatch[1]) : 0;
    
    const likesMatch = html.match(/"heartCount":(\d+)/);
    const likes = likesMatch ? parseInt(likesMatch[1]) : 0;
    
    const bioMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const bio = bioMatch ? bioMatch[1] : '';

    return {
      followers,
      likes,
      bio
    };
  } catch (error) {
    console.error(`Error scraping TikTok @${username}:`, error);
    return {
      followers: 0,
      likes: 0,
      bio: 'Unable to fetch'
    };
  }
}

// Scrape Facebook
async function scrapeFacebook(pageName: string) {
  try {
    const response = await fetchWithTimeout(`https://www.facebook.com/${pageName}`, 8000);
    const html = await response.text();
    
    // Facebook blocks most scraping, but we can try to get basic info
    const bioMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const bio = bioMatch ? bioMatch[1] : 'Unable to fetch';

    return {
      followers: 0, // Requires API
      bio,
      note: 'Full data requires Facebook Graph API'
    };
  } catch (error) {
    console.error(`Error scraping Facebook ${pageName}:`, error);
    return {
      followers: 0,
      bio: 'Unable to fetch'
    };
  }
}

// Generate recommendations based on analysis
function generateRecommendations(data: any): any[] {
  const recommendations: any[] = [];

  // Website recommendations
  if (data.brand.website.seoScore < 70) {
    recommendations.push({
      category: 'seo',
      priority: 'high',
      title: 'Improve SEO Score',
      description: `Current SEO score is ${data.brand.website.seoScore}/100. Focus on fixing: ${data.brand.website.issues.slice(0, 3).join(', ')}`,
      effort: 'medium'
    });
  }

  if (data.brand.website.issues.includes('Missing meta description')) {
    recommendations.push({
      category: 'website',
      priority: 'high',
      title: 'Add Meta Description',
      description: 'Meta descriptions improve click-through rates from search results. Write a compelling 120-160 character description.',
      effort: 'quick-win'
    });
  }

  // Social media recommendations
  const igFollowers = data.brand.social.instagram.followers;
  const competitors = data.competitors;
  
  if (competitors.length > 0) {
    const avgCompetitorIG = competitors.reduce((sum: number, c: any) => sum + (c.social?.instagram?.followers || 0), 0) / competitors.length;
    
    if (igFollowers < avgCompetitorIG * 0.5) {
      recommendations.push({
        category: 'instagram',
        priority: 'high',
        title: 'Grow Instagram Following',
        description: `Your competitors average ${Math.round(avgCompetitorIG).toLocaleString()} followers. Consider: consistent posting schedule, influencer partnerships, user-generated content campaigns.`,
        effort: 'major'
      });
    }
  }

  // Content frequency
  if (data.brand.social.instagram.postFrequency === 'Inactive') {
    recommendations.push({
      category: 'instagram',
      priority: 'high',
      title: 'Increase Instagram Activity',
      description: 'Post at least 3-5 times per week. Mix product showcases, lifestyle content, and user testimonials.',
      effort: 'medium'
    });
  }

  // TikTok opportunity
  if (data.brand.social.tiktok.followers < 1000) {
    recommendations.push({
      category: 'tiktok',
      priority: 'medium',
      title: 'Build TikTok Presence',
      description: 'TikTok is crucial for younger demographics. Create short, authentic videos showing product use, benefits, and lifestyle integration.',
      effort: 'major'
    });
  }

  // Generic best practices
  recommendations.push({
    category: 'content',
    priority: 'medium',
    title: 'Leverage User-Generated Content',
    description: 'Like Poppi does brilliantly - encourage customers to share their Yippy moments. Repost, engage, and build community.',
    effort: 'medium'
  });

  recommendations.push({
    category: 'content',
    priority: 'low',
    title: 'Create Educational Content',
    description: 'Position Yippy as a health/wellness brand. Share content about ingredients, benefits, lifestyle tips.',
    effort: 'medium'
  });

  return recommendations.sort((a, b) => {
    const priorityOrder: any = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// Run full brand analysis
async function runBrandAnalysis() {
  console.log('Running brand analysis...');

  try {
    // Analyze Yippy
    const yippyWebsite = await analyzeWebsite(BRAND_CONFIG.yippy.website);
    const yippyIG = await scrapeInstagram(BRAND_CONFIG.yippy.instagram);
    const yippyTwitter = await scrapeTwitter(BRAND_CONFIG.yippy.twitter);
    const yippyTikTok = await scrapeTikTok(BRAND_CONFIG.yippy.tiktok);
    const yippyFB = await scrapeFacebook(BRAND_CONFIG.yippy.facebook);

    // Analyze competitors
    const competitors = await Promise.all(
      BRAND_CONFIG.competitors.map(async (comp) => {
        const website = await analyzeWebsite(comp.website);
        
        // Try to find social handles from website
        const response = await fetchWithTimeout(comp.website);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Look for social links
        const igLink = $('a[href*="instagram.com"]').attr('href');
        const igHandle = igLink ? igLink.split('instagram.com/')[1]?.split('/')[0]?.split('?')[0] : null;
        
        const social = igHandle ? {
          instagram: await scrapeInstagram(igHandle)
        } : {};

        return {
          name: comp.name,
          website,
          social,
          strengths: website.strengths,
          weaknesses: website.issues
        };
      })
    );

    const data = {
      brand: {
        website: yippyWebsite,
        social: {
          instagram: yippyIG,
          twitter: yippyTwitter,
          tiktok: yippyTikTok,
          facebook: yippyFB
        }
      },
      competitors,
      recommendations: [],
      lastUpdated: new Date().toISOString()
    };

    // Generate recommendations
    data.recommendations = generateRecommendations(data);

    // Save to cache
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error('Error running brand analysis:', error);
    throw error;
  }
}

// GET: Return cached data or run analysis
export async function GET(request: NextRequest) {
  try {
    // Check if cache exists
    try {
      const cached = await fs.readFile(CACHE_FILE, 'utf-8');
      const data = JSON.parse(cached);
      
      // If no lastUpdated or older than 24 hours, trigger new analysis
      if (!data.lastUpdated) {
        console.log('No timestamp in cache, running fresh analysis');
        const fresh = await runBrandAnalysis();
        return NextResponse.json(fresh);
      }
      
      const lastUpdate = new Date(data.lastUpdated);
      const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate > 24) {
        console.log('Cache is stale (>24h), running fresh analysis');
        const fresh = await runBrandAnalysis();
        return NextResponse.json(fresh);
      }
      
      console.log('Returning cached brand analysis');
      return NextResponse.json(data);
    } catch (error) {
      console.log('No cache found, running fresh analysis');
      const fresh = await runBrandAnalysis();
      return NextResponse.json(fresh);
    }
  } catch (error) {
    console.error('GET /api/mc/brand error:', error);
    return NextResponse.json(
      { error: 'Failed to load brand analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST: Force fresh analysis
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/mc/brand - forcing fresh analysis');
    const data = await runBrandAnalysis();
    return NextResponse.json(data);
  } catch (error) {
    console.error('POST /api/mc/brand error:', error);
    return NextResponse.json(
      { error: 'Failed to run brand analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
