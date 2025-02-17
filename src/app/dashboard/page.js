import GenerateJob from '@/components/GenerateJob/GenerateJob';
import TableData from '@/components/TableData/TableData';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const supabase = createServerComponentClient({ cookies });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/');
    }

    return (
        <div className='flex justify-center items-center flex-col mt-[50px]'>
            <h1 className="text-[30px] font-[600]">Supabase CRUD Operation</h1>
            <GenerateJob />
            <TableData />
        </div>
    )
}