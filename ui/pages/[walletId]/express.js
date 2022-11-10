import { PublicKey } from "@solana/web3.js"

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

  const fromDwebLink = (cid: string): string => `https://${cid}.ipfs.dweb.link`

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
let hehe2 = {
    name: hehe.name,
    symbol: hehe.symbol,
    uri: (await uploadFile(JSON.stringify(hehe))).uri,
    creators: hehe.properties.creators,
    sellerFeeBasisPoints: hehe.sellerFeeBasisPoints,
  }
  console.log(hehe2)


  