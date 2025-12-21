// Minimal declaration for sockjs-client to silence TypeScript when no @types package is present.
// Declares the default export as `any` so code can interop with both CJS and ESM builds.
declare module 'sockjs-client' {
  const SockJS: unknown;
  export default SockJS;
}
