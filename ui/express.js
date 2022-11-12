const { programs } = require( "@metaplex/js")
const { Connection, PublicKey } = require( "@solana/web3.js")
const cors = require('cors')
const fetch = require('node-fetch')
const express = require( 'express' )
const bodyParser = require("body-parser");
let app = new express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
const  axios  = require( 'axios' )
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

  const DwebLink = (cid) => `https://${cid}.ipfs.dweb.link`


  app.post('/handle', async (request,res) => {
    try {
    console.log((request.body))
    let nft = request.body.nft
    let connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/WM_Gl7ktiws7icLQVxLP5iVHNQTv8RNk")
    const metadatas = (await programs.metadata.Metadata.findByMint (connection, new PublicKey(nft)));
    const metadata = metadatas.pubkey
        let data = (metadatas.data)
        let offchaindata 
        try {
          offchaindata = await ((await axios.get(data.data.uri)))
        } catch (err){
          offchaindata  ={data: hehe}
        }
        console.log(offchaindata)
        offchaindata.data.attributes = hehe.attributes
    //@ts-ignore
    const body = offchaindata.data
    console.log(body)
    try {
      const response = await fetch('https://api.nft.storage/upload', {
        //@ts-ignore
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          Authorization: `Bearer ${
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdEQUY5M2RjM0M4NDk2RkJCNDI2OTJkZTllZTQ1ZjMzYTU0QTQ0MjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0ODE2NTAzODU2MywibmFtZSI6InRlc3QifQ.N-O3tRZHsFo3T8UXC0pOElITz5iCK2ABCjRCxd3yFt0'
          }`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      let json = await response.json()
      offchaindata.data.uri = DwebLink(json.value.cid) + `?ext=json`
      console.log(offchaindata)
      console.log(offchaindata.data)
      let hehe2 = {
        name: offchaindata.data.name,
        symbol: offchaindata.data.symbol,
        uri: offchaindata.data.uri,
        creators: data.data.creators,
        sellerFeeBasisPoints: data.data.sellerFeeBasisPoints,
      }     
         console.log(data)

      //@ts-ignore
      res.json(  {hehe: hehe2})
       
    } catch (error) {
      console.error(error)
      res.json( {
        error: 'Upload error',
        uri: undefined
      })
    }
  } catch (err){

  }
  })


  
  app.listen(8080)