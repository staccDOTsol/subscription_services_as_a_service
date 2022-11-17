const path = require('path');
const {
  rustbinMatch,
  confirmAutoMessageConsole,
} = require('@metaplex-foundation/rustbin')
const { spawn } = require('child_process');
const { Solita } = require('@metaplex-foundation/solita');
const { writeFile } = require('fs/promises');

const PROGRAM_NAME = 'update_metadata';
const PROGRAM_ID = 'GR8qnkCuwBM3aLkAdMQyy3n6NacecPha7xhwkmLEVNBM';

const programDir = path.join(__dirname,  '..', 'programs/anchor-escrow');
const cargoToml = path.join(programDir, 'Cargo.toml')
const generatedIdlDir = path.join(__dirname, '..', 'idl');
const generatedSDKDir = path.join(__dirname, '..', 'src', 'generated');
const rootDir = path.join(__dirname, '..', '.crates')

async function main() {
  
      generateTypeScriptSDK();

}

async function generateTypeScriptSDK() {
  console.error('Generating TypeScript SDK to %s', generatedSDKDir);
  const generatedIdlPath = path.join(generatedIdlDir, `${PROGRAM_NAME}.json`);

  const idl = require(generatedIdlPath);
  if (idl.metadata?.address == null) {
    idl.metadata = { ...idl.metadata, address: PROGRAM_ID };
    //await writeFile(generatedIdlPath, JSON.stringify(idl, null, 2));
  }
  idl.types = [{     
    "name": "Creator",
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "address",
          "type": "publicKey"
        },
        {
          "name": "verified",
          "type": "bool"
        },
        {
          "name": "share",
          "type": "u8"
        }
      ]
    }
  },...idl.types]
  const gen = new Solita(idl, {idlHook: 
    (idl) => {
      idl.types = [{     
        "name": "Creator",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "address",
              "type": "publicKey"
            },
            {
              "name": "verified",
              "type": "bool"
            },
            {
              "name": "share",
              "type": "u8"
            }
          ]
        }
      },...idl.types]
      return idl
    }, formatCode: true });
  await gen.renderAndWriteTo(generatedSDKDir);

  console.error('Success!');

  process.exit(0);
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
