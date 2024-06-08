// import { configureChains, createConfig, WagmiConfig } from 'wagmi';
// import { mainnet, goerli } from 'wagmi/chains';
// import { publicProvider } from 'wagmi/providers/public';
// import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
//
// const { chains, provider } = configureChains(
//     [mainnet, goerli],
//     [publicProvider()]
// );
//
// const { connectors } = getDefaultWallets({
//     appName: 'My RainbowKit App',
//     chains
// });
//
// const wagmiClient = createConfig({
//     autoConnect: true,
//     connectors,
//     provider
// });
//
// export { chains, wagmiClient, RainbowKitProvider };