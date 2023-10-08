import AboutChainEvent from "./modals/aboutChainEvent";
import ContactUsModal from "./modals/contactUs";
import HowToModal from "./modals/howTo";

export default function Navigation() {
  return (
    <div className="navbar bg-base-100 fixed">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a
                onClick={() =>
                  (
                    document.getElementById("how-to") as HTMLDialogElement
                  ).showModal()
                }
              >
                How to
              </a>
            </li>
            {/* <li tabIndex={0}>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li> */}

            <li>
              <a
                onClick={() =>
                  (
                    document.getElementById(
                      "about-chain-event"
                    ) as HTMLDialogElement
                  ).showModal()
                }
              >
                About chain event
              </a>
            </li>

            <li>
              <a
                onClick={() =>
                  (
                    document.getElementById("about-me") as HTMLDialogElement
                  ).showModal()
                }
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl">Chain Event</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a
              onClick={() =>
                (
                  document.getElementById("how-to") as HTMLDialogElement
                ).showModal()
              }
            >
              How to
            </a>
          </li>
          {/* <li tabIndex={0}>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li> */}

          <li>
            <a
              onClick={() =>
                (
                  document.getElementById(
                    "about-chain-event"
                  ) as HTMLDialogElement
                ).showModal()
              }
            >
              About chain event
            </a>
          </li>

          <li>
            <a
              onClick={() =>
                (
                  document.getElementById("about-me") as HTMLDialogElement
                ).showModal()
              }
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn" href="https://github.com/vinaykharayat/chain-event">
          <svg
            className="w-4 h-4 mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
              clip-rule="evenodd"
            />
          </svg>
          GitHub
        </a>
        <HowToModal />
        <ContactUsModal />
        <AboutChainEvent />
      </div>
    </div>
  );
}
