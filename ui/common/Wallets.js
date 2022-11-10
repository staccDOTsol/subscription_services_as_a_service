"use strict";
exports.__esModule = true;
exports.asWallet = void 0;
var asWallet = function (wallet) {
    return {
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
        publicKey: wallet.publicKey
    };
};
exports.asWallet = asWallet;
