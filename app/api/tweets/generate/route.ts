import { NextResponse } from 'next/server';

interface Tweet {
  text: string;
  category: string;
}

export async function POST(request: Request) {
  try {
    // In a real implementation, this would:
    // 1. Fetch latest trends from the trends API
    // 2. Read Yippy brand voice guide
    // 3. Use AI to generate contextual tweets
    
    // For now, generate sample tweets using common patterns
    const tweets: Tweet[] = await generateTweets();
    
    return NextResponse.json({
      success: true,
      tweets,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Tweet generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate tweets' },
      { status: 500 }
    );
  }
}

async function generateTweets(): Promise<Tweet[]> {
  // Fetch trends data
  let trendsData: any[] = [];
  try {
    const trendsResponse = await fetch('http://localhost:3000/api/mc/trends', {
      cache: 'no-store'
    });
    if (trendsResponse.ok) {
      const data = await trendsResponse.json();
      trendsData = data.trends || [];
    }
  } catch (error) {
    console.error('Failed to fetch trends:', error);
  }

  // Get top golf/performance trends
  const golfTrends = trendsData
    .filter(t => t.type === 'golf' || t.type === 'performance')
    .slice(0, 5);

  const templates = [
    // Product education
    {
      category: 'Product',
      templates: [
        `What if you could stay sharp on the course without the jitters?\n\nYippy pouches deliver functional performance with great flavor and great ingredients.\n\nNo nicotine. Just focus.`,
        `The desk grind hits different with 50mg of clean caffeine.\n\nYippy Desk formula: Energy without the crash.\n\nFunctional performance pouches that actually taste good.`,
        `Golf requires focus. Energy. Mental clarity.\n\nYippy For the Course pouches: Functional ingredients designed for golfers.\n\nGreat flavor. Great ingredients. Zero nicotine.`
      ]
    },
    
    // Trend commentary (if trends available)
    ...(golfTrends.length > 0 ? [{
      category: 'Trending',
      templates: golfTrends.map(trend => 
        `${trend.topic} trending right now.\n\nEvery golfer knows: performance starts with focus.\n\nThat's why we created Yippy pouches - functional performance without nicotine.\n\nGreat flavor, great ingredients.`
      )
    }] : []),
    
    // Social proof / community
    {
      category: 'Community',
      templates: [
        `Real talk from a customer:\n\n"Switched to Yippy before my rounds. Better focus, no crash. Game changer."\n\nFunctional performance pouches built for golfers. 🏌️`,
        `156 golfers tried Yippy this month.\n\nWhy? Because functional performance shouldn't mean sacrificing your health.\n\nGreat flavor. Great ingredients. No nicotine.`,
        `What do you reach for when you need focus?\n\nYippy pouches: Functional performance without the junk.\n\nTry our Golf formula - made for the course.`
      ]
    },
    
    // Educational content
    {
      category: 'Education',
      templates: [
        `Why functional performance pouches?\n\n✅ Convenient\n✅ Great flavor\n✅ No crash\n✅ No nicotine\n\nYippy: Performance you can feel, ingredients you can trust.`,
        `The difference between Yippy and nicotine pouches?\n\nWe use functional ingredients that support focus and performance.\n\nNo addiction. Just results.\n\nGreat flavor, great ingredients.`,
        `Two formulas. One mission.\n\n⛳ For the Course: Focus without caffeine\n💼 For the Desk: 50mg clean energy\n\nFunctional performance pouches that work.`
      ]
    },
    
    // Lifestyle / aspiration
    {
      category: 'Lifestyle',
      templates: [
        `Sunday morning. Clear skies. 18 holes ahead.\n\nYippy For the Course keeps me locked in from first tee to final putt.\n\nFunctional performance. Great flavor. Zero nicotine.`,
        `The desk grind doesn't have to drain you.\n\nYippy Desk formula: 50mg caffeine + functional ingredients.\n\nClean energy. No crash. Great flavor.`,
        `Peak performance isn't about cutting corners.\n\nIt's about better ingredients. Better formulas. Better focus.\n\nThat's Yippy. Functional performance pouches done right.`
      ]
    }
  ];

  // Flatten all templates and shuffle
  const allTweets: Tweet[] = [];
  templates.forEach(category => {
    category.templates.forEach(text => {
      allTweets.push({
        text,
        category: category.category
      });
    });
  });

  // Shuffle and return 10-15 tweets
  const shuffled = allTweets.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(15, shuffled.length));
}
