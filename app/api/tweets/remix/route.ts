import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { originalTweet } = await request.json();
    
    if (!originalTweet) {
      return NextResponse.json(
        { success: false, error: 'Original tweet required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would use AI to rewrite
    // For now, we'll apply simple transformations
    const remixedTweet = remixTweetText(originalTweet);
    
    return NextResponse.json({
      success: true,
      remixedTweet,
      original: originalTweet
    });
  } catch (error) {
    console.error('Tweet remix error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remix tweet' },
      { status: 500 }
    );
  }
}

function remixTweetText(original: string): string {
  // Simple remix strategies (in production, use AI)
  const strategies = [
    // Lead with a question
    (text: string) => {
      const question = "Want to know the secret to better focus?\n\n";
      return question + text;
    },
    
    // Add social proof
    (text: string) => {
      return text + "\n\nJoin 100+ golfers who've made the switch.";
    },
    
    // Make it more conversational
    (text: string) => {
      return "Here's the thing:\n\n" + text;
    },
    
    // Add urgency/scarcity
    (text: string) => {
      return text.replace(/\.$/, '') + ".\n\nLimited stock - try it today.";
    },
    
    // Flip the structure
    (text: string) => {
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length > 2) {
        return [...lines.slice(1), lines[0]].join('\n\n');
      }
      return text;
    }
  ];

  // Pick a random strategy
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];
  return strategy(original);
}
