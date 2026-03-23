// export const getWalletInfo = (accountId: string | null, evmAddress: string | null) => {
//   return `
// Wallet Information
// Account ID: ${accountId}
// EVM Address: ${evmAddress}
// `;
// };

// export const summarizeMessages = (chat: any[]) => {
//   const text = chat.map(m => m.text).join(" ");
//   return text.slice(0, 500); // simple summary input
// };


export const getWalletInfo = (
  accountId: string | null,
  evmAddress: string | null
) => {
  return `
Wallet Information

Account ID: ${accountId}
EVM Address: ${evmAddress}

This wallet operates on the Hedera network.
`;
};

export const summarizeMessages = (chat: any[]) => {
  const text = chat.map((m) => m.text).join("\n");

  return text.slice(0, 1200);
};

