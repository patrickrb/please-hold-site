import { NextResponse } from 'next/server';

const TWIML_ANSWER = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" timeout="3" speechTimeout="auto" maxSpeechTime="10" action="https://pleasehold.io/twilio/gather" method="POST">
        <Say voice="Polly.Matthew">Hello? Sorry, who is this?</Say>
    </Gather>
    <!-- Fallback if no speech detected -->
    <Say voice="Polly.Matthew">Hello? Are you there?</Say>
    <Gather input="speech" timeout="3" speechTimeout="auto" maxSpeechTime="10" action="https://pleasehold.io/twilio/gather" method="POST">
        <Say voice="Polly.Matthew">I can barely hear you.</Say>
    </Gather>
    <!-- Second fallback - polite goodbye -->
    <Say voice="Polly.Matthew">I'm sorry, I can't hear anyone. Goodbye.</Say>
    <Hangup/>
</Response>`;

export async function POST() {
  return new NextResponse(TWIML_ANSWER, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

export async function GET() {
  return new NextResponse(TWIML_ANSWER, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
