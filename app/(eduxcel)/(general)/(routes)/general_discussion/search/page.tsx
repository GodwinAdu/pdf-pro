import UserCard from "@/components/general-discussion/cards/UserCard";
import Pagination from "@/components/general-discussion/shared/Pagination";
import Searchbar from "@/components/general-discussion/shared/Searchbar";
import { fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@/lib/helpers/current-user";


async function page({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const user = await currentUser();
    if (!user) return null;



    const result = await fetchUsers({
        userId: user._id,
        searchString: searchParams.q,
        pageNumber: searchParams?.page ? +searchParams.page : 1,
        pageSize: 25,
    });

    return (
        <section>
            <h1 className='text-white font-bold text-2xl mb-10'>Search</h1>

            <Searchbar routeType='search' />

            <div className='mt-14 flex flex-col gap-9'>
                {result.users.length === 0 ? (
                    <p className='no-result'>No Result</p>
                ) : (
                    <>
                        {result.users.map((person) => (
                            <UserCard
                                key={person._id}
                                id={person._id}
                                fullName={person.fullName}
                                username={person.username}
                                imgUrl={person.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}
            </div>

            <Pagination
                path='search'
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNext}
            />
        </section>
    );
}

export default page;
