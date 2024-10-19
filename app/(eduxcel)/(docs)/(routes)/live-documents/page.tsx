
import AddDocumentBtn from '@/components/docs/AddDocumentBtn';
import { DeleteModal } from '@/components/docs/DeleteModal';
import Header from '@/components/docs/Header';
import Notifications from '@/components/docs/Notifications';
import UserAccountNav from '@/components/UserAccountNav';
import { getDocuments } from '@/lib/actions/room.actions';
import { currentUser } from '@/lib/helpers/current-user';
import { dateConverter } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Home = async () => {
  const user = await currentUser();
  if(!user) redirect('/sign-in');

  const roomDocuments = await getDocuments(user.email);

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <UserAccountNav user={user} />
        </div>
      </Header>

      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All documents</h3>
            <AddDocumentBtn 
              userId={user._id}
              email={user.email}
            />
          </div>
          <ul className="document-ul">
            {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
              <li key={id} className="document-list-item">
                <Link href={`live-documents/documents/${id}`} className="flex flex-1 items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image 
                      src="/assets/icons/doc.svg"
                      alt="file"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Created about {dateConverter(createdAt)}</p>
                  </div>
                </Link>
                <DeleteModal roomId={id} />
              </li>
            ))}
          </ul>
        </div>
      ): (
        <div className="document-list-empty">
          <Image 
            src="/assets/icons/doc.svg"
            alt="Document"
            width={40}
            height={40}
            className="mx-auto"
          />

          <AddDocumentBtn 
            userId={user._id}
            email={user.email}
          />
        </div>
      )}
    </main>
  )
}

export default Home