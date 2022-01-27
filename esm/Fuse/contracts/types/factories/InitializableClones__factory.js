/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Contract, utils } from "ethers";
const _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "instance",
                type: "address",
            },
        ],
        name: "Deployed",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "master",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "initializer",
                type: "bytes",
            },
        ],
        name: "clone",
        outputs: [
            {
                internalType: "address",
                name: "instance",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];
export class InitializableClones__factory {
    static createInterface() {
        return new utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new Contract(address, _abi, signerOrProvider);
    }
}
InitializableClones__factory.abi = _abi;