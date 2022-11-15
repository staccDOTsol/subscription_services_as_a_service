import { findAta, withFindOrInitAssociatedTokenAccount } from '@cardinal/common'
import { DisplayAddress } from '@cardinal/namespaces-components'
import { executeTransaction } from '@cardinal/staking'
import { programs } from "@metaplex/js"
import * as anchor from '@project-serum/anchor'
import { FanoutClient } from '../../generated'
import { Fanout } from '../../generated/accounts'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  PublicKey, sendAndConfirmTransaction, SystemProgram, SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js'
import { Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { Header } from 'common/Header'

import {
  pubKeyUrl,
  shortPubKey,
} from 'common/utils'
import { asWallet } from 'common/Wallets'
import { paymentMintConfig } from 'config/paymentMintConfig'
import { FanoutData, useFanoutData } from 'hooks/useFanoutData'
import { useFanoutMembershipMintVouchers } from 'hooks/useFanoutMembershipMintVouchers'
import { useFanoutMembershipVouchers } from 'hooks/useFanoutMembershipVouchers'
import { useFanoutMints } from 'hooks/useFanoutMints'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { AnchorProvider } from '@project-serum/anchor'
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Program } from '@project-serum/anchor'
import { connect } from 'http2'

const Home: NextPage = () => {
  const router = useRouter()
  const [dec, setDec] = useState<number | undefined>()
  const [state, setState] = useState<any>()
  const [ttypes, setTtypes] = useState<any>()
  const [trange, setTrange] = useState<any>()
  const fanoutMembershipVouchers = useFanoutMembershipVouchers()
  const fanoutMints = useFanoutMints()
  const wallet = useWallet()
  const fanoutData = useFanoutData()
  const { connection, environment } = useEnvironmentCtx()

  const [nft, setNft]: any = useState('')

  const BASE_TAGS = [{ name: 'App-Name', value: 'Metaplex Candy Machine' }]

  const contentTypeTags = {
    json: { name: 'Content-Type', value: 'application/json' },
    'arweave-manifest': {
      name: 'Content-Type',
      value: 'application/x.arweave-manifest+json',
    },
  }

  const arweavePathManifestTags = [
    ...BASE_TAGS,
    contentTypeTags['arweave-manifest'],
  ]
  type Manifest = {
    name: string
    image: string
    animation_url: string
    properties: {
      files: Array<{ type: string; uri: string }>
    }
  }
 useEffect(() => {
  setTimeout(async function(){

 setDec ((
  await connection.getParsedTokenAccountsByOwner(
    wallet.publicKey as PublicKey,
    {
      mint: new PublicKey( fanoutData.data?.fanout.mint as PublicKey),
    }
  )
).value[0]?.account.data.parsed.info.tokenAmount.decimals)
setDec(6)
if (wallet && wallet.publicKey && fanoutData.data?.fanoutId) {
  const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
const [nativeAccountId] = await FanoutClient.nativeAccount(
  fanoutData.data.fanoutId
)
let provider = new AnchorProvider(connection, asWallet(wallet),{})

const idl = await Program.fetchIdl(new PublicKey("84zHEoSwTo6pb259RtmeYQ5KNStik8pib815q7reZjdx"), provider);

// @ts-ignore
const program = new Program(idl as Idl, new PublicKey("84zHEoSwTo6pb259RtmeYQ5KNStik8pib815q7reZjdx"), provider) as Program<any>;

// @ts-ignore
console.log(fanoutData.data.fanoutId.toBase58())
// @ts-ignore
const state: any = await program.account.fanout.fetch(fanoutData.data.fanoutId);
console.log(state.accountKey.toBase58())
const [urg] = await FanoutClient.nativeAccount(
  state.accountKey
)
console.log(urg.toBase58())
let tttypes :any= []
let ttrange: any = []
for (var t of state.traitOptions){
  if (!tttypes.includes(t.split('-')[0])){
  tttypes.push(t.split('-')[0])
  ttrange.push(t.split('-')[1])
  }
}
setTtypes(tttypes)
setTrange(ttrange)
setState(state)
console.log(state)
console.log(fanoutData.data?.nativeAccount.toBase58())
     }
}, 2000)
 }, [wallet.publicKey])

  const fromDwebLink = (cid: string): string => `https://${cid}.ipfs.dweb.link`
  let hehe = {
    sellerFeeBasisPoints: 0,
    share: 100,
    uri: '',
    attributes: [
      {
        trait_type: 'COPE',
        value: '0',
      },
      {
        trait_type: 'start_date',
        value: new Date().toString(),
      },
      {
        trait_type: 'end_date',
        value: new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 30
        ).toString(),
      },
    ],
    name: 'test',
    symbol: '',
    description: '',
    seller_fee_basis_points: 100,

    image:
      'https://www.arweave.net/5KuC6xC2mqDuS52EToL6eeASz8wD3SBFDW9UbM41Yhg?ext=png',
    external_url: '',
    properties: {
      files: [
        {
          uri: 'https://www.arweave.net/5KuC6xC2mqDuS52EToL6eeASz8wD3SBFDW9UbM41Yhg?ext=png',
          type: 'image/png',
        },
      ],
      category: 'image',
      creators: [
        {
          address: new PublicKey(
            'HTwypueDnRQBtNbwj4dXjZtEbmAiqTKGNe7hgDT4u4tL'
          ),
          share: 100,
          verified: true,
          isOwner: true,
          total: 1,
        },
      ],
    },
  }

  interface SignMetadataArgs {
    fanout: PublicKey
    authority?: PublicKey
    holdingAccount?: PublicKey
    metadata: PublicKey
    args: any
  }

  async function uploadFile(file: any, fanout: any, authority: any, val: any, to:any): Promise<any> {
  
    const body = ({nft: file, fanout, who: wallet.publicKey,val:val.toNumber(), to})
    console.log(body)

    try {
      const response = await fetch(process.env.NODE_ENV != "production" ? 'http://localhost:8080/handle' : 'https://subscriptionservicebackend.herokuapp.com/handle', {
        //@ts-ignore
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          
          'Content-Type': 'application/json',
        },
      })

      const json = await response.json()
      return json
    }
    catch (err){
      
    }
  }
  const manifestTags = [...BASE_TAGS, contentTypeTags['json']]
  function getArweave(): any {
    return {
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      timeout: 20000,
      logging: false,
      logger: console.log,
    }
  }
  let arweavePathManifestLink: any
  const distributeShare = async (
    fanoutData: FanoutData,
    i: number
  ) => {
    if (wallet && wallet.publicKey && fanoutData.fanoutId) {
      const metadatas = (await programs.metadata.Metadata.findByMint (connection, new PublicKey(nft)));
      const metadata = metadatas.pubkey
          
      const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
      const [nativeAccountId] = await FanoutClient.nativeAccount(
        fanoutData.fanoutId
      )
      let provider = new AnchorProvider(connection, asWallet(wallet),{})
     
      const idl = await Program.fetchIdl(new PublicKey("84zHEoSwTo6pb259RtmeYQ5KNStik8pib815q7reZjdx"), provider);
   
      // @ts-ignore
      const program = new Program(idl as Idl, new PublicKey("84zHEoSwTo6pb259RtmeYQ5KNStik8pib815q7reZjdx"), provider) as Program<any>;

  // @ts-ignore
console.log(fanoutData.fanoutId.toBase58())
  // @ts-ignore
  const state: any = await program.account.fanout.fetch(fanoutData.fanoutId);
  setState(state)
      console.log(nativeAccountId.toBase58())
      console.log(fanoutData.fanoutId.toBase58())
      // Initialize the Arweave Bundle Upload Generator.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
      const bytes = 1024 * 1024 * 10
        
      let env = 'mainnet-beta'

      const fanoutObj = await fanoutSdk.fetch<Fanout>(
        fanoutData.fanoutId,
        Fanout
      )

      let hehe2 =  (await uploadFile(nft, fanoutData.fanoutId, fanoutObj.authority,
      state.shares[i], state.traitOptions[i]))
      for (var creator of hehe2.body.creators){
        creator.address = new PublicKey(creator.address)
      }
      console.log(hehe2.tx)
      let tx =  new Transaction()

      // @ts-ignore
      // @ts-ignore

      const mint = fanoutObj.mint
       const ata = (
        await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID,TOKEN_PROGRAM_ID,new PublicKey(nft),wallet.publicKey, true)
      )
      console.log(ata.toBase58())
      // @ts-ignore
      const sourceAccount = (
        await connection.getTokenAccountsByOwner(wallet.publicKey, {
          mint,
        })
      ).value[0].pubkey
      // @ts-ignore
      const tokenAccount = (
        await connection.getTokenAccountsByOwner(fanoutObj.authority, {
          mint,
        })
      ).value[0].pubkey
      // @ts-ignore
      const tokenAccount2 = (
        await connection.getTokenAccountsByOwner(
          new PublicKey('JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm'),
          { mint }
        )
      ).value[0].pubkey
      console.log(tokenAccount2.toBase58())
 // const itemsAvailable = state.data.itemsAvailable.toNumber();
 // const itemsRedeemed = state.itemsRedeemed.toNumber();
 // const itemsRemaining = itemsAvailable - itemsRedeemed;

hehe2.body.val = state.shares[i]
hehe2.body.to = state.traitOptions[i]
// @ts-ignore
   tx.add   (await program.instruction.processSignMetadata(
// @ts-ignore
        {val: hehe2.body.val, 
         to: hehe2.body.to ,
         sellerFeeBasisPoints: hehe2.body.sellerFeeBasisPoints,
         name: hehe2.body.name,
         creators: hehe2.body.creators,
         uri: hehe2.body.uri,
        symbol: hehe2.body.symbol},
        {
          accounts: {
            newUri: new PublicKey(hehe2.pubkey),
            nft: new PublicKey(nft),
            ata,
            jare: new PublicKey('JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm'),
            mint,
            sourceAccount,
            tokenAccount,
            tokenAccount2,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
            fanout: fanoutData.fanoutId,
            metadata,
            authority: wallet.publicKey,
            holdingAccount: nativeAccountId,
          },
        }
      ))
let  hmm = await provider.sendAndConfirm( tx, [], {skipPreflight: false})
console.log(hmm)

    }
  }

  return (
    <div className="bg-white h-screen max-h-screen">
      <Header />
      <main className="h-[80%] py-16 flex flex-1 flex-col justify-center items-center">
        <div className="text-gray-700 w-full max-w-xl py-3 md:px-0 px-10 mb-10">
          {fanoutData.error && (
            <div className="text-gray-700 bg-red-300 w-full text-center py-3 mb-10">
              <div className="font-bold uppercase tracking-wide">
                Remetadat00r Wallet not found
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/${
                      environment.label !== 'mainnet-beta'
                        ? `?cluster=${environment.label}`
                        : ''
                    }`,
                    undefined,
                    { shallow: true }
                  )
                }
              >
                Retry
              </div>
            </div>
          )}

          <div className="mb-5 border-b-2">
            <div className="font-bold uppercase tracking-wide text-2xl mb-1">
              {fanoutData.data?.fanout.name ? (
                fanoutData.data?.fanout.name
              ) : (
                <div className="animate h-6 w-24 animate-pulse bg-gray-200 rounded-md"></div>
              )}
            </div>
          </div>
          <div className="mb-5">
            <p className="font-bold uppercase tracking-wide text-md mb-1">
              Remetdat00r Address:{' '}
              <a
                className="hover:text-blue-500 transition"
                target="_blank"
                rel="noopener noreferrer"
                href={pubKeyUrl(fanoutData.data?.fanoutId, environment.label)}
              >
                {shortPubKey(fanoutData.data?.fanoutId.toString())}
              </a>
            </p>
           
              <p className="font-bold uppercase tracking-wide text-md mb-1">
                Update Authority:{' '}
                <a
                  className="hover:text-blue-500 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={pubKeyUrl(
                    fanoutData.data?.nativeAccount,
                    environment.label
                  )}
                >
                  {shortPubKey(fanoutData.data?.nativeAccount)}
                </a>
              </p>

            <p className="font-bold uppercase tracking-wide text-md mb-1">
              Cost {
              fanoutData.data?.fanout?.totalShares && dec ? 
              // @ts-ignore
              (parseFloat(fanoutData.data?.fanout?.totalShares) / 10 ** dec).toString() : "0"}
            </p>
          </div>
          <div className="w-full mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Enter the NFT address to update... at your peril...
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              onSubmit={() => alert('HEr')}
              type="text"
              placeholder="8cmaFq1sqF9TJ188AYktb6DMpBCtABP6bzUWmWpacCRU"
              onChange={(e) => {
                setNft(e.target.value)
              }}
              value={nft}
            />
          </div>
          <div className="container">
    
    <div className="center-col">
      <span>:D</span>
      <ul>
      {state && ttypes && state.traitOptions.map((t: string, i: number ) => 
    <div className='scroll' > Upgrade your {t.split('-')[0]} to {t.split('-')[1]} for {state.shares[i].toNumber() / 10 ** (dec as number)} tokenz
    <AsyncButton
      type="button"
      variant="primary"
      bgColor="rgb(96 165 250)"
      
      className="bg-blue-400 text-white hover:bg-blue-500 px-3 py-2 rounded-md mr-2"
      handleClick={async () =>
        fanoutData.data && distributeShare(fanoutData.data, i)
      }
    >
      Now!
    </AsyncButton></div>
    )}      </ul>
    </div>
    
  </div>


        
        </div>
      </main>
    </div>
  )
}

export default Home
