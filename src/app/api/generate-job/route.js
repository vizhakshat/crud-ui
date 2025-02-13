import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(req) {
    try {
        const { id, short_description } = await req.json();

        // Insert data into Supabase
        const { data, error } = await supabase.from('generate_job').insert([{ id, short_description }]);

        if (error) throw error;

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}