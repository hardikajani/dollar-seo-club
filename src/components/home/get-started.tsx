import { ArrowRight } from "lucide-react";
import Link from "next/link";


const GetStarted = () => {
    return (
        <section className="py-10 md:py-16 bg-blue-900 text-white flex items-center justify-center min-h-[50vh]">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 text-center">
                        <div className="inline-block border border-white rounded-lg px-4 py-3 md:px-32 md:py-4">
                            <h2 className="text-sm md:text-lg lg:text-xl tracking-widest">
                                GET STARTED TODAY WITH NO COMMITMENT. JUST USE WHAT YOU NEED AND BE HAPPY.
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-8">
                    <Link
                        href='/'
                        className='w-max border-4 bg-white text-blue-800 rounded-full text-center text-lg font-bold p-2'
                    >
                        GET STARTED FOR
                        $1 <ArrowRight className='inline text-blue-800' />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default GetStarted;