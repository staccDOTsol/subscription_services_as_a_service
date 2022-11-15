import { Fanout, FanoutClient } from '../../generated'
import { Wallet } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { Header } from 'common/Header'
import { notify } from 'common/Notification'
import { executeTransaction } from 'common/Transactions'
import { tryPublicKey } from 'common/utils'
import { asWallet } from 'common/Wallets'
import type { NextPage } from 'next'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { VscLaw } from 'react-icons/vsc'

const Home: NextPage = () => {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const [walletName, setWalletName] = useState<undefined | string>(undefined)
  const [mint, setMint] = useState<undefined | string>(undefined)
  const [totalShares, setTotalShares] = useState<undefined | number>(undefined)
  const [success, setSuccess] = useState(false)
  const [decimals, setDecimals] = useState<number>(0)
  const [atts, setAtts]  = useState<number[]>([])
  const [traits, setTraits] = useState< string []>(["end_date"])
  const [descs, setDescs] = useState< string []>(["end_date"])
  const [remetadat00rWalletMembers, setRemetadat00rWalletMembers] = useState<
    { memberKey?: string; shares?: number }[]
  >([{ memberKey: undefined, shares: undefined }])

  const validateAndCreateWallet = async () => {
    const walletMembers = remetadat00rWalletMembers
    walletMembers[0]!.memberKey = wallet.publicKey?.toBase58()
    setRemetadat00rWalletMembers([...walletMembers])
    try {
      if (!walletName) {
        throw 'Specify a wallet name'
      }
      if (walletName.includes(' ')) {
        throw 'Wallet name cannot contain spaces'
      }
      if (!totalShares) {
        throw 'Please specify the total number of shares for distribution'
      }
      if (totalShares <= 0) {
        throw 'Please specify a positive number of shares'
      }
      let shareSum = 0

      const fanoutId = (await FanoutClient.fanoutKey(walletName))[0]
      const [nativeAccountId] = await FanoutClient.nativeAccount(fanoutId)
      const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
      try {
        let fanoutData = await fanoutSdk.fetch<Fanout>(fanoutId, Fanout)
        if (fanoutData) {
          throw `Wallet '${walletName}' already exists`
        }
      } catch (e) {}
      console.log(nativeAccountId.toBase58())
      let transaction = new Transaction()
      setTimeout(async function(){
        let hmm = await connection.getParsedTokenAccountsByOwner(
          wallet.publicKey as PublicKey,
          {
            mint: new PublicKey(mint as string),
          }
        )
      
      let dec = hmm.value[0]?.account.data.parsed.info.tokenAmount.decimals
      console.log(dec)
      dec = 6
      let shares = totalShares * 10 ** dec
      console.log(shares)
      console.log(shares)
      let eh = await fanoutSdk.initializeFanoutInstructions(
        // @ts-ignore
        {
          decimals,
          traits,
          atts,
          descs,
          mint: new PublicKey(mint as string),
          totalShares: shares,
          name: walletName,

          bumpSeed: 250,
          nativeAccountBumpSeed: 250,
        },
        new PublicKey(mint as string)
      )
      transaction.add(...eh.instructions)
      let eh2 = await fanoutSdk.addMemberWalletInstructions(
        fanoutId,
        wallet.publicKey as PublicKey
      )
      transaction.add(...eh2.instructions)
      await executeTransaction(connection, wallet as Wallet, transaction, {
        confirmOptions: { skipPreflight: false },
      })

      setSuccess(true)
    }, 1000)
    } catch (e) {
      notify({
        message: `Error creating remetadat00r wallet`,
        description: `${e}`,
        type: 'error',
      })
    }
  }
  function handleSetAtts(val: string){
    let atts : number [] = []
    for (var att of val.split(',')){
      atts.push(parseInt(att))
    }
    setAtts(atts)
  }
  return (
    <div className="bg-white h-screen max-h-screen">
      <Header />
      <main className="h-[80%] py-16 flex flex-1 flex-col justify-center items-center">
        {success && (
          <div className="text-gray-700 bg-green-300 w-full max-w-lg text-center py-3 mb-10">
            <p className="font-bold uppercase tracking-wide">
              Remetadat00r Wallet Created
            </p>
            <p>
              {' '}
              Access the wallet at{' '}
              <a
                href={`/${walletName}${window.location.search ?? ''}`}
                className="text-blue-600 hover:text-blue-500"
              >
                {window.location.origin}/{walletName}
                {window.location.search ?? ''}
              </a>
            </p>
          </div>
        )}
        <form className="w-full max-w-lg">
          <div className="w-full mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Remetadat00r Wallet Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="grid-first-name"
              type="text"
              placeholder="cardinal-wallet"
              onChange={(e) => {
                setWalletName(e.target.value)
                setSuccess(false)
              }}
              value={walletName}
            />
          </div>
          <div className="w-full mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Amount of Tokens to Charge
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="grid-first-name"
              type="text"
              onChange={(e) => {
                setTotalShares(parseInt(e.target.value))
              }}
            />
          </div>
          <div className="w-full mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Your Mint to Charge With
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="grid-first-name"
              type="text"
              onChange={(e) => {
                setMint(e.target.value)
              }}
            />
          </div>
          <div className="w-full mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              How many decimals in mint?
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="grid-first-name"
              type="text"
              onChange={(e) => {
                setDecimals(parseInt(e.target.value))
              }}
            />
          </div>
          <div className="w-full mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Enter the traits that you would like to charge to update with.. this is an array so it&apos;ll look like trait1,trait2
            </label>
            <label 
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            > In the case of subscriptions, enter at least end_date</label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="grid-first-name"
              type="text"
              onChange={(e) => {
                setTraits(e.target.value.split(','))
              }}
            />
          </div>
          <div className="w-full mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Enter the descriptions for these traits
            </label>
           
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="grid-first-name"
              type="text"
              onChange={(e) => {
                setDescs(e.target.value.split(','))
              }}
            />
          </div>
          <div className="w-full mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              In the same order as above, enter the amount in your tokens to charge for each trait, as, say, 1000,2000,5000.
            </label>
            <label 
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            > In the case of subscriptions, they can renew whenever and it extends their subscription a month.</label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="grid-first-name"
              type="text"
              onChange={(e) => {
                handleSetAtts(e.target.value)
              }}
            />
          </div>
          <div>
            <div>
              <AsyncButton
                type="button"
                bgColor="rgb(96 165 250)"
                variant="primary"
                className="bg-blue-400 text-white hover:bg-blue-500 px-4 py-3 rounded-md"
                handleClick={async () => validateAndCreateWallet()}
              >
                Create Remetadat00r Wallet
              </AsyncButton>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Home
