'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function TableData() {
    const [tableData, setTableData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const fetchUsers = async () => {
        const { data, error } = await supabase.from('generate_job').select('*').order('id', { ascending: true });;
        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setTableData(data);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (id, shortDescription) => {
        setEditingId(id);
        setEditText(shortDescription);
    };

    const handleUpdate = async (id) => {
        const { error } = await supabase
            .from('generate_job')
            .update({ short_description: editText })
            .eq('id', id);

        if (error) {
            console.error('Error updating:', error);
        } else {
            setEditingId(null);
            fetchUsers(); // Refresh data after update
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('generate_job')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting:', error);
        } else {
            setTableData(tableData.filter((item) => item.id !== id)); // Remove from state immediately
        }
    };

    return (
        <div className='mt-[30px] w-[calc(100%-400px)]'>
            <h1 className='text-center font-[600]'>Database Entities</h1>
            <div className='h-[calc(100vh-400px)] overflow-y-auto mt-[30px]'>
                {tableData.map((entity) => (
                    <div className='flex justify-between items-center gap-[20px] p-[5px] border w-full' key={entity.id}>
                        <div className='flex gap-[20px]'>
                            <span>{entity.id}.</span>
                            {editingId === entity.id ? (
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full border bg-blue-200 px-2 py-1 rounded"
                                />
                            ) : (
                                <span>{entity.short_description}</span>
                            )}
                        </div>
                        <div className='flex gap-[10px] hover:[&>button]:underline'>
                            {editingId === entity.id ? (
                                <button onClick={() => handleUpdate(entity.id)} className='text-green-600'>Save</button>
                            ) : (
                                <button onClick={() => handleEditClick(entity.id, entity.short_description)} className='text-blue-700'>Edit</button>
                            )}
                            <button onClick={() => handleDelete(entity.id)} className="text-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
