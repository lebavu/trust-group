import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className='flex h-[80vh] w-full flex-col items-center justify-center'>
      <h1 className='text-9xl font-extrabold tracking-widest text-gray-900'>404</h1>
      <div className='absolute rotate-12 rounded bg-secondary px-2 text-sm text-white'>Page Not Found</div>
      <button className='mt-5'>
        <Link
          to='/'
          className='active:text-secondary/[.7] group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring'
        >
          <span className='relative flex bg-secondary h-[3.5rem] h-[2.5rem] font-medium min-w-[8rem] nowrap text-[1.4rem] w-full items-center justify-center py-0 px-6 rounded-[.5rem] text-white hover:bg-secondary/[.8]'>
            <span>Go Home</span>
          </span>
        </Link>
      </button>
    </main>
  );
}
