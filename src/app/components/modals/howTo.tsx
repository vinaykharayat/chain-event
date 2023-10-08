export default function HowToModal() {
  return (
    <dialog id="how-to" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">How To!</h3>
        <p className="py-4">
          It is pretty simple application. Follow the steps below
        </p>
        <div>
          <ol>
            <li className="list-item">
              Find the address of the token A eg,{" "}
              <code className="bordered">
                0xF345Bc6a899024fB917FCCeea47DC05170ca0BD0
              </code>
            </li>
            <li className="list-item">
              Find the address of the token B eg,{" "}
              <code>0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14</code>
            </li>
            <li className="list-item">Select the network type</li>
            <li className="list-item">Select the pool fees</li>
            <li className="list-item">
              Click on <q>Start listening</q> button
            </li>
          </ol>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
