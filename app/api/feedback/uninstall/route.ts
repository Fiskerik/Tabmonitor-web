import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { reason, details, email } = await req.json();

    // HÄR: Du kan t.ex. spara detta i en ny tabell i Supabase som heter 'uninstalls'
    console.log(`Uninstall feedback: ${reason} - ${details} (${email})`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
