import { findAta, withFindOrInitAssociatedTokenAccount } from '@cardinal/common'
import { DisplayAddress } from '@cardinal/namespaces-components'
import { executeTransaction } from '@cardinal/staking'
import {
  Creator,
  MetadataProgram,
} from '@metaplex-foundation/mpl-token-metadata'
import { FanoutClient } from '../../generated'
import { Fanout } from '../../generated/accounts'
import { CreateAssociatedTokenAccount } from '@metaplex/js/lib/transactions'
import { Wallet } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Signer,
  TransactionInstruction,
} from '@solana/web3.js'
import { Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { Header } from 'common/Header'
import { notify } from 'common/Notification'

import { getMetadata } from '../../deprecated-clis/src/helpers/accounts'
import {
  getMintNaturalAmountFromDecimal,
  pubKeyUrl,
  shortPubKey,
  tryPublicKey,
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
import { Data } from 'mpl-token-metadata/dist/src/generated'
import { InstructionResult } from '@strata-foundation/spl-utils'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

const Home: NextPage = () => {
  const router = useRouter()
  const [mintId, setMintId] = useState<string | undefined>()
  const fanoutMembershipVouchers = useFanoutMembershipVouchers()
  const fanoutMints = useFanoutMints()
  const wallet = useWallet()
  const fanoutData = useFanoutData()
  const { connection, environment } = useEnvironmentCtx()
  let selectedFanoutMint =
    mintId && fanoutMints.data
      ? fanoutMints.data.find((mint) => mint.data.mint.toString() === mintId)
      : undefined
  const fanoutMembershipMintVouchers = useFanoutMembershipMintVouchers(mintId)
  const [voucherMapping, setVoucherMapping] = useState<{
    [key: string]: string
  }>({})
  const [nft, setNft]: any = useState('')

  useEffect(() => {
    const anchor = router.asPath.split('#')[1]
    const fanoutMint = fanoutMints.data?.find(
      (fanoutMint) =>
        fanoutMint.config.symbol === anchor ||
        fanoutMint.id.toString() === anchor
    )
    if (fanoutMint?.data.mint && fanoutMint?.data.mint.toString() !== mintId) {
      selectSplToken(fanoutMint?.data.mint.toString())
    }
  }, [
    router,
    fanoutMints.data?.map((fanoutMint) => fanoutMint.id.toString()).join(','),
  ])
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
  useEffect(() => {
    const setMapping = async () => {
      if (fanoutMembershipVouchers.data && selectedFanoutMint) {
        let mapping: { [key: string]: string } = {}
        for (const voucher of fanoutMembershipVouchers.data!) {
          const [mintMembershipVoucher] =
            await FanoutClient.mintMembershipVoucher(
              selectedFanoutMint.id,
              voucher.parsed.membershipKey,
              new PublicKey(mintId!)
            )
          mapping[voucher.pubkey.toString()] = mintMembershipVoucher.toString()
        }
        setVoucherMapping(mapping)
      } else {
        setVoucherMapping({})
      }
    }
    setMapping()
  }, [fanoutMembershipVouchers.data, selectedFanoutMint, mintId])

  const selectSplToken = (mintId: string) => {
    setMintId(mintId === 'default' ? undefined : mintId)
    const fanoutMint = fanoutMints.data?.find(
      (fanoutMint) => fanoutMint.data.mint.toString() === mintId
    )
    if (environment.label === 'mainnet-beta') {
      router.push(`${location.pathname}#${fanoutMint?.config.symbol ?? ''}`)
    }
  }

  type Manifest = {
    name: string
    image: string
    animation_url: string
    properties: {
      files: Array<{ type: string; uri: string }>
    }
  }
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

  async function uploadFile(file: any): Promise<any> {
    //@ts-ignore
    const body = file
    try {
      const response = await fetch('https://api.nft.storage/upload', {
        //@ts-ignore
        body,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${
            process.env.NFT_STORAGE_API_KEY ||
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdEQUY5M2RjM0M4NDk2RkJCNDI2OTJkZTllZTQ1ZjMzYTU0QTQ0MjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0ODE2NTAzODU2MywibmFtZSI6InRlc3QifQ.N-O3tRZHsFo3T8UXC0pOElITz5iCK2ABCjRCxd3yFt0'
          }`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const json = await response.json()
      if (!json.ok) {
        return {
          error: json.error?.code + ': ' + json.error?.message,
          uri: '',
          //@ts-ignore
          name: file.originalFilename || '',
          //@ts-ignore
          type: file.mimetype || '',
        }
      }
      //@ts-ignore
      return {
        error: undefined,
        uri: fromDwebLink(json.value.cid) + `?ext=json`,
        //@ts-ignore
        name: file.originalFilename || '',
        //@ts-ignore
        type: file.mimetype || '',
      }
    } catch (error) {
      console.error(error)
      return {
        error: 'Upload error',
        uri: undefined,
        //@ts-ignore
        name: file.originalFilename || '',
        //@ts-ignore
        type: file.mimetype || '',
      }
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
    addAllMembers: boolean
  ) => {
    if (wallet && wallet.publicKey && fanoutData.fanoutId) {
      const metadata = await getMetadata(new PublicKey(nft))
      console.log(metadata.toBase58())
      const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
      const [nativeAccountId] = await FanoutClient.nativeAccount(
        fanoutData.fanoutId
      )
      console.log(nativeAccountId.toBase58())
      console.log(fanoutData.fanoutId.toBase58())
      // Initialize the Arweave Bundle Upload Generator.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
      const bytes = 1024 * 1024 * 10

      let env = 'mainnet-beta'
      let hehe2 = {
        name: hehe.name,
        symbol: hehe.symbol,
        uri: (await uploadFile(JSON.stringify(hehe))).uri,
        creators: hehe.properties.creators,
        sellerFeeBasisPoints: hehe.sellerFeeBasisPoints,
      }
      console.log(hehe2)
      // @ts-ignore
      let tx = new Transaction()
      // @ts-ignore
      const fanoutObj = await fanoutSdk.fetch<Fanout>(
        fanoutData.fanoutId,
        Fanout
      )

      const mint = fanoutObj.mint
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
      let ix = (
        await fanoutSdk.signMetadataInstructions(
          {
            jare: new PublicKey('JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm'),
            mint,
            sourceAccount,
            tokenAccount,
            tokenAccount2,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: MetadataProgram.PUBKEY,
            fanout: fanoutData.fanoutId,
            metadata,
            authority: wallet.publicKey,
            holdingAccount: nativeAccountId,
          },
          hehe2
        )
      ).instructions
      tx.add(...ix)
      let hmm = await executeTransaction(connection, asWallet(wallet), tx, {
        confirmOptions: { skipPreflight: false },
      })
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
            {selectedFanoutMint ? (
              <p className="font-bold uppercase tracking-wide text-md mb-1">
                {selectedFanoutMint.config.symbol} Wallet Token Account:{' '}
                <a
                  className="hover:text-blue-500 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={pubKeyUrl(
                    selectedFanoutMint.data.tokenAccount,
                    environment.label
                  )}
                >
                  {shortPubKey(selectedFanoutMint.data.tokenAccount)}
                </a>
              </p>
            ) : (
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
            )}

            <p className="font-bold uppercase tracking-wide text-md mb-1">
              Cost {fanoutData.data?.fanout?.totalShares.toString()}
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
          <AsyncButton
            type="button"
            variant="primary"
            bgColor="rgb(96 165 250)"
            className="bg-blue-400 text-white hover:bg-blue-500 px-3 py-2 rounded-md mr-2"
            handleClick={async () =>
              fanoutData.data && distributeShare(fanoutData.data, true)
            }
          >
            Clickme!
          </AsyncButton>
        </div>
      </main>
    </div>
  )
}

export default Home
