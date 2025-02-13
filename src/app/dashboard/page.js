import GenerateJob from '@/components/GenerateJob/GenerateJob';
import TableData from '@/components/TableData/TableData';

export default function Dashboard() {
    return (
        <div className='flex justify-center items-center flex-col mt-[50px]'>
            <h1 className="text-[30px] font-[600]">Supabase CRUD Operation</h1>
            <GenerateJob />
            <TableData />
        </div>
    )
}