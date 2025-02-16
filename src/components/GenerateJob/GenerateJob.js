'use client'; // Enable client-side rendering

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddTodo() {
    const [jobDescription, setJobDescription] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    // gets total number of items inside the table to generate id for the new field 
    async function fetchItemCount() {
        const { count, error } = await supabase
            .from('generate_job')
            .select('*', { count: 'exact', head: true }); // 'exact' ensures an accurate count

        if (error) {
            console.error('Error fetching count:', error);
        }

        setTotalItems(count);
    }

    useEffect(() => {
        fetchItemCount()
    }, [jobDescription])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let id = totalItems + 1;

        const response = await fetch('/api/generate-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, short_description: jobDescription }),
        });

        const data = await response.json();
        setLoading(false);

        if (data.success) {
            alert('Todo added successfully!');
            setJobDescription('');
        } else {
            alert('Todo added successfully!');
            setJobDescription('');
            alert('Error: ' + data.error);
        }
    };

    return (
        <div>
            <h1 className='text-[16px] font-[600] mt-[30px] text-center'>Add New Job Description</h1>
            <form onSubmit={handleSubmit} className='flex gap-[20px] mt-[10px]'>
                <input
                    type="text"
                    placeholder="Enter a short description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                    className='border rounded-[6px] px-[5px] w-[600px]'
                />
                <button type="submit" disabled={loading} className='bg-blue-500 hover:bg-blue-700 text-white rounded-[6px] px-[10px] py-[5px]'>
                    {loading ? 'Adding...' : 'Add Job Description'}
                </button>
            </form>
        </div>
    );
}