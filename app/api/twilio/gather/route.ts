import { NextResponse } from 'next/server';

// Stall tactic responses - vary these to keep conversation natural
const STALL_RESPONSES = [
  "Oh, I see. Hmm, let me think about that for a moment. Could you say that again?",
  "Right, right. I think I follow. Just give me a second here.",
  "Interesting. I'm not quite sure I understand. What did you mean by that?",
  "Hold on, I'm looking for something. What were you saying?",
  "I'm sorry, my mind wandered for a moment. Could you repeat that?",
  "Hmm, that's a good question. Let me think about it.",
  "I see, I see. And what was the other thing you mentioned?",
  "Oh my. That sounds complicated. Can you explain it again?",
  "Right. I think I need to check on something. Go on.",
  "Mm-hmm. I'm listening. Please continue.",
];

function getRandomStall(): string {
  return STALL_RESPONSES[Math.floor(Math.random() * STALL_RESPONSES.length)];
}

function buildGatherTwiml(stallMessage: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" timeout="3" speechTimeout="auto" maxSpeechTime="10" action="https://pleasehold.io/twilio/gather" method="POST">
        <Say voice="Polly.Matthew">${stallMessage}</Say>
    </Gather>
    <!-- Fallback if no speech detected -->
    <Gather input="speech" timeout="3" speechTimeout="auto" maxSpeechTime="10" action="https://pleasehold.io/twilio/gather" method="POST">
        <Say voice="Polly.Matthew">Hello? Are you still there?</Say>
    </Gather>
    <!-- Repeated silence - polite exit -->
    <Say voice="Polly.Matthew">Well, it was nice talking to you. Take care now. Goodbye.</Say>
    <Hangup/>
</Response>`;
}

export async function POST(request: Request) {
  // In production, you would:
  // 1. Parse the form data to get CallSid and SpeechResult
  // 2. Use CallSid to track conversation state
  // 3. Use SpeechResult to generate AI-driven responses
  // 4. Store conversation history for context

  // Example of how to access Twilio's POST data:
  // const formData = await request.formData();
  // const callSid = formData.get('CallSid');
  // const speechResult = formData.get('SpeechResult');
  // const confidence = formData.get('Confidence');

  const stallMessage = getRandomStall();
  const twiml = buildGatherTwiml(stallMessage);

  return new NextResponse(twiml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

export async function GET() {
  // GET handler for testing
  const stallMessage = getRandomStall();
  const twiml = buildGatherTwiml(stallMessage);

  return new NextResponse(twiml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
