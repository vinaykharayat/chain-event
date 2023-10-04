export default function AboutChainEvent() {
  return (
    <dialog
      id="about-chain-event"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">About Chain Event!</h3>
        <p className="py-4">
          Chain event is a simple open-source website created with Next.js and
          Wagmi!
        </p>
        <p>
          Purpose of this website is to listen to the event on tokens. Curently
          this website listens to add liquidity event.
        </p>
        <p>
          Lets say you have a pool in Uniswap and you want to check if any
          liquidity is added to a certain pool, then you can use my website.
        </p>
        <p>
          I take the token addresses and get pool address from the Uniswap
          Factory. Then I listen to mint event on Pool smart contract.
        </p>
        <p>
          If you find any issue or want to add some functionality you can open a
          github issue or pull request for the same.
        </p>
        <p>Thank you!</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
