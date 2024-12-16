
const included = [
    {
        title: 'FOR BUSINESSES',
        description: 'Save on expensive subscription fees—ideal for small businesses, freelancers, and occasional users.',
    },
    {
        title: 'FOR INDIVIDUALS',
        description: 'Quickly optimise your site, no time wasting, no contracts, just optimisations! Start from $1, it’s easy!',
       
    }

]

const WhoIsItFor = () => {
    return (
        <section className="py-10 md:py-16 bg-blue-900 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-block border border-white rounded-lg px-5 md:px-20 py-2 md:mb-4">
                        <h2 className="text-lg md:text-2xl font-bold">WHO IS IT FOR?</h2>
                    </div>
                    <p className="text-base md:text-xl font-semibold">Perfect for Businesses and Individuals.</p>
                </div>

                <div className="flex flex-row max-md:flex-col gap-8 xl:px-32">
                    {included.map((item, index) => (
                        <div key={index} className="flex flex-col items-center  p-2 md:p-4 bg-white rounded-3xl lg:rounded-full shadow-lg transition-transform duration-200 hover:scale-105">
                            
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:mt-4">{item.title}</h1>
                            <span className="text-sm md:text-base text-gray-600 text-center mt-2 md:mt-4 px-4">{item.description}</span>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    )
}

export default WhoIsItFor;