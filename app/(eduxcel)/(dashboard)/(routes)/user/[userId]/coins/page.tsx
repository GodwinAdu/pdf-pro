import { TransferModal } from '@/components/common/TransferModal'
import { DataTable } from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { columns } from './_component/column'
import { fetchCoinTransactions } from '@/lib/actions/coin-transaction.actions'
import { currentUser } from '@/lib/helpers/current-user'
import BuyCoin from '@/components/coins/BuyCoin'
import { fetchCoinByUserId } from '@/lib/actions/coin.actions'

export const dynamic = 'force-dynamic'; // This forces server-side rendering
const page = async () => {
  const user = await currentUser();

  const coin  = await fetchCoinByUserId()
  const data = await fetchCoinTransactions()
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">
        {/* Available Coins */}
        <div className="flex gap-4 items-center">
          <h3 className="font-bold text-2xl">Available Coins:</h3>
          <p className="font-bold text-xl text-black">{coin}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <BuyCoin user={user} />
          <TransferModal />
          <Button disabled size="sm" className="bg-green-500 hover:bg-green-700">Withdraw</Button>
        </div>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
    </>
  )
}

export default page

