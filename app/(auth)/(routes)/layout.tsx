

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 via-yellow-400 to-red-500 '>
            {children}
        </div>
    )
}